import Body, {Material} from "../Body";
import Block from "./Block";
import {KioApi} from "../../KioApi";
import HeatingProcess from "../solver/HeatingProcess";
import Grid from "../Grid";
import ProcessDrawer, {SliceType} from "./ProcessDrawer";
import Rectangle = createjs.Rectangle;
import TimeControl from "./TimeControl";

export class BodyUI extends createjs.Container {

    private blocks: Block[][];
    private _selected_cell: { i: number, j: number } | null;
    private highlight: createjs.Shape;
    private bg: createjs.Bitmap;
    private grid: createjs.Shape;
    private _process: HeatingProcess;
    private _processDrawer: ProcessDrawer;
    private _timeController: TimeControl;

    constructor(kioapi: KioApi) {
        super();
        this.blocks = new Array<Block[]>(M);
        for (let i = 0; i < M; i++) {
            this.blocks[i] = new Array<Block>(N);
            for (let j = 0; j < N; j++)
                this.blocks[i][j] = null; //new Block(null, DEFAULT_MATERIAL);
        }

        this.highlight = new createjs.Shape();
        this.highlight.graphics
            .beginFill('rgba(255,255,0,0.5)')
            .rect(0, 0, Block.WIDTH, Block.HEIGHT)
            .endFill();
        this.highlight.visible = false;

        this._selected_cell = null;

        this.grid = new createjs.Shape();
        this.grid.graphics.beginStroke("grey");
        for (let i = 0; i <= M; i++) {
            this.grid.graphics.moveTo(0, i * Block.HEIGHT);
            this.grid.graphics.lineTo(N * Block.WIDTH, i * Block.HEIGHT);
        }
        for (let j = 0; j <= N; j++) {
            this.grid.graphics.moveTo(j * Block.WIDTH, 0);
            this.grid.graphics.lineTo(j * Block.WIDTH, M * Block.HEIGHT);
        }
        this.grid.graphics.endStroke();

        this.bg = new createjs.Bitmap(kioapi.getResource(DEFAULT_MATERIAL));
        this.bg.sourceRect = new Rectangle(0, 0, this.width, this.height);

        this.addChild(this.bg);
        this.addChild(this.grid);
        this.addChild(this.highlight);

        this._processDrawer = new ProcessDrawer(
            SliceType.XY,
            VIEW_DIVISION,
            VIEW_DIVISION,
            this.width,
            this.height
        );

        this._timeController = new TimeControl();
        this.update_process();
        this._timeController.addEventListener("time changed", () => {
            this._processDrawer.v0 = this._timeController.time_normalized;
        });
    }

    get processDrawer(): ProcessDrawer {
        return this._processDrawer;
    }

    get timeController(): TimeControl {
        return this._timeController;
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
        let j1 = Math.floor(x / Block.WIDTH);
        let i1 = Math.floor(y / Block.HEIGHT);

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
        if (this._selected_cell?.i === cell?.i && this._selected_cell?.j === cell?.j)
            return;

        if (cell !== null) {
            let {i, j} = cell;

            if (this.blocks[i][j] !== null) {
                this._selected_cell = null;
                this.highlight.visible = false;
                return;
            }

            this._selected_cell = cell;
            this.highlight.visible = true;
            this.highlight.x = j * Block.WIDTH;
            this.highlight.y = i * Block.HEIGHT;
        } else {
            this._selected_cell = null;
            this.highlight.visible = false;
        }
    }

    set_block({i, j}: { i: number; j: number }, b: Block) {
        this.blocks[i][j] = b;
        b.x = this.x + j * Block.WIDTH;
        b.y = this.y + i * Block.HEIGHT;

        this.update_process();
    }

    remove_block(b: Block) {
        for (let i = 0; i < M; i++)
            for (let j = 0; j < N; j++)
                if (this.blocks[i][j] === b) {
                    this.blocks[i][j] = null;
                    this.update_process();
                    return;
                }
    }

    get width(): number {
        return N * Block.WIDTH;
    }

    get height(): number {
        return M * Block.HEIGHT;
    }

    get process(): HeatingProcess {
        return this._process;
    }

    private update_process() {
        this._process = new HeatingProcess(this.body);
        this._processDrawer.process = this._process;
        this._timeController.process = this._process;
        this.dispatchEvent("process changed");
    }
}

export const M = 6;
export const N = 6;
export const VIEW_DIVISION = 5;
export const N_element = VIEW_DIVISION * 5;
export const LENGTH = 1;
export const TIME = 60 * 60;
export const TIME_DIVISION = 1;
export const N_time = TIME_DIVISION * 1000;
export const DEFAULT_MATERIAL: Material = "tree";

export function download(data:BlobPart, filename:string, type:string) {
    let file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}