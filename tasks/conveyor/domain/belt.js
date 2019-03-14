import {Hand, LEN0} from "./hand";
import {Detail, DR} from "./detail";

const TIME_HAND_DOWN_UP = 1;
const TIME_MOVE = 2;
const TIME_PERIOD = 2 * TIME_HAND_DOWN_UP + TIME_MOVE;
const DIST_MOVE = 200;

export class Belt {

    initial_rays;

    x = 0;
    y = 0;
    _time = 0;
    program; //array of numbers from 1 to t
    detail;
    step;
    step_index;
    hands;

    constructor(initial_rays) {
        this.initial_rays = initial_rays;
        this.t = Math.max(...this.initial_rays);
        this.detail = new Detail(initial_rays);

        this.hands = new Array(30); //TODO allow adding hands
        let hand_y = -DR * (this.t - 1) - LEN0;
        console.log(hand_y);
        for (let i = 0; i < this.hands.length; i++)
            this.hands[i] = new Hand(i * DIST_MOVE, hand_y);
    }

    _update_time() {
        this.step_index = Math.floor(this._time / TIME_PERIOD);
        let step_time = this._time - this.step_index * TIME_PERIOD;

        if (step_time < TIME_HAND_DOWN_UP)
            this._update_time_hand_down(step_time);
        else if (step_time < 2 * TIME_HAND_DOWN_UP)
            this._update_time_hand_up(step_time - TIME_HAND_DOWN_UP);
        else
            this._update_time_move(step_time - 2 * TIME_HAND_DOWN_UP);
    }

    _update_time_hand_down(step_time) {
        this.step = 'hand down';
        this.detail.x = DIST_MOVE * this.step_index;
        this._reset_all_hands();
        this.hands[this.step_index].set_out(1, step_time / TIME_HAND_DOWN_UP);
    }

    _update_time_hand_up(step_time) {
        this.step = 'hand up';
        this.detail.x = DIST_MOVE * this.step_index;
        this._reset_all_hands();
        this.hands[this.step_index].set_out(1, 1 - step_time / TIME_HAND_DOWN_UP);
    }

    _update_time_move(step_time) {
        this.step = 'move';
        this.detail.x = DIST_MOVE * this.step_index + DIST_MOVE * step_time / TIME_MOVE;
        this._reset_all_hands();
    }

    _reset_all_hands() {
        for (let hand of this.hands)
            hand.set_out(1,0);
    }

    get time() {
        return this._time;
    }

    set time(_time) {
        this._time = _time;
        this._update_time();
    }

    draw(ctx) {
        ctx.save();

        ctx.translate(this.x, this.y);

        for (let hand of this.hands)
            hand.draw(ctx);

        this.detail.draw(ctx);
        ctx.restore();
    }
}