import {Layer, LayerFunction, Solver} from "./Solver";
import {DimensionDescription} from "./DimensionDescription";
import Body from "../Body";
import {Slice} from "./Slice";
import {N_element, N_time} from "../ui/BodyUI";

export default class HeatingProcess {

    private values: Layer[];
    private _heat_position: number;

    constructor(body: Body) {
        let solver = new Solver(
            body,
            new DimensionDescription(0, 1, N_element * body.width + 2, true),
            new DimensionDescription(0, 1, N_element * body.height + 2, true),
            new DimensionDescription(0, 50, N_time + 1, false),
            (x: number, y: number) => 0,
            sum_layer_functions(
                create_point_heat(1 / 12, 3 / 12, 1 / 12, 100),
                create_point_heat(1 / 12, 5 / 12, 1 / 12, 100),
                create_point_heat(1 / 12, 9 / 12, 1 / 12, 100)
            ),
            y => 0
        );

        this.values = solver.u;
        this._heat_position = this.find_heat_position();
        console.log('hp', this._heat_position);
    }

    get x_max(): number {
        return this.values[0].length - 1;
    }

    get y_max(): number {
        return this.values[0][0].length - 1;
    }

    get t_max(): number {
        return this.values.length - 1;
    }

    get heat_position(): number {
        return this._heat_position;
    }

    xy_slice(t: number, dx: number, dy: number): Slice {
        // *0 1 *2 3 *4
        let x_max = this.x_max;
        let y_max = this.y_max;
        let time = this.values[t];

        let nx = Math.floor(x_max / dx);
        let ny = Math.floor(y_max / dy);

        // x <= nx
        // nx * dx <= x_max => nx <= x_max / dx

        return {
            width: nx + 1,
            height: ny + 1,
            get(x, y) {
                return time[x * dx][y * dy];
            }
        };
    }

    ty_slice(x: number, dy: number, dt: number): Slice {
        let nt = Math.floor(this.t_max / dt);
        let ny = Math.floor(this.y_max / dy);
        let values = this.values;

        return {
            width: nt + 1,
            height: ny + 1,
            get(t, y) {
                return values[t * dt][x][y * dy];
            }
        };
    }

    get debug() {
        return JSON.stringify(this.values);
    }

    private find_heat_position() {
        for (let t = 0; t < this.values.length; t++) {
            let mean = this.mean_temperature(t);
            if (mean >= 50)
                return t;
        }
        return -1;
    }

    private mean_temperature(t: number): number {
        let n = this.values[0][0].length - 2;
        let s = 0;
        for (let y = 1; y < this.values[0][0].length - 1; y++)
            s += this.values[t][this.values[0].length - 1][y];

        return s / n;
    }
}

let num_out = 0;

function log(m: any, title?: string) {
    if (num_out > 30)
        return;

    if (title)
        console.log(title, m);
    else
        console.log(m);

    num_out++;
}


const MAX_T = 100;
const T_DIST = 0.1;
const phi0 = (x: number, y: number) => {
    if (x < 0)
        return MAX_T;
    if (x > T_DIST)
        return 0;

    x /= T_DIST;
    x = 1 - x;

    return (3 * x * x - 2 * x * x * x) * MAX_T;
};
const phi0_zero = (x: number, y: number) => 0;

function create_point_heat(x0: number, y0: number, r: number, T: number): LayerFunction {
    return (x: number, y: number) => {
        let dx = x - x0;
        let dy = y - y0;
        let d = Math.sqrt(dx * dx + dy * dy);
        let s = 1 - d / r;
        if (s < 0)
            return 0;
        return T * s * s * (3 - 2 * s);
    };
}

function sum_layer_functions(...lfs: LayerFunction[]): LayerFunction {
    return (x, y) => {
        let s = 0;
        for (let lf of lfs)
            s += lf(x, y);
        return s;
    }
}