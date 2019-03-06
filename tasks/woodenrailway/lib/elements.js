import Vec2 from "./vec2";
import {
    DRAW_ELEMENT_WIDTH,
    DRAW_INNER_RAILS_WIDTH,
    DRAW_RAILS_WIDTH,
    ROUND_ELEMENT_RADIUS,
    STRAIGHT_ELEMENT_LENGTH
} from "./draw_consts";
import {AngleConstraint, DistanceConstraint} from "./constraint";
import {ONE, ZERO, Endpoint, add_to_array, remove_array_from_array, remove_element_from_array} from "./railways";

export class RailwayElement {
    block; /*railway block*/
    center_point; /* Endpoint */
    points; /*array of Endpoint*/
    constraints;
    is_pinned = false;

    initial_angle;

    constructor(block, positions, directions) {
        this.block = block;
        this.points = [];
        for (let i = 0; i < positions.length; i++)
            this.points.push(new Endpoint(positions[i], directions[i], this, i, false));
        this.center_point = new Endpoint(new Vec2(0, 0), new Vec2(0, 0), this, 0, true);

        //constraints for points to keep them with each other
        this.constraints = [];
        for (let i = 0; i < this.points.length; i++) {
            for (let j = i + 1; j < this.points.length; j++)
                this.constraints.push(new DistanceConstraint(this.points[i], this.points[j], 1));
            this.constraints.push(new DistanceConstraint(this.points[i], this.center_point, 1));
        }

        //constraints for points to keep their angles
        for (let i = 0; i < this.points.length; i++) {
            let j = (i + 1) % this.points.length;
            this.constraints.push(new AngleConstraint(this.points[i], this.center_point, this.points[j], 1));
        }

        //initial angle
        this.initial_angle = 0;
        let last_angle = 0;
        for (let p of positions) {
            let a = p.angle(ONE);
            while (a < last_angle)
                a += 2 * Math.PI;
            last_angle = a;
            this.initial_angle += p.angle(ONE);
        }
        this.initial_angle /= positions.length;
    }

    transform_context(ctx) {
        let c = this.center_point.pos;
        ctx.translate(c.x, c.y);

        let a_total = 0;
        let last_angle = 0;
        for (let p of this.points) {
            let pp = p.pos;
            let a = pp.sub(c).angle(ONE);
            while (a < last_angle)
                a += 2 * Math.PI;
            last_angle = a;
            a_total += a;
        }

        a_total /= this.points.length;

        ctx.rotate(this.initial_angle - a_total);
    }

    contains_endpoint(p) {
        return this.points.indexOf(p) >= 0;
    }

    outline_path(ctx) {
        //to be overriden
    }

    draw_outline(ctx) {
        ctx.save();
        this.transform_context(ctx);
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(178, 178, 0, 0.7)';
        this.outline_path(ctx);
        ctx.stroke();
        ctx.restore();
    }

    fill_block() {
        this.block.particles.push(this.center_point);
        add_to_array(this.block.particles, this.points);

        add_to_array(this.block.constraints, this.constraints);
    }

    empty_block() {
        remove_element_from_array(this.block.particles, this.center_point);
        remove_array_from_array(this.block.particles, this.points);

        remove_array_from_array(this.block.constraints, this.constraints);
    }

    draw(ctx) {
        //draw only directions
        ctx.save();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 1;
        for (let ep of this.points) {
            let dir = ep.current_dir();
            ctx.beginPath();
            ctx.moveTo(ep.pos.x, ep.pos.y);
            ctx.lineTo(ep.pos.x + 20 * dir.x, ep.pos.y + 20 * dir.y);
            ctx.stroke();
        }

        //draw elements

        ctx.strokeStyle = "black";
        // ctx.fillStyle = "black";
        ctx.beginPath();
        // ctx.moveTo(this.points[0].pos.x, this.points[0].pos.y);
        // for (let i = 1; i < this.points.length; i++)
        //     ctx.lineTo(this.points[i].pos.x, this.points[i].pos.y);
        // ctx.closePath();
        for (let p of this.points) {
            ctx.moveTo(this.center_point.pos.x, this.center_point.pos.y);
            ctx.lineTo(p.pos.x, p.pos.y);
        }
        ctx.stroke();

        //draw center
        ctx.strokeStyle = '#ff7915';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.center_point.pos.x, this.center_point.pos.y, 4, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.restore();
    }

