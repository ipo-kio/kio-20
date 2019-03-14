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
    set_out(max_extrusion, percent, detail, r0, r1) {
        let total_length = LEN0 + DR * (this.t - 1); // 0.5
        let max_length = LEN0 + DR * (this.t - max_extrusion);
        let need_length = LEN0 + DR * (this.t - this.extrusion);

        let real_length = Math.min(need_length, max_length);

        let time_to_real_length = real_length / (2 * total_length); // 0.5 -> real_length

        if (percent < time_to_real_length)
            this.length = percent * 2 * total_length;
        else if (percent < 2 * time_to_real_length)
            this.length = (2 * time_to_real_length - percent) * 2 * total_length;
        else
            this.length = 0;

        let time_rotation = max_length/ (2 * total_length);
        if (time_to_real_length <= percent && percent <= time_to_real_length + time_rotation) {
            let phi0 = 2 * Math.PI / detail.n * r0;
            let phi1 = 2 * Math.PI / detail.n * r1;
            detail.rotation = phi0 + (phi1 - phi0) * (percent - time_to_real_length) / time_rotation;
        }
    }
}