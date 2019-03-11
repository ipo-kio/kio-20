export class Train {

    element;
    point_from;
    point_to;
    t;

    no_position = true;

    constructor(block, img) {
        this.block = block;
        this.img = img;
    }

    get_new_element() {
        let g = this.block.get_graph();
        let {vertices, colors} = g.kraskal();

        let n = vertices.length;
        let color_count = new Array(n);
        for (let i = 0; i < n; i++)
            color_count[i] = 0;

        for (let i = 0; i < n; i++)
            color_count[colors[i]]++;

        let max_color = -1;
        let max_color_value = 0;

        for (let i = 0; i < n; i++)
            if (color_count[i] > max_color_value) {
                max_color_value = color_count[i];
                max_color = i;
            }

        let j = Math.floor(max_color_value * Math.random());

        for (let i = 0; i < n; i++)
            if (colors[i] === max_color) {
                if (j === 0)
                    return vertices[i];
                j--;
            }

        return null;
    }

    reposition() {
        if (this.element && this.block.elements.indexOf(this.element) >= 0) {
            //test how many elements are there, jump if too small
            let {vertices, colors} = this.block.get_graph().kraskal();
            let indexOf = vertices.indexOf(this.element);
            if (indexOf < 0)
                return; //should not occur
            let c = colors[indexOf];
            let cnt = 0;
            for (let i = 0; i < colors.length; i++)
                if (colors[i] === c)
                    cnt++;
            if (cnt >= 4)
                return;
        }

        let e = this.get_new_element();

        if (e === null) {
            this.no_position = true;
            return;
        }

        this.no_position = false;

        let n = e.points.length;
        let j = Math.floor(n * Math.random());
        let point1 = e.points[j];

        this.element = e;
        this.point_from = point1;

        this.create_point_to();

        this.t = 0;
    }

    create_point_to() {
        let t = this.point_from.is_input();
        while (true) {
            let n = this.element.points.length;
            let j = Math.floor(n * Math.random());
            let point2 = this.element.points[j];
            if (point2.is_input() !== t) {
                this.point_to = point2;
                return;
            }
        }
    }

    forward() {
        if (this.no_position)
            return;

        this.t += 0.003;
        if (this.t < 1)
            return;

        let c = this.point_to.connection;
        if (c) { //go next
            let next_point = c.endpoint1 === this.point_to ? c.endpoint2 : c.endpoint1;
            let next_element = next_point.element;

            this.point_from = next_point;
            this.element = next_element;
        } else { //go back
            this.point_from = this.point_to;
        }

        this.create_point_to();
        this.t = 0;
    }

    draw(ctx) {
        if (this.no_position)
            return;

        let {x, y, vx, vy} = this.element.locate_train(this.point_from, this.point_to, this.t);
        ctx.save();

        ctx.translate(x, y);
        ctx.rotate(Math.atan2(vy, vx) + Math.PI / 2);
        ctx.translate(-this.img.width / 2, -this.img.height / 2);
        ctx.drawImage(this.img, 0, -10);

        ctx.restore();
    }

}