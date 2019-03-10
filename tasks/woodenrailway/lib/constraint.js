/*
Copyright 2013 Sub Protocol and other contributors
http://subprotocol.com/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// DistanceConstraint -- constrains to initial distance
// PinConstraint -- constrains to static/fixed point
// AngleConstraint -- constrains 3 particles to an angle

import Vec2 from "./vec2";
import {ZERO} from "./railways";

let LEN_EPS = 1e-2;
let ANG_EPS = 1e-3;

export function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
    this.a = a;
    this.b = b;
    this.distance = typeof distance != "undefined" ? distance : a.pos.sub(b.pos).length();
    this.stiffness = stiffness;
    this.is_satisfied = false;
}

DistanceConstraint.prototype.relax = function (stepCoef) {
    var normal = this.a.pos.sub(this.b.pos);
    var m = normal.length2();
    normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);

    this.is_satisfied = Math.abs(Math.sqrt(m) - this.distance) < LEN_EPS;
    if (this.is_satisfied)
        return;

    //2 * normal -> a.relax_weight / b.relax_weight
    // let aw = 1; //this.a.relax_weight();
    // let bw = 1; //this.b.relax_weight();
    // let n1 = normal.scale(2 * bw / (aw + bw));
    // let n2 = normal.scale(2 * aw / (aw + bw));

    this.a.pos.mutableAdd(normal);
    this.b.pos.mutableSub(normal);
};

DistanceConstraint.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.strokeStyle = "#d8dde2";
    ctx.stroke();
};

export function PinConstraint(a, pos) {
    this.a = a;
    this.pos = (new Vec2()).mutableSet(pos);
}

PinConstraint.prototype.relax = function (stepCoef) {
    this.a.pos.mutableSet(this.pos);
};

PinConstraint.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 6, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0,153,255,0.1)";
    ctx.fill();
};


export function AngleConstraint(a, b, c, stiffness) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    this.stiffness = stiffness;
    this.is_satisfied = false;
}

AngleConstraint.prototype.relax = function (stepCoef) {
    var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    var diff = angle - this.angle;

    if (diff <= -Math.PI)
        diff += 2 * Math.PI;
    else if (diff >= Math.PI)
        diff -= 2 * Math.PI;

    this.is_satisfied = Math.abs(diff) < ANG_EPS;
    if (this.is_satisfied)
        return;

    diff *= stepCoef * this.stiffness;

    this.a.pos = this.a.pos.rotate(this.b.pos, diff);
    this.c.pos = this.c.pos.rotate(this.b.pos, -diff);
    this.b.pos = this.b.pos.rotate(this.a.pos, diff);
    this.b.pos = this.b.pos.rotate(this.c.pos, -diff);
};

AngleConstraint.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.moveTo(this.a.pos.x, this.a.pos.y);
    ctx.lineTo(this.b.pos.x, this.b.pos.y);
    ctx.lineTo(this.c.pos.x, this.c.pos.y);
    var tmp = ctx.lineWidth;
    ctx.lineWidth = 5;
    ctx.strokeStyle = "rgba(255,255,0,0.2)";
    ctx.stroke();
    ctx.lineWidth = tmp;
};

export function AngleRangeConstraint(a, b, c, minAngle, maxAngle, stiffness) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.minAngle = minAngle;
    this.maxAngle = maxAngle;
    this.stiffness = stiffness;
}

AngleRangeConstraint.prototype.relax = function (stepCoef) {
    let angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    let diff = this.minAngle - angle;

    //now, which is closer, min or max.
    let angleMid = (this.minAngle + this.maxAngle) / 2;
    let angleVar = Math.abs(this.minAngle - this.maxAngle) / 2;
    let diffMid = AngleRangeConstraint.normalize(angle - angleMid);

    this.is_satisfied = Math.abs(diffMid) <= angleVar;

    if (this.is_satisfied)
        return;

    if (diffMid < 0) {
        diff = angle - this.minAngle;
    } else {
        diff = angle - this.maxAngle;
    }
    diff = AngleRangeConstraint.normalize(diff);

    //TODO experimental
    if (Math.abs(diff) < 0.005)
        diff = 0.005 * Math.sign(diff);
        // diff *= 2;

    diff *= stepCoef * this.stiffness;

    let cos_diff = Math.cos(diff);
    let sin_diff = Math.sin(diff);

    this.a.pos = this.a.pos.rotate_cos_sin(this.b.pos, cos_diff, sin_diff);
    this.c.pos = this.c.pos.rotate_cos_sin(this.b.pos, cos_diff, -sin_diff);
    this.b.pos = this.b.pos.rotate_cos_sin(this.a.pos, cos_diff, sin_diff);
    this.b.pos = this.b.pos.rotate_cos_sin(this.c.pos, cos_diff, -sin_diff);
};

AngleRangeConstraint.prototype.draw = AngleConstraint.prototype.draw;

AngleRangeConstraint.normalize = function (a) {
    while (a < -Math.PI)
        a += 2 * Math.PI;
    while (a > Math.PI)
        a -= 2 * Math.PI;
    return a;
};

export function DistanceRangeConstraint(a, b, stiffness, minDistance, maxDistance) {
    this.a = a;
    this.b = b;
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
    this.stiffness = stiffness;
}

DistanceRangeConstraint.prototype.relax = function (stepCoef) {
    let normal = this.a.pos.sub(this.b.pos);
    let m2 = normal.length2();
    let m = Math.sqrt(m2);

    if (m < 1e-5) {
        normal = new Vec2(1, 0);
        m2 = 1;
        m = 1;
    }

    let dist;
    if (this.minDistance * this.minDistance > m2) {
        dist = this.minDistance;
        this.is_satisfied = false;
    } else if (this.maxDistance * this.maxDistance < m2) {
        dist = this.maxDistance;
        this.is_satisfied = false;
    } else {
        dist = m;
        this.is_satisfied = true;
    }

    let scale = (dist - m) / m;
    // TODO experimental
    if (Math.abs(scale) < 0.01)
        scale = 0.01 * Math.sign(scale);
        // scale *= 3;

    normal.mutableScale(scale * this.stiffness * stepCoef);
    this.a.pos.mutableAdd(normal);
    this.b.pos.mutableSub(normal);
};

DistanceRangeConstraint.prototype.draw = DistanceConstraint.prototype.draw;

export class RailwayElementConstraint {

    railway_element;

    constructor(railway_element) {
        this.railway_element = railway_element;
    }

    relax(stepCoef) {
        let current_angle = this.railway_element.current_angle();
        let initial_angle = this.railway_element.initial_angle;
        let phi = current_angle - initial_angle;
        // console.log(current_angle, initial_angle, phi);

        let mass_shift = this.railway_element.mass_shift.rotate(phi);
        let current_center = this.railway_element.current_mass_center().sub(mass_shift);

        for (let endpoint of this.railway_element.points) {
            let new_pos = endpoint.initial_pos.rotate(ZERO, phi).add(current_center);
            let v = new_pos.sub(endpoint.pos);
            endpoint.pos.mutableSet(endpoint.pos.add(v.scale(stepCoef)))
        }

        let cp = this.railway_element.center_point;
        cp.pos.mutableSet(cp.pos.add(current_center.sub(cp.pos).scale(stepCoef)));
    }
}
/*
let log_cnt = 0;
export function lalalog(...a) {
    if (log_cnt > 1000)
        return;
    console.log(...a);
    log_cnt++;
}*/
