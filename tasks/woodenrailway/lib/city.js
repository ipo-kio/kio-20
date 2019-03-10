import {intersect_polys} from "./intersection";

export class City {

    pos; //Vec2
    r;
    allowed_element_types;

    constructor(pos, r, allowed_element_types /*array ['v', 'r', 's']*/) {
        this.pos = pos;
        this.r = r;

        this.allowed_element_types = {};
        for (let t of allowed_element_types)
            this.allowed_element_types[t] = true;
    }

    draw(ctx, highlighted) {
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.fillStyle = 'navy';
        ctx.fillRect(-4, -4, 8, 8);
        ctx.strokeStyle = highlighted ? 'blue' : 'black';
        ctx.setLineDash([2, 2]);
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
        let total_neighbours = 0;

        let outline = this.intersection_outline();

        for (let i = 0; i < n; i++) {
            let element = vertices[i];
            let c = colors[i];

            if (intersect_polys(element.intersection_outline(), outline)) {
                colors_count[c]++;
                total_neighbours++;
            }
        }

        return {colors_count, total_neighbours};
    }

}