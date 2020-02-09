import Grid from "./Grid";

export default class HeatingProcess {
    private readonly g: Grid;
    private readonly values: number[][][];
    private readonly left_edge_initial: (x: number) => number;
    private readonly right_edge_heat: (x: number) => number;

    constructor(g: Grid, left_edge_initial: (y: number) => number, right_edge_heat: (y: number) => number) {
        this.g = g;
        this.left_edge_initial = left_edge_initial;
        this.right_edge_heat = right_edge_heat;

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
        let w = this.g.N_width;
        let h = this.g.N_height;

        function delta_u(u: number[][], x: number, y: number, dh: number) {
            let delta: number = 0;

            // by x
            if (x === 0)
                delta += (2 * u[x][y] - 5 * u[x + 1][y] + 4 * u[x + 2][y] - u[x + 3][y]) / dh;
            else (x === this.g.N_width)

        }
    }

}