    move_to(pos) {
        let c = this.center_point.pos;
        let translate = pos.sub(c);

        for (let p of this.points)
            p.pos.mutableAdd(translate);

        this.center_point.pos.mutableSet(pos);
    }

    fill_rails(ctx) {
        // ctx.fillStyle = "#ffa43c";
        ctx.fillStyle = ctx.createPattern(this.block.kioapi.getResource('wood'), "repeat");
        ctx.fill();
    }

    stroke_rails(ctx) {
        ctx.strokeStyle = '#222';
        ctx.lineWidth = DRAW_RAILS_WIDTH;
        ctx.stroke();
    }

    serialize() {
        let all_points_serialized = [];
        for (let p of this.points)
            all_points_serialized.push(p.serialize());
        return {t: this.TYPE, cp: this.center_point.serialize(), ap: all_points_serialized};
    }

    static static_deserialize(s, block) {
        let element;
        switch (s.t) {
            case 's':
                element = new StraightElement(block);
                break;
            case 'r':
                element = new RoundElement(block);
                break;
            case 'v':
                element = new SplitElement(block);
                break;
            default:
                return null;
        }
        element.center_point.deserialize(s.cp);
        for (let i = 0; i < s.ap.length; i++)
            element.points[i].deserialize(s.ap[i]);

        return element;
    }
}

export class StraightElement extends RailwayElement {
    TYPE = 's';

    constructor(block) {
        super(block,
            [new Vec2(-STRAIGHT_ELEMENT_LENGTH / 2, 0), new Vec2(STRAIGHT_ELEMENT_LENGTH / 2, 0)],
            [new Vec2(-1, 0), new Vec2(1, 0)]
        );
    }

    draw(ctx) {
        ctx.save();
        this.transform_context(ctx);

        this.outline_path(ctx);
        this.fill_rails(ctx);

        ctx.beginPath();
        ctx.moveTo(-STRAIGHT_ELEMENT_LENGTH / 2, DRAW_INNER_RAILS_WIDTH / 2 + DRAW_RAILS_WIDTH / 2);
        ctx.lineTo(STRAIGHT_ELEMENT_LENGTH / 2, DRAW_INNER_RAILS_WIDTH / 2 + DRAW_RAILS_WIDTH / 2)
        this.stroke_rails(ctx);

        ctx.beginPath();
        ctx.moveTo(-STRAIGHT_ELEMENT_LENGTH / 2, -DRAW_INNER_RAILS_WIDTH / 2 - DRAW_RAILS_WIDTH / 2);
        ctx.lineTo(STRAIGHT_ELEMENT_LENGTH / 2, -DRAW_INNER_RAILS_WIDTH / 2 - DRAW_RAILS_WIDTH / 2)
        this.stroke_rails(ctx);

        ctx.restore();
    }

    outline_path(ctx) {
        ctx.beginPath();
        ctx.moveTo(-STRAIGHT_ELEMENT_LENGTH / 2, DRAW_ELEMENT_WIDTH / 2);
        ctx.lineTo(STRAIGHT_ELEMENT_LENGTH / 2, DRAW_ELEMENT_WIDTH / 2);
        ctx.lineTo(STRAIGHT_ELEMENT_LENGTH / 2, -DRAW_ELEMENT_WIDTH / 2);
        ctx.lineTo(-STRAIGHT_ELEMENT_LENGTH / 2, -DRAW_ELEMENT_WIDTH / 2);
        ctx.closePath();
    }
}

export class RoundElement extends RailwayElement {
    static polar2vec(r, a, is_convex) {
        let x_center = 0;
        let y_center = (is_convex ? -1 : 1) * ROUND_ELEMENT_RADIUS;
        if (!is_convex)
            a = -a;
        return new Vec2(x_center + r * Math.cos(a), y_center + r * Math.sin(a));
    }

    static N = 8;

