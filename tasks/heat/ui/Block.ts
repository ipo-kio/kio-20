import {Material} from "../solver/Consts";
import {KioApi} from "../../KioApi";

export default class Block extends createjs.Container {
    public static readonly WIDTH = 48;
    private kioapi: KioApi;
    public static readonly HEIGHT = 48;

    private readonly _material: Material;
    private _mouseover: boolean;
    private readonly border: createjs.Shape;

    private readonly x0: number;
    private readonly y0: number;
    private press_x: number;
    private press_y: number;
    private readonly _index: number;

    constructor(kioapi: KioApi, material: Material, x0: number, y0: number, index: number) {
        super();
        this.kioapi = kioapi;

        this._material = material;
        this.x0 = x0;
        this.y0 = y0;
        this._index = index;

        this.x = x0;
        this.y = y0;

        let image = new createjs.Bitmap(kioapi.getResource(material));
        image.sourceRect = new createjs.Rectangle(0, 0, Block.WIDTH, Block.HEIGHT);
        this.border = new createjs.Shape();
        this.border.graphics
            .beginStroke('red')
            .setStrokeStyle(3)
            .rect(1, 1, Block.WIDTH - 1, Block.HEIGHT - 1)
            .endStroke();
        this.addChild(image);
        this.addChild(this.border);
        this.mouseover = false;

        this.mouseEnabled = true;

        this.addEventListener("rollover", () => {
            this.mouseover = true;
        });

        this.addEventListener("rollout", () => {
            this.mouseover = false;
        });

        this.addEventListener("mousedown", e => {
            let ev = e as createjs.MouseEvent;
            this.press_x = ev.localX;
            this.press_y = ev.localY;
        });

        this.addEventListener("pressmove", e => {
            let ev = e as createjs.MouseEvent;
            this.x = ev.stageX - this.parent.x - this.press_x;
            this.y = ev.stageY - this.parent.y - this.press_y;
            this.dispatchEvent(new Event("block move"), this);
        });

        this.addEventListener("pressup", e => {
            let ev = e as createjs.MouseEvent;
            this.dispatchEvent(new Event("block stop move"), this);
        })
    }

    get material(): Material {
        return this._material;
    }

    get mouseover(): boolean {
        return this._mouseover;
    }

    set mouseover(value: boolean) {
        if (value == this._mouseover)
            return;
        this._mouseover = value;
        this.border.visible = this._mouseover;
    }

    get index(): number {
        return this._index;
    }

    move_home() {
        this.x = this.x0;
        this.y = this.y0;
    }
}