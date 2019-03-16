import {Hand, LEN0} from "./hand";
import {Detail, DR, R0} from "./detail";

const TIME_HAND_DOWN_UP = 1;
const TIME_MOVE = 2;
const TIME_PERIOD = 2 * TIME_HAND_DOWN_UP + TIME_MOVE;
const DIST_MOVE = 40;

export class Belt {

    initial_rays;

    x = 0;
    y = 0;
    _time = 0;
    _program; //array of numbers from 1 to t
    detail;
    step;
    step_index;
    hands;
    rotations; //array of int (0 = no rotation)

    constructor(initial_rays) {
        this.initial_rays = initial_rays;
        this.t = Math.max(...this.initial_rays);
        this.detail = new Detail(initial_rays);

        this._program = [];
        this._update_hands();
        this._update_rotations();
    }

    set program(value) {
        this._program = value;
        this._update_hands();
        this._update_rotations();
    }

    _update_time() {
        this.step_index = Math.floor(this._time / TIME_PERIOD);
        let step_time = this._time - this.step_index * TIME_PERIOD;

        if (step_time < 2 * TIME_HAND_DOWN_UP)
            this._update_time_hand(step_time);
        else
            this._update_time_move(step_time - 2 * TIME_HAND_DOWN_UP);
    }

    _update_time_hand(step_time) {
        this.step = 'hand down';
        this.detail.x = DIST_MOVE * this.step_index;
        this._reset_all_hands();
        let current_rotation = this.rotations[this.step_index];
        this.hands[this.step_index].set_out(
            this.detail.rays[current_rotation],
            step_time / (2 * TIME_HAND_DOWN_UP),
            this.detail,
            current_rotation,
            this.rotations[this.step_index + 1],
        );
    }

    _update_time_move(step_time) {
        this.step = 'move';
        this.detail.x = DIST_MOVE * this.step_index + DIST_MOVE * step_time / TIME_MOVE;
        this._reset_all_hands();
    }

    _reset_all_hands() {
        for (let hand of this.hands)
            hand.set_out(1, 0);
    }

    get time() {
        return this._time;
    }

    set time(_time) {
        let max_time = this._program.length * (2 * TIME_HAND_DOWN_UP + TIME_MOVE) - TIME_MOVE;
        if (max_time < 0)
            max_time = 0;

        this._time = Math.min(_time, max_time);
        this._update_time();
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        ctx.fillStyle = 'white';
        ctx.strokeStyle = '#9d490c';
        ctx.lineWidth = 2;
        let y0 = -3 * DR - R0 - LEN0;
        let x0 = -3 * DR - R0;
        let skips = this._program.length - 1;
        if (skips < 0)
            skips = 0;
        let width0 = DIST_MOVE * skips + 5;
        ctx.fillRect(
            x0,
            y0 - DR * 3 + 6,
            width0 + 6 * DR + 2 * R0,
            2 * R0 + 6 * DR + LEN0 + 3 * DR - 12
        );
        ctx.strokeRect(
            x0,
            y0 - DR * 3 + 6,
            width0 + 6 * DR + 2 * R0,
            2 * R0 + 6 * DR + LEN0 + 3 * DR - 12
        );

        this.detail.draw(ctx);

        for (let hand of this.hands)
            hand.draw(ctx);

        //draw lines
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'green';
        ctx.setLineDash([2, 3]);
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.moveTo(-5, y0 - DR * i - 0.5);

            ctx.lineTo(width0, y0 - DR * i - 0.5);
            ctx.stroke();
        }

        ctx.restore();
    }

    _update_hands() {
        this.hands = new Array(this._program.length);
        let hand_y = -DR * (this.t - 1) - LEN0 - R0;
        for (let i = 0; i < this._program.length; i++) {
            let h = new Hand(i * DIST_MOVE, hand_y);
            h.extrusion = this._program[i];
            // h.dir //TODO implement direction
            this.hands[i] = h;
        }
    }

    _update_rotations() {
        this.rotations = new Array(this._program.length + 1);
        this.rotations[0] = 0;
        for (let i = 0; i < this._program.length; i++) {
            let r = this.rotations[i];
            let p = this._program[i];

            let ray = this.initial_rays[r];
            if (ray >= p) {
                let r1 = r + 1;
                if (r1 >= this.initial_rays.length)
                    r1 -= this.initial_rays.length;
                if (r1 < 0)
                    r1 += this.initial_rays.length;
                this.rotations[i + 1] = r1;
            } else
                this.rotations[i + 1] = r;
        }
        console.log('updated rotations', this.rotations);
    }
}