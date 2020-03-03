import {DimensionDescription} from "./DimensionDescription";
import Body from "../Body";

export type Layer = number[][];
export type LayerFunction = (x: number, y: number) => number;

export class Solver {

    private a: Layer;
    private phi0: Layer;
    private heat: Layer;
    private xd: DimensionDescription;
    private yd: DimensionDescription;
    private td: DimensionDescription;

    private _u: Layer[];

    //for tridiagonal matrix algorithm
    private A: number[];
    private B: number[];

    constructor(
        body: Body,
        xd: DimensionDescription,
        yd: DimensionDescription,
        td: DimensionDescription,
        phi0: LayerFunction,
        heat: LayerFunction
    ) {
        console.log('here');
        this.xd = xd;
        this.yd = yd;
        this.td = td;
        console.log('dx, dy, dz', this.xd.dx, this.yd.dx, this.td.dx);

        this.phi0 = this.lay_out(phi0);
        this.heat = this.lay_out(heat);
        this.a = this.lay_out((x: number, y: number) => {
            let xx = (x - xd.min) / (xd.max - xd.min);
            let yy = (y - yd.min) / (yd.max - yd.min);

            let xi = Math.floor(xx * body.width);
            if (xi < 0)
                xi = 0;
            if (xi >= body.width)
                xi = body.width - 1;

            let yi = Math.floor(yy * body.height);
            if (yi < 0)
                yi = 0;
            if (yi >= body.height)
                yi = body.height - 1;

            return body.a(xi, yi);
        });

        console.log(this.a);

        this.A = new Array(xd.n);
        this.B = new Array(xd.n);

        this.solve();
    }

    lay_out(f: LayerFunction): Layer {
        let result: Layer = new Array(this.xd.n);

        for (let x = 0; x < this.xd.n; x++) {
            let line = new Array(this.yd.n);
            result[x] = line;
            let vx = this.xd.v(x);
            for (let y = 0; y < this.yd.n; y++)
                line[y] = f(vx, this.yd.v(y));
        }

        return result;
    }

    private solve() {
        let u = new Array(this.td.n);
        this._u = u;
        u[0] = this.phi0;
        let x_max = this.xd.n - 1;
        let y_max = this.yd.n - 1;
        let tau = this.td.dx;
        let h = this.xd.dx;
        let h2 = h * h;

        let sys: number[][] = new Array(4);
        for (let i = 0; i < 4; i++)
            sys[i] = new Array(x_max + 1); //TODO here x_max == y_max

        sys[0][0] = 0;
        sys[1][0] = 1;
        sys[2][0] = -1;
        sys[3][0] = 0;
        sys[0][x_max] = 1;
        sys[1][x_max] = -1;
        sys[2][x_max] = 0;
        sys[3][x_max] = 0;

        for (let t = 1; t < this.td.n; t++) {
            let v0 = u[t - 1];
            let v1 = this.lay_out((x, y) => 0);
            u[t] = v1;

            //(v1[x,y]-v0[x,y]) / tau - a (
            //      v1[x-1,y]-2v1[x,y]+v1[x+1,y] +
            //      v0[x,y-1]-2v0[x,y]+v0[x,y+1]
            //) / h^2 = f(x, y)
            //
            //x = 1 .. max_x - 1
            //y = 1 .. max_y - 1

            if (t % 2 == 1) {
                for (let y = 1; y < y_max; y++) {
                    sys[0][0] = 0;
                    sys[1][0] = -1;
                    sys[2][0] = 1;
                    sys[3][0] = h * 1000;

                    for (let x = 1; x < x_max; x++) {
                        let a = this.a[x][y];
                        //v1[x-1, y]
                        sys[0][x] = -a / h2;

                        //v1[x, y]
                        sys[1][x] = 1 / tau + 2 * a / h2;

                        //v1[x+1, y]
                        sys[2][x] = -a / h2;

                        //----
                        sys[3][x] = v0[x][y] / tau + a * (v0[x][y - 1] - 2 * v0[x][y] + v0[x][y + 1]) / h2 + this.heat[x][y];
                    }

                    this.solve_3sys(sys, v1, -1, y);
                }
            } else {
                for (let x = 1; x < x_max; x++) {
                    for (let y = 1; y < y_max; y++) {
                        let a = this.a[x][y];
                        sys[0][y] = -a / h2;
                        sys[1][y] = 1 / tau + 2 * a / h2;
                        sys[2][y] = -a / h2;
                        sys[3][y] = v0[x][y] / tau + a * (v0[x - 1][y] - 2 * v0[x][y] + v0[x + 1][y]) / h2 + this.heat[x][y];
                    }

                    this.solve_3sys(sys, v1, x, -1);
                }
            }
        }
    }

    private solve_3sys(sys: number[][], v1: Layer, x: number, y: number) {
        // https://3ys.ru/metody-resheniya-nelinejnykh-uravnenij-i-zadach-linejnoj-algebry/metod-progonki.html
        let A = this.A;
        let B = this.B;

        A[0] = -sys[2][0] / sys[1][0];
        B[0] = sys[3][0] / sys[1][0];

        let n = A.length;

        for (let i = 1; i < n - 1; i++) {
            let e = sys[0][i] * A[i - 1] + sys[1][i];
            A[i] = -sys[2][i] / e;
            B[i] = (sys[3][i] - sys[0][i] * B[i - 1]) / e;
        }

        let xn = (sys[3][n - 1] - sys[0][n - 1] * B[n - 2]) / (sys[1][n - 1] + sys[0][n - 1] * A[n - 2]);
        set(n - 1, xn);

        for (let i = n - 2; i >= 0; i--) {
            xn = A[i] * xn + B[i];
            set(i, xn);
        }

        function set(ind: number, value: number) {
            if (x === -1)
                v1[ind][y] = value;
            else
                v1[x][ind] = value;
        }
    }

    get u(): Layer[] {
        return this._u;
    }
}