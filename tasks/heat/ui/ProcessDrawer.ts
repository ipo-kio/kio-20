import HeatingProcess from "../HeatingProcess";
import {Palette} from "./Palette";

export default class ProcessDrawer extends createjs.Shape {

    private process: HeatingProcess;
    private sliceType: SliceType;
    private _v0: number = 0;
    private dx: number;
    private dy: number;
    private pallete: Palette = new Palette(0, 100);
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

    get slice(): number[][] {
        if (this.sliceType === SliceType.XY)
            return this.process.xy_slice(this._v0, this.dx, this.dy);
        else
            return this.process.ty_slice(this._v0, this.dx, this.dy);
    }

    private update_graphics() {
        let g = this.graphics;
        g.clear();
        let slice = this.slice;
        let a = slice.length;
        let b = slice[0].length;
        let w = this.width / b;
        let h = this.height / a;
        for (let j = 0; j < a; j++)
            for (let i = 0; i < b; i++) {
                let color = this.pallete.get(slice[j][i]);
                g.beginFill(color).rect(j * w, i * h, w, h);
            }
    }
}

export enum SliceType {
    XY,
    TY
}