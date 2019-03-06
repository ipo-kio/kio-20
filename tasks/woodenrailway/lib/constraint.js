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

export function DistanceConstraint(a, b, stiffness, distance /*optional*/) {
    this.a = a;
    this.b = b;
    this.distance = typeof distance != "undefined" ? distance : a.pos.sub(b.pos).length();
    this.stiffness = stiffness;
}

DistanceConstraint.prototype.relax = function (stepCoef) {
    var normal = this.a.pos.sub(this.b.pos);
    var m = normal.length2();
    normal.mutableScale(((this.distance * this.distance - m) / m) * this.stiffness * stepCoef);

    //2 * normal -> a.relax_weight / b.relax_weight
    let aw = 1; //this.a.relax_weight();
    let bw = 1; //this.b.relax_weight();
    let n1 = normal.scale(2 * bw / (aw + bw));
    let n2 = normal.scale(2 * aw / (aw + bw));

    this.a.pos.mutableAdd(n1);
    this.b.pos.mutableSub(n2);
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
}

AngleConstraint.prototype.relax = function (stepCoef) {
    var angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    var diff = angle - this.angle;

    if (diff <= -Math.PI)
        diff += 2 * Math.PI;
    else if (diff >= Math.PI)
        diff -= 2 * Math.PI;

	diff *= stepCoef*this.stiffness;
	
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
    let {angle, diff, diffMid, is_satisfied} = this.relaxation_params();

    if (is_satisfied)
        return;

    if (diffMid < 0) {
        diff = angle - this.minAngle;
    } else {
        diff = angle - this.maxAngle;
    }
    diff = AngleRangeConstraint.normalize(diff);

    diff *= stepCoef * this.stiffness;

    this.a.pos = this.a.pos.rotate(this.b.pos, diff);
    this.c.pos = this.c.pos.rotate(this.b.pos, -diff);
    this.b.pos = this.b.pos.rotate(this.a.pos, diff);
    this.b.pos = this.b.pos.rotate(this.c.pos, -diff);
};

AngleRangeConstraint.prototype.draw = AngleConstraint.prototype.draw;

AngleRangeConstraint.normalize = function (a) {
    while (a < -Math.PI)
        a += 2 * Math.PI;
    while (a > Math.PI)
        a -= 2 * Math.PI;
    return a;
};

AngleRangeConstraint.prototype.aaa = function () {
    let angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    let diff = this.minAngle - angle;

    //now, which is closer, min or max.
    let angleMid = (this.minAngle + this.maxAngle) / 2;
    let angleVar = Math.abs(this.minAngle - this.maxAngle) / 2;
    let diffMid = AngleRangeConstraint.normalize(angle - angleMid);

    console.log('aaa', diffMid, angleVar);
};

AngleRangeConstraint.prototype.relaxation_params = function () {
    let angle = this.b.pos.angle2(this.a.pos, this.c.pos);
    let diff = this.minAngle - angle;

    //now, which is closer, min or max.
    let angleMid = (this.minAngle + this.maxAngle) / 2;
    let angleVar = Math.abs(this.minAngle - this.maxAngle) / 2;
    let diffMid = AngleRangeConstraint.normalize(angle - angleMid);

    return {angle, diff, diffMid, is_satisfied: Math.abs(diffMid) <= angleVar};
}

AngleRangeConstraint.prototype.is_satisfied = function () {
    let {is_satisfied} = this.relaxation_params();
    return is_satisfied;
}

export function DistanceRangeConstraint(a, b, stiffness, minDistance, maxDistance) {
    this.a = a;
    this.b = b;
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;
    this.stiffness = stiffness;
}

DistanceRangeConstraint.prototype.relaxation_data = function() {
    let normal = this.a.pos.sub(this.b.pos);
    let m2 = normal.length2();
    let m = Math.sqrt(m2);

    if (m < 1e-5) {
        normal = new Vec2(1, 0);
        m2 = 1;
        m = 1;
    }

    let dist = 0;
    if (this.minDistance * this.minDistance > m2)
        dist = this.minDistance;
    else if (this.maxDistance * this.maxDistance < m2)
        dist = this.maxDistance;
    else
        dist = m;

    let scale = (dist - m) / m;
    return {normal, scale};
}

DistanceRangeConstraint.prototype.relax = function (stepCoef) {
    let {normal, scale} = this.relaxation_data();
    // let scale = (dist * dist - m2) / m2;
    normal.mutableScale(scale * this.stiffness * stepCoef);
    this.a.pos.mutableAdd(normal);
    this.b.pos.mutableSub(normal);
};

DistanceRangeConstraint.prototype.draw = DistanceConstraint.prototype.draw;

let log_cnt = 0;
function log(...a) {
    if (log_cnt > 50)
        return;
    console.log(...a);
    log_cnt++;
}

DistanceRangeConstraint.prototype.is_satisfied = function () {
    let {scale} = this.relaxation_data();
    return Math.abs(scale) < 1e-12;
};