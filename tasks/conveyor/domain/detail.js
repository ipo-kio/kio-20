const SLICE_PERCENTS = 20;
const R_INNER = 10;
export const R0 = 30;
export const DR = 10;
const SLICE_DR = 4;

export class Detail {

    rays;
    n;
    t;

    x = 0;
    y = 0;
    rotation = 0;

    highlighted_ray = -1;

    constructor(rays) {
        this.rays = rays;
        this.n = rays.length;
        this.t = Math.max(...this.rays);
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // draw detail
        this.draw_as_segments(ctx);

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.fillStyle = '#ff9e3f';
        ctx.fill();

        //draw circles
        ctx.strokeStyle = "green";
        ctx.lineWidth = 0.5;
        ctx.setLineDash([2, 3]);
        for (let i = 1; i <= 3; i++) {
            ctx.beginPath();
            ctx.arc(0, 0, R0 + (i - 1) * DR, 0, 2 * Math.PI);
            ctx.stroke();
        }

        let a = Math.PI * 2 / this.n; //TODO duplication
        let a0 = -a / 2 - Math.PI / 2; //TODO duplication

        //draw radiuses
        for (let i = 0; i < this.n; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            let r = R0 + (this.rays[i] - 1) * DR;
            ctx.lineTo(r * Math.cos(a0 + a * i), r * Math.sin(a0 + a * i));
            ctx.stroke();
        }

        //highlight a ray
        let hr = this.highlighted_ray;
        if (hr >= 0) {
            ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
            let r = R0 + (this.rays[hr] - 1) * DR;
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, r, a0 + a * hr, a0 + a * (hr + 1));
            ctx.fill();
        }

        ctx.restore();
    }

    draw_as_segments(ctx) {
        let a = Math.PI * 2 / this.n;
        let a0 = -a / 2 - Math.PI / 2;

        let slice_a = a * SLICE_PERCENTS / 100;

        let to_r = k => R0 + (k - 1) * DR;

        ctx.beginPath();
        let phi = a0;

        for (let i = 0; i < this.n; i++) {
            let r0 = to_r(this.rays[i]);
            if (i === 0)
                ctx.moveTo((r0 - SLICE_DR) * Math.cos(phi), (r0 - SLICE_DR) * Math.sin(phi));
            else
                ctx.lineTo((r0 - SLICE_DR) * Math.cos(phi), (r0 - SLICE_DR) * Math.sin(phi));

            phi += slice_a;
            ctx.lineTo(r0 * Math.cos(phi), r0 * Math.sin(phi));

            ctx.arc(0, 0, r0, phi, phi + a - 2 * slice_a);
            phi += a - slice_a;
            ctx.lineTo((r0 - SLICE_DR) * Math.cos(phi), (r0 - SLICE_DR) * Math.sin(phi));
        }
        ctx.closePath();
    }

    draw_as_rays(ctx) {
        let a = Math.PI * 2 / this.n;
        let a1 = 4 * a / 5; //ray
        let a2 = a / 5; //skip
        let a0 = -a1 / 2 + Math.PI / 2;

        ctx.beginPath();
        let phi = a0;
        ctx.moveTo(R_INNER * Math.cos(phi), R_INNER * Math.sin(phi));
        for (let i = 0; i < this.n; i++) {
            let dir_phi = phi + a1 / 2;
            let dir_x = DR * Math.cos(dir_phi);
            let dir_y = DR * Math.sin(dir_phi);

            let r = this.rays[i];

            ctx.lineTo(R0 * Math.cos(phi) + (r - 1) * dir_x, R0 * Math.sin(phi) + (r - 1) * dir_y);
            phi += a1;
            ctx.lineTo(R0 * Math.cos(phi) + (r - 1) * dir_x, R0 * Math.sin(phi) + (r - 1) * dir_y);
            ctx.lineTo(R_INNER * Math.cos(phi), R_INNER * Math.sin(phi));
            ctx.arc(0, 0, R_INNER, phi, phi + a2);
            phi += a2;
        }
    }

    highlight_ray(i) {
        this.highlighted_ray = i;
    }

    unhighlight_ray() {
        this.highlighted_ray = -1;
    }
}