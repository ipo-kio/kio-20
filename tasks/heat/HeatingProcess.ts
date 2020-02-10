import Grid from "./Grid";

export default class HeatingProcess {
    private readonly g: Grid;
    private readonly values: number[][][];
    private readonly left_edge_initial: (x: number) => number;
    private readonly left_edge_heat: (x: number) => number;

    constructor(g: Grid, left_edge_initial: (y: number) => number, left_edge_heat: (y: number) => number) {
        this.g = g;
        this.left_edge_initial = left_edge_initial;
        this.left_edge_heat = left_edge_heat;

        this.values = new Array(g.N_time + 1);
        for (let t = 0; t <= g.N_time; t++) {
            this.values[t] = new Array(g.N_width + 1);
            for (let x = 0; x <= g.N_width; x++)
                this.values[t][x] = new Array(g.N_height + 1);
        }

        this.fillInitialValues();
        this.solve();
    }

    private fillInitialValues() {
        for (let x = 0; x <= this.g.N_width; x++)
            for (let y = 0; y <= this.g.N_height; y++)
                this.values[0][x][y] = x === 0 ? this.left_edge_initial(y) : 0;
    }

    private solve() {
        //du/dt - a^2 Δ u = f(t, x, y)
        //t = 0: (u(t + 1, x, y) - u(t, x, y)) / dt - a^2 delta_u(t, x, y) = f(t, x, y)
        //t > 0: (u(t + 1, x, y) - 2u(t, x, y) + u(t - 1, x, y)) / dt - a^2 delta_u(t, x, y) = f(t, x, y)

        let dh = this.g.dh;
        let dt = this.g.dt;
        let w = this.g.N_width;
        let h = this.g.N_height;

        let values = this.values;
        let dhh = dh * dh;

        // for t = 1
        //(values[t] - values[t - 1]) / dh - a^2 delta_u(t - 1) = f(t - 1, x, y)
        let u = values[0];
        let u1 = values[1];
        for (let x = 0; x <= w; x++)
            for (let y = 0; y <= h; y++) {
                let fxy = x === 0 ? this.left_edge_heat(y) : 0;
                u1[x][y] = (fxy + this.g.a(x, y) * delta_u(u, x, y)) * dt + u[x][y];
            }

        //(v[t] - v[t - 2]) / (2 * dt) - a^2 delta_u(t - 1) = f(t - 1, x, y)
        for (let t = 2; t <= this.g.N_time; t++) {
            let u = values[t - 2];
            let u1 = values[t - 1];
            let u2 = values[t];
            for (let x = 0; x <= w; x++)
                for (let y = 0; y <= h; y++) {
                    let fxy = x === 0 ? this.left_edge_heat(y) : 0;
                    u2[x][y] = (fxy + this.g.a(x, y) * delta_u(u1, x, y)) * 2 * dt + u[x][y];
                }
        }

        function delta_u(u: number[][], x: number, y: number) {
            let delta: number = 0;

            // by x
            if (x === 0)
                delta += 2 * u[x][y] - 5 * u[x + 1][y] + 4 * u[x + 2][y] - u[x + 3][y];
            else if (x === w)
                delta += -u[x - 3][y] + 4 * u[x - 2][y] - 5 * u[x - 1][y] + 2 * u[x][y];
            else
                delta += u[x - 1][y] - 2 * u[x][y] + u[x + 1][y];

            // by y
            if (y === 0)
                delta += 2 * u[x][y] - 5 * u[x][y + 1] + 4 * u[x][y + 2] - u[x][y + 3];
            else if (x === w)
                delta += -u[x][y - 3] + 4 * u[x][y - 2] - 5 * u[x][y - 1] + 2 * u[x][y];
            else
                delta += u[x][y - 1] - 2 * u[x][y] + u[x][y + 1];

            return delta / dhh;
        }
    }
}



