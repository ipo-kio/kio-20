import HeatingProcess from "../solver/HeatingProcess";
import {Palette} from "./Palette";
import {Slice} from "../solver/Slice";

export default class ProcessDrawer extends createjs.Shape {

    private _process: HeatingProcess = null;
    private sliceType: SliceType;
    private _v0: number = 0;
    private dx: number;
    private dy: number;
    private width: number;
    private height: number;

    private _update_listener: () => void;

    constructor(sliceType: SliceType, dx: number, dy: number, width: number, height: number) {
        super();
        this.sliceType = sliceType;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;

        this._update_listener = () => {
            this.update_graphics();
        };

        this.update_graphics();
        this.alpha = 1;
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
        if (this.sliceType === SliceType.XY)
            return this._process.xy_slice(this._v0, this.dx, this.dy);
        else
            return this._process.ty_slice(this._v0, this.dx, this.dy);
    }

    private update_graphics() {
        let g = this.graphics;
        g.clear();
        if (!this._process)
            return;

        let slice = this.slice;
        let a = slice.width - 2; //for x
        let b = slice.height - 2; //for y
        let w = this.width / a;
        let h = this.height / b;
        for (let x = 0; x < a; x += 1)
            for (let y = 0; y < b; y += 1) {
                // let color = this.palette.get(color_index++); //slice[x][y]);
                // if (color_index > 200)
                //     color_index = 0;
                let color = Palette.palette0100.get(slice.get(x + 1, y + 1));
                g.beginFill(color).rect(x * w, y * h, w, h);
            }

        if (this.sliceType === SliceType.TY && this.process.last_layer <= this.process.t_max) {
            let x = w * this._process.last_layer / 5;
            g.beginStroke('white').setStrokeStyle(1).moveTo(x, 0).lineTo(x, this.height).endStroke();
        }

        this.cache(0, 0, this.width, this.height);
    }

    get process(): HeatingProcess {
        return this._process;
    }

    set process(value: HeatingProcess) {
        this._process = value;

        if (this._process) {
            this._process.removeEventListener("heat update", this._update_listener);
            this._process.stop_update();
        }

        this.update_graphics();

        this._process.addEventListener("heat update", this._update_listener);
    }
}

export enum SliceType {
    XY,
    TY
}