    static two_points(is_convex) {
        let p1 = RoundElement.polar2vec(ROUND_ELEMENT_RADIUS, Math.PI * (1 / 2 + 2 / RoundElement.N / 2), is_convex);
        let p2 = RoundElement.polar2vec(ROUND_ELEMENT_RADIUS, Math.PI * (1 / 2 - 2 / RoundElement.N / 2), is_convex);
        return [p1, p2]
    }

    TYPE = 'r';

    constructor(block, is_convex = true) {
        let beta = 2 * Math.PI / RoundElement.N / 2;
        if (is_convex)
            beta = -beta;
        let nx = Math.cos(beta);
        let ny = Math.sin(beta);

        let p1p2 = RoundElement.two_points(is_convex);
        super(block, p1p2, [new Vec2(-nx, ny), new Vec2(nx, ny)]);

        this.is_convex = is_convex;
    }

    draw(ctx) {
        ctx.save();

        this.transform_context(ctx);

        let {angleRight, angleLeft, curve_center} = this.evaluate_size_constants();
        this.outline_path(ctx);
        this.fill_rails(ctx);

        //draw rails by themselves
        function draw_line(r) {
            ctx.beginPath();
            ctx.arc(
                curve_center.x, curve_center.y,
                r,
                -angleLeft, -angleRight,
                false
            );
        }

        draw_line(ROUND_ELEMENT_RADIUS - DRAW_INNER_RAILS_WIDTH / 2 - DRAW_RAILS_WIDTH / 2);
        this.stroke_rails(ctx);
        draw_line(ROUND_ELEMENT_RADIUS + DRAW_INNER_RAILS_WIDTH / 2 + DRAW_RAILS_WIDTH / 2);
        this.stroke_rails(ctx);

        // ctx.strokeStyle = '#rgba(255, 255, 255, 0.8)';
        // ctx.lineWidth = 1;
        // draw_line(ROUND_ELEMENT_RADIUS - DRAW_INNER_RAILS_WIDTH / 2 - DRAW_RAILS_WIDTH + 1);
        // draw_line(ROUND_ELEMENT_RADIUS + DRAW_INNER_RAILS_WIDTH / 2 + 1);

        ctx.restore();

        // super.draw(ctx);
    }

    outline_path(ctx) {
        let {angleRight, angleLeft, curve_center} = this.evaluate_size_constants();

        // let p_top_left = RoundElement.polar2vec(ROUND_ELEMENT_RADIUS + DRAW_ELEMENT_WIDTH / 2, angleLeft, this.is_convex);
        let p_top_right = RoundElement.polar2vec(ROUND_ELEMENT_RADIUS + DRAW_ELEMENT_WIDTH / 2, angleRight, false);
        let p_bottom_left = RoundElement.polar2vec(ROUND_ELEMENT_RADIUS - DRAW_ELEMENT_WIDTH / 2, angleLeft, false);
        // let p_bottom_right = RoundElement.polar2vec(ROUND_ELEMENT_RADIUS - DRAW_ELEMENT_WIDTH / 2, angleRight, this.is_convex);

        ctx.beginPath();
        ctx.moveTo(p_top_right.x, p_top_right.y);
        ctx.arc(
            curve_center.x, curve_center.y,
            ROUND_ELEMENT_RADIUS + DRAW_ELEMENT_WIDTH / 2,
            -angleRight, -angleLeft,
            true
        );
        ctx.lineTo(p_bottom_left.x, p_bottom_left.y);
        ctx.arc(
            curve_center.x, curve_center.y,
            ROUND_ELEMENT_RADIUS - DRAW_ELEMENT_WIDTH / 2,
            -angleLeft, -angleRight,
            false
        );
        ctx.closePath();
    }

    evaluate_size_constants() {
        let angleRight = Math.PI * (1 / 2 - 2 / RoundElement.N / 2);
        let angleLeft = Math.PI * (1 / 2 + 2 / RoundElement.N / 2);
        let curve_center = RoundElement.polar2vec(0, 0, false);
        return {angleRight, angleLeft, curve_center};
    }
}

const RAILWAY_ELEMENT_ANGLE = 2 * Math.PI / 12;

