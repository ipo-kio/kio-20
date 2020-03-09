import HeatingProcess from "../solver/HeatingProcess";
import {Palette} from "./Palette";
import {Slice} from "../solver/Slice";
import {TIME_DIVISION} from "../solver/Consts";
import SolverUpdateEvent from "../solver/SolverUpdateEvent";

export default class ProcessDrawer extends createjs.Bitmap {

    private _process: HeatingProcess = null;
    private sliceType: SliceType;
    private _v0: number = 0;
    private dx: number;
    private dy: number;
    private width: number;
    private height: number;

    private _canvas: HTMLCanvasElement;

    private _update_listener: (sue: SolverUpdateEvent) => void;

    constructor(sliceType: SliceType, dx: number, dy: number, width: number, height: number) {
        super(document.createElement("canvas"));
        this._canvas = this.image as HTMLCanvasElement;
        this.sliceType = sliceType;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;

        this._canvas.width = width;
        this._canvas.height = height;

        this._update_listener = sue => {
            this.update_graphics(sue.from, sue.to);
            this.dispatchEvent("heat update");
        };

        this.update_graphics();
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get v0(): number {
        return this._v0;
    }

    set v0(value: number) {
        if (this._v0 === value)
            return;
        this._v0 = value;
        this.update_graphics();
    }

    get slice(): Slice {
        let v0 = this._v0;
        v0 = Math.round(v0 / TIME_DIVISION) * TIME_DIVISION;
        if (v0 > this._process.t_max)
            v0 -= TIME_DIVISION;

        if (this.sliceType === SliceType.XY)
            return this._process.xy_slice(v0, this.dx, this.dy);
        else
            return this._process.ty_slice(v0, this.dx, this.dy);
    }

    private update_graphics(from: number = 0, to: number = -1) {
        if (!this._process)
            return;

        if (to === -1)
            to = this._process.t_max + 1;

        if (this.sliceType == SliceType.XY && (this.v0 < from || this.v0 >= to))
            return;

        let ctx = this.canvas.getContext('2d');

        let slice = this.slice;
        let a = slice.width - 2; //for x
        let b = slice.height - 2; //for y
        let w = this.width / a;
        let h = this.height / b;
        for (let x = 0; x < a; x += 1) {
            //TODO x * TIME_DIVISION is taken from internals of slice, so this is not the best place
            if (this.sliceType == SliceType.TY && (x * TIME_DIVISION < from - 1 || x * TIME_DIVISION >= to))
                continue;
            if (this.sliceType == SliceType.TY && x * TIME_DIVISION > this._process.last_layer) {
                ctx.fillStyle = Palette.DEFAULT_COLOR;
                ctx.fillRect(x * w, 0, this.width - x * w, this.height);
                break;
            }
            for (let y = 0; y < b; y += 1) {
                // let color = this.palette.get(color_index++); //slice[x][y]);
                // if (color_index > 200)
                //     color_index = 0;
                let x1 = this.sliceType == SliceType.TY ? x : x + 1;
                ctx.fillStyle = Palette.palette0100.get(slice.get(x1, y + 1));
                ctx.fillRect(x * w, y * h, w, h);
            }
        }

        /*if (this.sliceType === SliceType.TY && this.process.last_layer <= this.process.t_max) {
            let x = w * this._process.last_layer / TIME_DIVISION;
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }*/

        if (this.sliceType === SliceType.TY && this.process.heat_position !== -1) {
            let x = w * this._process.heat_position / TIME_DIVISION;
            ctx.beginPath();
            ctx.moveTo(x, -16);
            ctx.lineTo(x, this.height + 16 * 2);

            ctx.save();
            ctx.strokeStyle = 'rgb(50, 50, 50)';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.stroke();
            ctx.restore();
        }
    }

    get process(): HeatingProcess {
        return this._process;
    }

    set process(value: HeatingProcess) {
        if (value === this._process)
            return;

        if (this._process) {
            this._process.removeEventListener("heat update", this._update_listener);
            this._process.stop_update();
        }

        this._process = value;

        this.update_graphics();

        this._process.addEventListener("heat update", this._update_listener);
    }
}

export enum SliceType {
    XY,
    TY
}