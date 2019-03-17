import {DR} from "./detail";
export const LEN0 = 10;

const HAND_WIDTH = 14;

const HIT_NOWHERE = 0;
const HIT_INSIDE = 1;
const HIT_CLOSE = 2;

export class Hand {
    x;
    y;
    t = 3;
    length;

    dir = 1;
    extrusion = 1;

    mouse;

    constructor(x, y, mouse, click_handle, close_handle) {
        this.x = x;
        this.y = y;
        this.mouse = mouse;
        this.click_handle = click_handle;
        this.close_handle = close_handle;
    }

    full_length() {
        return LEN0 + DR * (this.t - this.extrusion);
    }

    draw(ctx) {
        let full_length = this.full_length();

        ctx.save();
        ctx.fillStyle = '#faf80a';
        ctx.strokeStyle = 'black';
        ctx.fillRect(this.x - HAND_WIDTH / 2, this.y - (full_length - this.length), HAND_WIDTH, full_length);
        ctx.strokeRect(this.x - HAND_WIDTH / 2, this.y - (full_length - this.length), HAND_WIDTH, full_length);

        let ht = this.hit_test();
        if (ht !== HIT_NOWHERE) {
            // full_length = LEN0 + DR * (this.t - 1);

            ctx.strokeStyle = 'green';
            ctx.lineWidth = 2;
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.fillRect(this.x - HAND_WIDTH / 2, this.y - (full_length - this.length), HAND_WIDTH, full_length);
            ctx.fillStyle = '#00FF00';
            ctx.fillRect(this.x - HAND_WIDTH / 2, this.y - (- this.length), HAND_WIDTH, DR + LEN0);
            ctx.strokeRect(this.x - HAND_WIDTH / 2, this.y - (full_length - this.length), HAND_WIDTH, full_length + DR + LEN0);

            ctx.strokeStyle = 'red';
            ctx.beginPath();
            let cx = this.x;
            let cy = this.y + this.length + DR;
            ctx.moveTo(cx - 4, cy - 4);
            ctx.lineTo(cx + 4, cy + 4);
            ctx.moveTo(cx - 4, cy + 4);
            ctx.lineTo(cx + 4, cy - 4);
            ctx.stroke();
        }

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

        if (detail) {
            if (Math.abs(percent - time_to_real_length) < 0.1 && this.extrusion <= max_extrusion)
                detail.highlight_ray(r0);
            else
                detail.unhighlight_ray(r0);
        }

        if (detail && r0 !== r1) {
            let time_rotation = max_length / (2 * total_length);
            if (time_to_real_length <= percent && percent <= time_to_real_length + time_rotation) {
                let phi0 = -2 * Math.PI / detail.n * r0;
                let phi1 = -2 * Math.PI / detail.n * r1;
                detail.rotation = phi0 + (phi1 - phi0) * (percent - time_to_real_length) / time_rotation;
            }
        }
    }

    hit_test() {
        //this.x - HAND_WIDTH / 2, this.y - (full_length - this.length), HAND_WIDTH, full_length
        let x = this.mouse.x;
        let y = this.mouse.y;
        let full_length = LEN0 + DR * (this.t - 1);

        x -= this.x - HAND_WIDTH / 2;
        y -= this.y - full_length - this.length;
        let hit_inside = 0 <= x && x <= HAND_WIDTH && 0 <= y && y <= full_length;
        let hit_vertically = 0 <= x && x <= HAND_WIDTH && full_length <= y && y <= full_length + DR + LEN0;
        if (hit_vertically)
            return HIT_CLOSE;
        if (hit_inside)
            return HIT_INSIDE;
        return HIT_NOWHERE;
    }

    mouse_click() {
        let ht = this.hit_test();

        if (ht === HIT_CLOSE)
            this.close_handle();
        else if (ht === HIT_INSIDE)
            this.click_handle();
    }
}