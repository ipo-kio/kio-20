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

import Vec2 from "./vec2";

export Vec2 from "./vec2";
export * from "./constraint";
import {PinConstraint} from "./constraint";
import {Connection, ZERO} from "./railways";
import {RoundElement, SplitElement, StraightElement} from "./elements";

export function Particle(pos) {
    this.pos = (new Vec2()).mutableSet(pos);
    this.lastPos = (new Vec2()).mutableSet(pos);
}

Particle.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = "#2dad8f";
    ctx.fill();
};

Particle.prototype.serialize = function() {
    return this.pos.serialize();
};

Particle.prototype.deserialize = function(s) {
    this.pos.deserialize(s);
    this.lastPos.deserialize(s);
};

export function VerletJS(width, height, canvas, kiotask, bg_drawer) {
    this.width = width;
    this.height = height;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.mouse = new Vec2(0, 0);
    this.mouseDown = false;
    this.draggedEntity = null;
    this.selectionRadius = 20;
    this.highlightColorConnection = "rgba(200, 0, 0, 0.7)";
    this.highlightColorParticle = "rgba(0, 200, 0, 0.7)";
    this.kiotask = kiotask;
    this.bg_drawer = bg_drawer;

    this.bounds = function (particle) {
        if (particle.pos.y < 0)
            particle.pos.y = 0;

        if (particle.pos.y > this.height - 1)
            particle.pos.y = this.height - 1;

        if (particle.pos.x < 0)
            particle.pos.x = 0;

        if (particle.pos.x > this.width - 1)
            particle.pos.x = this.width - 1;
    };

    // prevent context menu
    this.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    };

    this.canvas.onmousedown = e => {
        this.mouseDown = true;

        let nearest = this.nearestEntity();
        if (nearest) {
            this.draggedEntity = nearest;
            this.draggingDisplacement = nearest.pos.sub(this.mouse);
        }
    };

    document.addEventListener('mouseup', e => {
        if (this.mouseDown)
            this.canvas.onmouseup(e);
    });

    this.canvas.onmouseup = e => {
        let d_point = this.draggedEntity;

        //add connection if needed
        //if this is a dragged endpoint without a connection
        if (d_point && !d_point.is_center_point && d_point.connection === null) {
            let d_element = d_point.element;
            let other_nearest = this.nearestEntity(p => !d_element.contains_endpoint(p) && !p.is_center_point && p.connection === null);
            if (other_nearest) {
                this.composites[0].add_connecton(new Connection(d_point, other_nearest));
                this.submit();
            }
        }

        this.mouseDown = false;
        this.draggedEntity = null;
    };

    this.canvas.ondblclick = e => {
        let ne = this.nearestEntity();

        let block = this.composites[0];

        if (!ne) {
            //dbl click on an empty space
            let new_element = null;
            switch (this.kiotask.selected_tool_miss) {
                case 'straight':
                    new_element = new StraightElement(block);
                    break;
                case 'round':
                    new_element = new RoundElement(block);
                    break;
                case 'split':
                    new_element = new SplitElement(block);
                    break;
            }
            if (new_element !== null) {
                new_element.move_to(this.mouse);
                block.add_element(new_element);
                this.submit();
            }
            return;
        }

        if (ne.is_center_point) {
            if (this.kiotask.selected_tool_over !== 'nail') {
                //then remove
                let e = ne.element;
                block.remove_element(e); //TODO is there a better way? May be, move this out to kio
            } else {
                //then change pins
                if (ne && ne.is_center_point) {
                    this.draggedEntity = false;
                    let e = ne.element;
                    let pins = e.pins + 1;
                    if (pins > 2) pins = 0;
                    e.set_pins(pins);
                }
            }
            this.submit();
        }

        if (!ne.is_center_point && ne.connection !== null) {
            block.remove_connection(ne.connection);
            this.submit();
        }
    };

    this.canvas.onmousemove = e => {
        var rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
    };

    // simulation params
    this.gravity = new Vec2(0, 0.2);
    this.friction = 0.9; //0.3;//0.99;
    this.groundFriction = 0.8;

    // holds composite entities
    this.composites = [];

    //stability
    this.last_stable_solution = {e: [], c: []}; //TODO move this to block
    this.was_stable = false;
}

VerletJS.prototype.Composite = Composite;

export function Composite() {
    this.particles = [];
    this.constraints = [];

    // this.drawParticles = null;
    // this.drawConstraints = null;
}

Composite.prototype.pin = function (index, pos) {
    pos = pos || this.particles[index].pos;
    var pc = new PinConstraint(this.particles[index], pos);
    this.constraints.push(pc);
    return pc;
};

