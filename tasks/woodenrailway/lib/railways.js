import {AngleRangeConstraint, Composite, DistanceRangeConstraint, Particle} from "./verlet";
import Vec2 from "./vec2";
import {RailwayElement} from "./elements";
import {PinConstraint} from "./constraint";

const MAX_CONNECTION_DISTANCE = 3;
const MAX_ANGLE = 3; // in degrees

export const ZERO = new Vec2(0, 0);
export const ONE = new Vec2(1, 0);

export class Endpoint extends Particle {
    initial_pos; /*Vec2D initial position*/
    dir; /*Vec2D*/
    element; /* the railway element it corresponds to */
    element_ind;
    is_center_point;

    connection = null;

    constructor(pos, dir, element, element_ind, is_center_point) {
        super(pos);

        this.initial_pos = new Vec2(pos.x, pos.y);
        this.dir = dir;
        this.element = element;
        this.angle = this.initial_pos.angle(this.dir);
        this.is_center_point = is_center_point;
        this.element_ind = element_ind;
    }

    current_dir() {
        let local_zero = this.element.center_point.pos;
        return this.pos.sub(local_zero).rotate(ZERO, this.angle).normal();
    }

    set_connection(connection) {
        this.connection = connection;
    }

    remove_connection() {
        this.connection = null;
    }
}

export class Connection {
    endpoint1;
    endpoint2;

    constraints;

    constructor(endpoint1, endpoint2) {
        this.endpoint1 = endpoint1;
        this.endpoint2 = endpoint2;

        let alpha1 = endpoint1.initial_pos.scale(-1).angle(endpoint1.dir);
        let alpha2 = endpoint2.initial_pos.scale(-1).angle(endpoint2.dir.scale(-1));
        let alpha = alpha1 - alpha2;
        let epsilon = Math.PI / 180 * MAX_ANGLE;

        this.constraints = [
            new DistanceRangeConstraint(endpoint1, endpoint2, 1, 0, MAX_CONNECTION_DISTANCE),
            new AngleRangeConstraint(endpoint1.element.center_point, endpoint1, endpoint2.element.center_point, alpha - epsilon, alpha + epsilon, 1),
            new AngleRangeConstraint(endpoint1.element.center_point, endpoint2, endpoint2.element.center_point, alpha - epsilon, alpha + epsilon, 1)
        ];
    }

    fill_block() {
        add_to_array(this.endpoint1.element.block.constraints, this.constraints);
    }

    empty_block() {
        remove_array_from_array(this.endpoint1.element.block.constraints, this.constraints);
    }

    is_satisfied() {
        for (let c of this.constraints)
            if (!c.is_satisfied())
                return false;
        return true;
    }

    draw(ctx) {
        /*if (this.is_satisfied())
            return;

        ctx.save();
        let c = this.endpoint1.pos; //.add(this.endpoint2.pos).scale(0.5);
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'red';
        let n = 3;
        ctx.beginPath();
        ctx.moveTo(c.x + n, c.y + n);
        ctx.lineTo(c.x - n, c.y - n);
        ctx.moveTo(c.x + n, c.y - n);
        ctx.lineTo(c.x - n, c.y + n);
        ctx.stroke();

        ctx.restore();*/
    }

    serialize() {
        let e1 = this.endpoint1.element;
        let e2 = this.endpoint2.element;
        let block = e1.block;
        return {
            e1: block.elements.indexOf(e1),
            e2: block.elements.indexOf(e2),
            i1: this.endpoint1.element_ind,
            i2: this.endpoint2.element_ind
        };
    }

    static static_deserialize(s, block) {
        let e1 = block.elements[s.e1];
        let e2 = block.elements[s.e2];
        return new Connection(e1.points[s.i1], e2.points[s.i2]);
    }
}

export class RailwayBlock extends Composite {
    elements = [];
    connections = [];

    constructor(kioapi) {
        super();
        this.kioapi = kioapi;
    }

    add_element(element) {
        this.elements.push(element);

        element.fill_block();
    }

    remove_element(element) {
        remove_element_from_array(this.elements, element);
        element.empty_block();

        //remove also all corresponding constraints
        for (const c of this.connections.slice())
            if (element.contains_endpoint(c.endpoint1) || element.contains_endpoint(c.endpoint2))
                this.remove_connection(c);
    }

    add_connecton(connection) {
        this.connections.push(connection);
        connection.fill_block();

        connection.endpoint1.set_connection(connection);
        connection.endpoint2.set_connection(connection);
    }

    remove_connection(connection) {
        remove_element_from_array(this.connections, connection);
        connection.empty_block();

        connection.endpoint1.remove_connection();
        connection.endpoint2.remove_connection();
    }

    drawConstraints(ctx) {
        for (let c of this.connections)
            c.draw(ctx);

        //draw nails
        let nail = this.kioapi.getResource('nail');
        for (let c of this.constraints)
            if (c instanceof PinConstraint)
                ctx.drawImage(nail, c.pos.x - nail.width / 2, c.pos.y - nail.height / 2);

        //draw unsatisfied connections
        ctx.save();
        for (let con of this.connections)
            if (!con.is_satisfied()) {
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'red';
                let {x, y} = con.endpoint1.pos;
                ctx.beginPath();
                ctx.moveTo(x - 5, y - 5);
                ctx.lineTo(x + 5, y + 5);
                ctx.moveTo(x - 5, y + 5);
                ctx.lineTo(x + 5, y - 5);
                ctx.stroke();
            }
        ctx.restore();
    }

    drawParticles(ctx) {
        for (let e of this.elements)
            e.draw(ctx);
    }

    serialize() {
        let elements = [];
        let connections = [];
        for (let e of this.elements)
            elements.push(e.serialize());
        for (let c of this.connections)
            connections.push(c.serialize());
        return {e: elements, c: connections};
    }

    deserialize(s) {
        let old_elements = this.elements;
        let old_connections = this.connections;
        let old_particles = this.particles;
        let old_constraints = this.constraints;

        this.elements = [];
        this.connections = [];
        this.particles = [];
        this.constraints = [];

        try {
            for (let e of s.e)
                this.add_element(RailwayElement.static_deserialize(e, this));

            for (let c of s.c)
                this.add_connecton(Connection.static_deserialize(c, this));
        } catch (e) {
            console.debug('error while deserializing', e, s);

            this.elements = old_elements;
            this.connections = old_connections;
            this.particles = old_particles;
            this.constraints = old_constraints;
        }
    }
}

export function remove_element_from_array(a, e) {
    let i = a.indexOf(e);
    if (i >= 0)
        a.splice(i, 1);
}

export function add_to_array(a, b) {
    a.push(...b);
}

export function remove_array_from_array(a, b) { //a \ b
    let i = 0;
    while (i < a.length) {
        let e = a[i];
        if (b.indexOf(e) >= 0) {
            a.splice(i, 1);
        } else
            i++;
    }
}
