import {Material} from "../Body";
import {KioApi} from "../../KioApi";

export default class Block extends createjs.Container {
    public static readonly WIDTH = 64;
    private kioapi: KioApi;
    public static readonly HEIGHT = 64;

    private readonly _material: Material;
    private _mouseover: boolean;
    private readonly border: createjs.Shape;

    private readonly x0: number;
    private readonly y0: number;

    constructor(kioapi: KioApi, material: Material, x0: number, y0: number) {
        super();
        this.kioapi = kioapi;

        this._material = material;
        this.x0 = x0;
        this.y0 = y0;

        this.x = x0;
        this.y = y0;

        let image = new createjs.Bitmap(kioapi.getResource(material));
        image.setBounds(0, 0, Block.WIDTH, Block.HEIGHT);
        this.border = new createjs.Shape();
        this.border.graphics
            .beginStroke('red')
            .setStrokeStyle(3)
            .rect(0, 0, Block.WIDTH, Block.HEIGHT)
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

        this.addEventListener("pressmove", () => {

        });
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
}