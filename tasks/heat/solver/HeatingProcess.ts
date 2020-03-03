import {Layer, Solver} from "./Solver";
import {DimensionDescription} from "./DimensionDescription";
import Body from "../Body";
import {Slice} from "./Slice";
import {N_element, N_time} from "../ui/BodyUI";

export default class HeatingProcess {

    private values: Layer[];

    constructor(body: Body) {
        console.log('here');
        let solver = new Solver(
            body,
            new DimensionDescription(0, 1, N_element * body.width + 2, true),
            new DimensionDescription(0, 1, N_element * body.height + 2, true),
            new DimensionDescription(0, 10, N_time + 1, false),
            (x: number, y: number) => 0,
            phi0
        );

        this.values = solver.u;
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