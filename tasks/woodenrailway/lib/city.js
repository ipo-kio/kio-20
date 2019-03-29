import {intersect_polys} from "./intersection";

export class City {

    pos; //Vec2
    r;
    allowed_element_types;
    highlighted = false;

    city_yes;
    city_no;

    constructor(pos, r, city_yes, city_no) {
        this.pos = pos;
        this.r = r;

        this.city_yes = city_yes;
        this.city_no = city_no;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);

        let img = this.highlighted ? this.city_yes : this.city_no;
        ctx.drawImage(img, -img.width / 2, -img.height / 2);

        ctx.strokeStyle = this.highlighted ? '#9A9A9A' : '#BC2D2F';
        ctx.setLineDash([5, 3]);
        ctx.lineWidth = 2;
        ctx.strokeRect(-this.r, -this.r, 2 * this.r, 2 * this.r);
        ctx.restore();
    }

    intersection_outline() {
        let pos = this.pos;
        let r = this.r;
        return [
            pos.x - r, pos.y - r,
            pos.x - r, pos.y + r,
            pos.x + r, pos.y + r,
            pos.x + r, pos.y - r
        ];
    }

    count_elements_nearby(block) {
        let {vertices, colors} = block.get_graph().kraskal();

        let n = vertices.length;
        let colors_count = new Array(n);
        for (let i = 0; i < n; i++) //Arrays.fill()
            colors_count[i] = 0;

        let outline = this.intersection_outline();

        let total_colors = 0;

        for (let i = 0; i < n; i++) {
            let element = vertices[i];
            let c = colors[i];

            if (intersect_polys(element.intersection_outline(), outline))
                if (colors_count[c] === 0) {
                    colors_count[c] = 1;
                    total_colors++;
                }
        }

        return {colors_count, total_colors};
    }

}