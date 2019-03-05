
//this exports all the verlet methods globally, so that the demos work.

import constraint from "./constraint";

import VerletJS from "./verlet";

import objects from "./objects"; //patches VerletJS.prototype (bad)
import vec2 from "./vec2";

window.Vec2 = vec2;
window.VerletJS = VerletJS;

window.Particle = VerletJS.Particle;

window.DistanceConstraint = constraint.DistanceConstraint;
window.PinConstraint      = constraint.PinConstraint;
window.AngleConstraint    = constraint.AngleConstraint;


