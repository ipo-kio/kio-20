import HeatingProcess from "../HeatingProcess";

export default class ProcessDrawer extends createjs.Shape {

    process: HeatingProcess;
    private sliceType: SliceType;
    private v0: number = 0;
    private dx: number;
    private dy: number;

    constructor(process: HeatingProcess, sliceType: SliceType, dx: number, dy: number, width: number, height: number) {
        super();
        this.process = process;
        this.sliceType = sliceType;
        this.dx = dx;
        this.dy = dy;

        this.update_graphics();
    }

    get slice(): number[][] {
        if (this.sliceType === SliceType.XY)
            return this.process.xy_slice(this.v0, this.dx, this.dy);
        else
            return this.process.ty_slice(this.v0, this.dx, this.dy);
    }

    private update_graphics() {

    }
}

export enum SliceType {
    XY,
    TY
}