VerletJS.prototype.frame = function (step) {
    var i, j, c;

    let all_constraints_are_satisfied = this.composites[0].is_satisfied();

    let total_velocity = 0;
    let total_particles = 0;

    for (c in this.composites) {
        for (i in this.composites[c].particles) {
            let particles = this.composites[c].particles;

            // calculate velocity
            let velocity;
            if (all_constraints_are_satisfied)
                velocity = ZERO;
            else
                velocity = particles[i].pos.sub(particles[i].lastPos).scale(this.friction);

            // ground friction removed

            // save last good state
            particles[i].lastPos.mutableSet(particles[i].pos);

            // gravity
            particles[i].pos.mutableAdd(this.gravity);

            // inertia
            particles[i].pos.mutableAdd(velocity);

            total_velocity += velocity.length2();
            total_particles += 1;
        }
    }

    let is_stable = all_constraints_are_satisfied;

    if (this.was_stable !== is_stable) {
        if (is_stable) {
            this.last_stable_solution = this.composites[0].serialize();
            this.kiotask.info.style.visibility = 'hidden';

            this.submit();
        } else {
            this.kiotask.info.style.visibility = 'visible';
        }

        this.was_stable = is_stable;
    }

    // handle dragging of entities
    if (this.draggedEntity)
        this.draggedEntity.pos.mutableSet(this.mouse.add(this.draggingDisplacement));

    // relax
    var stepCoef = 1 / step;
    for (c in this.composites) {
        var constraints = this.composites[c].constraints;
        for (i = 0; i < step; ++i)
            for (j in constraints)
                constraints[j].relax(stepCoef);
    }

    // bounds checking
    for (c in this.composites) {
        let particles = this.composites[c].particles;
        for (i in particles)
            this.bounds(particles[i]);
    }

    this.composites[0].update_intersections();

    // console.log('tv', total_velocity, total_velocity < 1e-1, is_stable, total_velocity < 1e-1 && !is_stable);
    let mean_velocity = total_velocity / total_particles;
    return mean_velocity < 0.1 && !is_stable;
};

VerletJS.prototype.submit = function() {
    requestAnimationFrame(() => {
        this.kiotask.kioapi.submitResult({
            num : this.composites[0].elements.length
        });
    });
};

VerletJS.prototype.draw = function () {
    var i, c;

    if (this.bg_drawer)
        this.bg_drawer(this.ctx);
    else
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (c in this.composites) {
        // draw particles
        if (this.composites[c].drawParticles) {
            this.composites[c].drawParticles(this.ctx, this.composites[c]);
        } else {
            var particles = this.composites[c].particles;
            for (i in particles)
                particles[i].draw(this.ctx);
        }

        // draw constraints
        if (this.composites[c].drawConstraints) {
            this.composites[c].drawConstraints(this.ctx, this.composites[c]);
        } else {
            var constraints = this.composites[c].constraints;
            for (let constr of constraints)
                constr.draw(this.ctx);
        }
    }

    // highlight nearest / dragged entity
    let de = this.draggedEntity;
    let nearest = de || this.nearestEntity();
    if (nearest) {
        if (nearest.is_center_point)
            nearest.element.draw_outline(this.ctx);
        else {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(nearest.pos.x, nearest.pos.y, 8, 0, 2 * Math.PI);
            this.ctx.strokeStyle = nearest.connection ? this.highlightColorConnection : this.highlightColorParticle;
            this.ctx.lineWidth = 6;
            this.ctx.stroke();
            this.ctx.restore();
        }
    }

    //draw link, if it is possible to connect
    if (de && !de.is_center_point && de.connection === null) {
        let other_nearest = this.nearestEntity(e => !de.element.contains_endpoint(e) && !e.is_center_point && e.connection == null);
        if (other_nearest) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(other_nearest.pos.x, other_nearest.pos.y, 3, 0, 2 * Math.PI);
            this.ctx.fillStyle = 'black';
            this.ctx.fill();

            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([4, 4]);
            this.ctx.moveTo(nearest.pos.x, nearest.pos.y);
            this.ctx.lineTo(other_nearest.pos.x, other_nearest.pos.y);
            this.ctx.stroke();

            this.ctx.restore();
        }
    }

    //draw intersection outlines, uncomment to view intersection outlines
    /*let debug_ctx = this.ctx;
    for (let e of this.composites[0].elements) {
        debug_ctx.save();
        debug_ctx.lineWidth = 1;
        debug_ctx.strokeStyle = 'black';
        let o = e.intersection_outline();
        debug_ctx.beginPath();
        debug_ctx.moveTo(o[0], o[1]);
        for (let i = 2; i < o.length; i += 2)
            debug_ctx.lineTo(o[i], o[i + 1]);
        debug_ctx.closePath();
        debug_ctx.stroke();

        debug_ctx.restore();
    }*/
};

VerletJS.prototype.nearestEntity = function (filter = e => true) {
    var d2Nearest = 0;
    var entity = null;

    // find nearest point
    for (let c of this.composites) {
        var particles = c.particles;
        for (let p of particles)
            if (filter(p)) {
                var d2 = p.pos.dist2(this.mouse);
                if (d2 <= this.selectionRadius * this.selectionRadius && (entity == null || d2 < d2Nearest)) {
                    entity = p;
                    d2Nearest = d2;
                }
            }
    }

    if (entity) {
        let ec = entity.connection;
        if (ec && ec.endpoint2 === entity) {
            entity = ec.endpoint1;
        }
    }

    return entity;
};

