import {ind2color} from "./Palette";

export default class Legend extends createjs.Container {
    constructor() {
        super();

        let temperature_map_canvas = document.createElement('canvas');
        let temperature_map_ctx = temperature_map_canvas.getContext('2d');
        temperature_map_canvas.width = ind2color.length;
        temperature_map_canvas.height = 50;

        for (let x = 0; x < ind2color.length; x++) {
            temperature_map_ctx.fillStyle = ind2color[x];
            for (let y = 0; y < temperature_map_canvas.height; y++)
                temperature_map_ctx.fillRect(x, 0, 1, temperature_map_canvas.height);
        }

        let temperature_map = new createjs.Bitmap(temperature_map_canvas);

        this.addChild(temperature_map);
    }

}