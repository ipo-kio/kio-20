import Body, {Material} from "../Body";
import Block from "./Block";

export class BodyUI extends createjs.Container {

    blocks: Block[][];
    private _selected_cell: {i: number, j: number} | null;
    private highlight: createjs.Shape;

    constructor() {
        super();
        this.blocks = new Array<Block[]>(M);
        for (let i = 0; i < M; i++) {
            this.blocks[i] = new Array<Block>(N);
            for (let j = 0; j < N; j++)
                this.blocks[i][j] = null; //new Block(null, DEFAULT_MATERIAL);
        }
    }

    get body(): Body {
        let b = new Array<Material[]>(M);
        for (let i = 0; i < M; i++) {
            b[i] = new Array<Material>(N);
            for (let j = 0; j < N; j++) {
                let block = this.blocks[i][j];
                b[i][j] = block ? block.material : DEFAULT_MATERIAL;
            }
        }

        return new Body(b);
    }

    find_cell_for_position(x: number, y: number) {
        let i1 = Math.floor(x / Block.WIDTH);
        let j1 = Math.floor(y / Block.HEIGHT);

        let max_area = 0;
        let max_area_i = 0;
        let max_area_j = 0;
        for (let ci = 0; ci <= 1; ci++)
            for (let cj = 0; cj <= 1; cj++) {
                let j = j1 + cj;
                let i = i1 + ci;
                let area = intersection_by_index(i, j, x, y, Block.WIDTH, Block.HEIGHT);
                if (area > max_area) {
                    max_area = area;
                    max_area_i = i;
                    max_area_j = j;
                }
            }

        if (max_area === 0)
            return null;
        else
            return {i: max_area_i, j: max_area_j};

        function intersection_by_index(i1: number, j1: number, x: number, y: number, w: number, h: number) {
            if (i1 < 0 || j1 < 0 || i1 >= M || j1 >= N)
                return 0;
            return intersection(j1 * Block.WIDTH, i1 * Block.HEIGHT, x, y, w, h);
        }

        function intersection(x1: number, y1: number, x2: number, y2: number, w: number, h: number): number {
            //not intersected
            //x1      x1 + w        x2       x2 + w
            //x2      x2 + w        x1       x1 + w
            if (x1 + w <= x2 || x2 + w <= x1 || y1 + h <= y2 || y2 + h <= y1)
                return 0;
            let dx = Math.min(x1 + w - x2, x2 + w - x1);
            let dy = Math.min(y1 + h - y2, y2 + h - y1);

            return dx * dy;
        }
    }

    get selected_cell(): { i: number; j: number } | null {
        return this._selected_cell;
    }

    set selected_cell(cell: { i: number; j: number } | null) {
        if (this._selected_cell === null && cell == null)
            return;

        if (cell !== null) {
            let {i, j} = cell;
            if (this._selected_cell !== null && this._selected_cell.i === i && this._selected_cell.j === j)
                return;
            this._selected_cell = cell;
            this.highlight.visible = true;
            this.highlight.x = j * Block.WIDTH;
            this.highlight.y = i * Block.HEIGHT;
        } else {
            this._selected_cell = null;
            this.highlight.visible = false;
        }
    }
}

const M = 6;
const N = 6;
const DEFAULT_MATERIAL: Material = "tree";