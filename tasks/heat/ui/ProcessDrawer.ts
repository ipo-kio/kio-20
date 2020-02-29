import HeatingProcess from "../solver/HeatingProcess";
import {Palette} from "./Palette";
import {Slice} from "../solver/Slice";

export default class ProcessDrawer extends createjs.Shape {

    private process: HeatingProcess;
    private sliceType: SliceType;
    private _v0: number = 0;
    private dx: number;
    private dy: number;
    private width: number;
    private height: number;

    constructor(process: HeatingProcess, sliceType: SliceType, dx: number, dy: number, width: number, height: number) {
        super();
        this.process = process;
        this.sliceType = sliceType;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;

        this.update_graphics();
        this.alpha = 0.4;
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
            return this.process.xy_slice(this._v0, this.dx, this.dy);
        else
            return this.process.ty_slice(this._v0, this.dx, this.dy);
    }

    private update_graphics() {
        let g = this.graphics;
        g.clear();
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
    }
}

export enum SliceType {
    XY,
    TY
}