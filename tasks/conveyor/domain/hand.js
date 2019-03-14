import {DR} from "./detail";

export const LEN0 = 20;

export class Hand {
    x;
    y;
    t = 3;
    length;

    dir = 1;
    extrusion = 1;

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        ctx.save();
        ctx.fillStyle = '#faf80a';
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x - 5, this.y - 20, 10, this.length + 20);
        ctx.strokeRect(this.x - 5, this.y - 20, 10, this.length + 20);
        ctx.restore();
    }

    //max extrusion in terms of a detail
    set_out(max_extrusion, percent) {
        // 3    2    1
        //          ext
        //   max_ext

        let full_len = (this.t - this.extrusion) * DR + LEN0;
        let max_len = (this.t - max_extrusion) * DR + LEN0;

        this.length = Math.min(full_len * percent, max_len);
        // if (isNaN(this.length))
        //     console.log('nan', max_extrusion, percent);
    }
}