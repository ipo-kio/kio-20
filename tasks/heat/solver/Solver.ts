import {DimensionDescription} from "./DimensionDescription";
import {A_DEBUG, Material} from "./Consts";
import SolverUpdateEvent from "./SolverUpdateEvent";
import {Palette} from "../ui/Palette";
import Body from "../Body";

export type Layer = number[][];
export type LayerFunction = (x: number, y: number) => number;
export type LeftHeatFlowFunction = (y: number) => number;

export class Solver extends createjs.EventDispatcher {

    private a: Layer;
    private k: Layer;
    private phi0: Layer;
    private heat: Layer;
    private left_heat: number[];
    private xd: DimensionDescription;
    private yd: DimensionDescription;
    private td: DimensionDescription;

    private _u: Layer[];
    private _last_layer = 0; //exclusive
    private cancel_evaluations = false;

    //for tridiagonal matrix algorithm
    private A: number[];
    private B: number[];

    constructor(
        body: Body,
        xd: DimensionDescription,
        yd: DimensionDescription,
        td: DimensionDescription,
        phi0: LayerFunction,
        heat: LayerFunction,
        left_heat: LeftHeatFlowFunction
    ) {
        super();
        this.xd = xd;
        this.yd = yd;
        this.td = td;

        this.phi0 = this.lay_out(phi0);
        this.heat = this.lay_out(heat);
        let lay_function = (a_or_k: number) => (x: number, y: number) => {
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

            return a_or_k == 0 ? body.a(xi, yi) : body.k(xi, yi);
        };
        this.a = this.lay_out(lay_function(0));
        this.k = this.lay_out(lay_function(1));
        //left heat
        this.left_heat = new Array(yd.n);
        for (let y = 0; y < yd.n; y++)
            this.left_heat[y] = left_heat(yd.v(y));

        this.A = new Array(xd.n);
        this.B = new Array(xd.n);

        this.pre_solve();

        let do_next = () => {
            if (this._last_layer === this.td.n || this.cancel_evaluations)
                return;

            // console.time("solver step");

            let t0 = this._last_layer;
            let t1 = t0 + 4;
            if (t1 > this.td.n)
                t1 = this.td.n;
            this.solve(t1);
            this.dispatchEvent(new SolverUpdateEvent(t0, t1));

            requestAnimationFrame(do_next);

            // console.timeEnd("solver step");
        };
        requestAnimationFrame(do_next);

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

    private pre_solve() {
        let u = new Array(this.td.n);
        this._u = u;
        u[0] = this.phi0;
        this._last_layer = 1;

        /*console.time("ps");
        for (let t = 1; t < this.td.n; t++) {
            u[t] = this.lay_out(() => 0);
        }
        console.timeEnd("ps");*/

        let def = Palette.DEFAULT_VALUE;

        let tn = this.td.n;
        let xn = this.xd.n;
        let yn = this.yd.n;
        for (let t = 1; t < tn; t++) {
            let v = Array(xn);
            u[t] = v;
            for (let x = 0; x < xn; x++) {
                // let vv = new Float64Array(10).fill(0); //Array(yn);
                let vv = Array(yn);
                v[x] = vv;
                for (let y = 0; y < yn; y++)
                    vv[y] = def;
            }
        }
    }


    private solve(to: number) {
        if (this._last_layer >= to)
            return;

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

        for (let t = this._last_layer; t < to; t++) {
            let v0 = this._u[t - 1];
            let v1 = this._u[t];

            //(v1[x,y]-v0[x,y]) / tau - a (
            //      v1[x-1,y]-2v1[x,y]+v1[x+1,y] +
            //      v0[x,y-1]-2v0[x,y]+v0[x,y+1]
            //) / h^2 = f(x, y)
            //
            //x = 1 .. max_x - 1
            //y = 1 .. max_y - 1

            if (t % 2 == 1) {
                for (let y = 1; y < y_max; y++) {
                    // sys[0][0] = 0;
                    // sys[1][0] = -1;
                    // sys[2][0] = 1;
                    // sys[3][0] = h * this.left_heat[y];

                    for (let x = 1; x < x_max; x++) {
                        let a = this.a[x][y];
                        let k = this.k[x][y];
                        //v1[x-1, y]
                        sys[0][x] = -a / h2;

                        //v1[x, y]
                        sys[1][x] = 1 / tau + 2 * a / h2;

                        //v1[x+1, y]
                        sys[2][x] = -a / h2;

                        //----
                        //a: m^2/s
                        //k: Bt/(m K)
                        //a/k: m^3 K / Bt s = m K s s / kg
                        //Bt = kg m m / s s s

                        let heat = this.heat[x][y] * a / k;
                        sys[3][x] = v0[x][y] / tau + a * (v0[x][y - 1] - 2 * v0[x][y] + v0[x][y + 1]) / h2 + heat;
                    }

                    this.solve_3sys(sys, v1, -1, y);
                }
            } else {
                for (let x = 1; x < x_max; x++) {
                    for (let y = 1; y < y_max; y++) {
                        let a = this.a[x][y];
                        let k = this.k[x][y];
                        sys[0][y] = -a / h2;
                        sys[1][y] = 1 / tau + 2 * a / h2;
                        sys[2][y] = -a / h2;
                        let heat = this.heat[x][y] * a / k;
                        sys[3][y] = v0[x][y] / tau + a * (v0[x - 1][y] - 2 * v0[x][y] + v0[x + 1][y]) / h2 + heat;
                    }

                    this.solve_3sys(sys, v1, x, -1);
                }
            }
        }

        this._last_layer = to;
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

        if (x !== -1) {
            let n = sys[0].length;
            for (let y = 0; y < n; y++) {
                let s = v1[x][y] * sys[1][y];
                if (y - 1 >= 0) s += v1[x][y - 1] * sys[0][y];
                if (y + 1 < n) s += v1[x][y + 1] * sys[2][y];
                s -= sys[3][y];
                if (Math.abs(s) > 1e-3)
                    console.log("err", s, y, v1[x], sys[0][y], sys[1][y], sys[2][y], sys[3][y]);
            }
        }
    }

    get u(): Layer[] {
        return this._u;
    }

    get last_layer(): number {
        return this._last_layer;
    }

    stop_update() {
        this.cancel_evaluations = true;
    }

    private debug_a() {
        let s = '';
        for (let y = 0; y < this.a.length; y++) {
            for (let x = 0; x < this.a[y].length; x++) {
                let a = this.a[x][y];
                let c = '?';
                for (let av in A_DEBUG)
                    if (A_DEBUG[av as Material] === a)
                        c = av[av.length - 1];
                s += c;
            }
            s += '\n';
        }
        console.log('a=', s);
    }
}