import {DimensionDescription} from "./DimensionDescription";
import Body from "../Body";

type Layer = number[][];
export type LayerFunction = (x: number, y: number) => number;

export class Solver {

    private a: Layer;
    private phi0: Layer;
    private heat: Layer;
    private xd: DimensionDescription;
    private yd: DimensionDescription;
    private td: DimensionDescription;

    constructor(
        body: Body,
        xd: DimensionDescription,
        yd: DimensionDescription,
        td: DimensionDescription,
        phi0: LayerFunction,
        heat: LayerFunction
    ) {
        this.xd = xd;
        this.yd = yd;
        this.td = td;

        this.phi0 = this.lay_out(phi0);
        this.heat = this.lay_out(heat);
        this.a = this.lay_out((x:number, y:number) => {
            let xx = (x - xd.min) / (xd.max - xd.min);
            let yy = (x - xd.min) / (yd.max - yd.min);

            let xi = Math.floor(xx * body.width);
            if (xi >= body.width)
                xi = body.width - 1;
            let yi = Math.floor(xx * body.height);
            if (yi >= body.height)
                yi = body.height - 1;

            return body.a(xi, yi);
        });
    }

    lay_out(f: LayerFunction): Layer {
        let result: Layer = new Array(this.yd.n);

        for (let y = 0; y < this.yd.n; y++) {
            let line = new Array(this.xd.n);
            result[y] = line;
            let vy = this.yd.v(y);
            for (let x = 0; x < this.xd.n; x++)
                line[x] = f(this.xd.v(x), vy);
        }

        return result;
    }
}