export class SplitElement extends RailwayElement {
    static evaluate_size_constants() {
        let l = STRAIGHT_ELEMENT_LENGTH / 2;
        let w = DRAW_ELEMENT_WIDTH / 2;

        //direction
        let xd = Math.cos(RAILWAY_ELEMENT_ANGLE / 2);
        let yd = Math.sin(RAILWAY_ELEMENT_ANGLE / 2);

        let wxd = -yd;
        let wyd = xd;
        return {l, w, xd, yd, wxd, wyd};
    }

    TYPE = 'v';

    constructor(block) {
        let xd = Math.cos(RAILWAY_ELEMENT_ANGLE / 2);
        let yd = Math.sin(RAILWAY_ELEMENT_ANGLE / 2);

        super(block,
            [
                new Vec2(-STRAIGHT_ELEMENT_LENGTH / 2, 0),
                new Vec2(STRAIGHT_ELEMENT_LENGTH / 2 * xd, STRAIGHT_ELEMENT_LENGTH / 2 * yd),
                new Vec2(STRAIGHT_ELEMENT_LENGTH / 2 * xd, - STRAIGHT_ELEMENT_LENGTH / 2 * yd)
            ],
            [new Vec2(-1, 0), new Vec2(xd, yd), new Vec2(xd, -yd)]
        );
    }

    draw(ctx) {
        ctx.save();
        this.transform_context(ctx);

        this.outline_path(ctx);
        this.fill_rails(ctx);

        let {l, xd, yd, wxd, wyd} = SplitElement.evaluate_size_constants();

        let r = DRAW_INNER_RAILS_WIDTH / 2 + DRAW_RAILS_WIDTH / 2;
        //draw lines
        ctx.beginPath();
        ctx.moveTo(-l, -r);
        ctx.bezierCurveTo(
            -l + 10, -r,
            l * xd + r * wxd - 10 * xd, -l * yd - r * wyd + 10 * yd,
            l * xd + r * wxd, -l * yd - r * wyd
        );
        this.stroke_rails(ctx);

        ctx.beginPath();
        ctx.moveTo(-l, r);
        ctx.bezierCurveTo(
            -l + 10, r,
            l * xd - r * wxd - 10 * xd, -l * yd + r * wyd + 10 * yd,
            l * xd - r * wxd, -l * yd + r * wyd
        );
        this.stroke_rails(ctx);

        ctx.beginPath();
        ctx.moveTo(-l, -r);
        ctx.bezierCurveTo(
            -l + 10, -r,
            l * xd - r * wxd - 10 * xd, l * yd - r * wyd - 10 * yd,
            l * xd - r * wxd, l * yd - r * wyd
        );
        this.stroke_rails(ctx);

        ctx.beginPath();
        ctx.moveTo(-l, r);
        ctx.bezierCurveTo(
            -l + 10, r,
            l * xd + r * wxd - 10 * xd, l * yd + r * wyd - 10 * yd,
            l * xd + r * wxd, l * yd + r * wyd
        );
        this.stroke_rails(ctx);

        ctx.restore();
    }

    outline_path(ctx) {
        let {l, w, xd, yd, wxd, wyd} = SplitElement.evaluate_size_constants();

        //draw outline
        ctx.beginPath();
        ctx.moveTo(-l, w);
        ctx.lineTo(-l, -w);
        ctx.lineTo(-l, -w);
        ctx.bezierCurveTo(
            -l + 10, -w,
            l * xd + w * wxd - 10 * xd, -l * yd - w * wyd + 10 * yd,
            l * xd + w * wxd, -l * yd - w * wyd
        );
        ctx.lineTo(l * xd - w * wxd, -l * yd + w * wyd);
        ctx.lineTo(l * xd - w * wxd, l * yd - w * wyd);
        ctx.lineTo(l * xd + w * wxd, l * yd + w * wyd);
        ctx.bezierCurveTo(
            l * xd + w * wxd - 10 * xd, l * yd + w * wyd - 10 * yd,
            -l + 10, w,
            -l, w
        );

        ctx.closePath();
    }

    seria
}