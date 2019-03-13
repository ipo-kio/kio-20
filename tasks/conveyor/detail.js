const R_INNER = 10;
const UNIT_LENGTH = 20;

export class Detail {

    rays;
    n;
    t;

    x = 0;
    y = 0;
    rotation = 0;

    constructor(rays) {
        this.rays = rays;
        this.n = rays.length;
        this.t = Math.max(...this.rays);
    }

    draw(ctx) {
        let a = Math.PI * 2 / this.n;
        let a1 = 4 * a / 5; //ray
        let a2 = a / 5; //skip
        let a0 = -a1 / 2 - Math.PI / 2;

        ctx.save();

        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        ctx.beginPath();
        let phi = a0;
        ctx.moveTo(R_INNER * Math.cos(phi), R_INNER * Math.sin(phi));
        for (let i = 0; i < this.n; i++) {
            let dir_phi = phi + a1 / 2;
            let dir_x = UNIT_LENGTH * Math.cos(dir_phi);
            let dir_y = UNIT_LENGTH * Math.sin(dir_phi);

            let r = this.rays[i];

            ctx.lineTo(R_INNER * Math.cos(phi) + r * dir_x, R_INNER * Math.sin(phi) + r * dir_y);
            phi += a1;
            ctx.lineTo(R_INNER * Math.cos(phi) + r * dir_x, R_INNER * Math.sin(phi) + r * dir_y);
            ctx.lineTo(R_INNER * Math.cos(phi), R_INNER * Math.sin(phi));
            ctx.arc(0, 0, R_INNER, phi, phi + a2);
            phi += a2;
        }

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

}