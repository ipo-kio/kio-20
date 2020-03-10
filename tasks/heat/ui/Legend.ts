import {ind2color} from "./Palette";
import Ticks from "./Ticks";
import {index2material, Material, material2name} from "../solver/Consts";
import Block from "./Block";
import {KioApi} from "../../KioApi";

let TEMPERATURE_H = 50;

export default class Legend extends createjs.Container {
    constructor(kioapi: KioApi) {
        super();

        let bg = new createjs.Shape();
        bg.graphics.beginFill('rgba(255, 255, 255, 0.5)').rect(0, 0, 840, 240).endFill();
        this.addChild(bg);

        let temperature_map = Legend.create_temperature_map();
        this.addChild(temperature_map);
        let temperature_tick = new Ticks(ind2color.length, 0, 100, 20, '°');
        this.addChild(temperature_tick);
        let main_text = Legend.create_text('Цвет температуры:');
        this.addChild(main_text);

        temperature_map.x = 20;
        temperature_map.y = main_text.getMeasuredHeight() + 16;

        temperature_tick.x = 20;
        temperature_tick.y = temperature_map.y + TEMPERATURE_H;

        main_text.x = 20;
        main_text.y = 10;

        // add materials
        let ind = 0;
        for (let m of index2material) {
            let x0 = 280 + ind * 120;
            let b = new Block(kioapi, m, x0, temperature_map.y, 0);
            b.mouseEnabled = false;
            ind++;
            this.addChild(b);

            let t = Legend.create_text(material2name[m]);
            t.textAlign = "center";
            t.x = x0 + Block.WIDTH / 2;
            t.y = 10;
            this.addChild(t);
        }
    }

    private static create_temperature_map(): createjs.Bitmap {
        let temperature_map_canvas = document.createElement('canvas');
        let temperature_map_ctx = temperature_map_canvas.getContext('2d');
        temperature_map_canvas.width = ind2color.length;
        temperature_map_canvas.height = TEMPERATURE_H;

        for (let x = 0; x < ind2color.length; x++) {
            temperature_map_ctx.fillStyle = ind2color[x];
            for (let y = 0; y < temperature_map_canvas.height; y++)
                temperature_map_ctx.fillRect(x, 0, 1, temperature_map_canvas.height);
        }

        return new createjs.Bitmap(temperature_map_canvas);
    }

    private static create_text(text: string): createjs.Text {
        return new createjs.Text(text, "14pt Arial");
    }
}