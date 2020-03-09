import ProcessDrawer, {SliceType} from "./ProcessDrawer";
import {download} from "./BodyUI";
import {FOLLOW_EVALUATION_REDRAW_MS, N_time, TIME_DIVISION, VIEW_DIVISION} from "../solver/Consts";
import HeatingProcess from "../solver/HeatingProcess";
import MouseEvent = createjs.MouseEvent;
import Ticks from "./Ticks";

export const TIME_CONTROL_W = 640;
const H = 100;
const L = 5;

export default class TimeControl extends createjs.Container {
    private processDrawerTime: ProcessDrawer;
    private tick: createjs.Shape;
    private _time: number = 0;
    private follow_evaluation: boolean = false;
    private last_redraw_time: number;

    constructor() {
        super();
        this.processDrawerTime = new ProcessDrawer(
            SliceType.TY,
            TIME_DIVISION,
            VIEW_DIVISION,
            TIME_CONTROL_W,
            H
        );
        this.processDrawerTime.alpha = 1;
        this.addChild(this.processDrawerTime);

        // create tick
        this.tick = new createjs.Shape();
        let g = this.tick.graphics;
        g
            .beginStroke("black")
            .setStrokeStyle(2)
            .moveTo(0, 0)
            .lineTo(0, H)
            .moveTo(-L, -L)
            .lineTo(0, 0)
            .lineTo(L, -L)
            .moveTo(-L, H + L)
            .lineTo(0, H)
            .lineTo(L, H + L)
            .endStroke();
        this.addChild(this.tick);

        this.mouseEnabled = true;

        let time_change_listener = (e: Object) => {
            let me = e as MouseEvent;
            this.time = (me.localX / TIME_CONTROL_W) * (this.process.t_max + 1);
            this.follow_evaluation = false;
        };
        this.addEventListener("pressmove", time_change_listener);
        this.addEventListener("mousedown", time_change_listener);
        this.processDrawerTime.addEventListener("heat update", () => {
            if (this.follow_evaluation) {
                let now = new Date().getTime();
                let elapsed = now - this.last_redraw_time;
                let process = this.processDrawerTime.process;
                let lastLayer = process.last_layer;
                if (elapsed > FOLLOW_EVALUATION_REDRAW_MS || lastLayer == process.t_max + 1) {
                    this.last_redraw_time = now;
                    let new_time = lastLayer - 1;
                    if (new_time -= new_time % TIME_DIVISION)
                        this.time = new_time;
                }
            }
        });

        let ticks = new Ticks(TIME_CONTROL_W, 0, N_time, 500);
        this.addChild(ticks);
        ticks.y = H;
    }

    get time_normalized(): number {
        let t = Math.floor(this._time);
        if (t > this.process.t_max)
            t = this.process.t_max;
        if (t < 0)
            t = 0;
        return t;
    }

    set time(value: number) {
        if (this._time === value)
            return;

        let t = this.process.t_max + 1;

        if (value > t)
            value = t;
        if (value < 0)
            value = 0;
        this._time = value;

        // t_max + 1 divisions
        //
        // time = 0     => tick.x = 0
        // time = t_max => tick.x =
        let l = TIME_CONTROL_W / t;
        this.tick.x = value * l;

        this.dispatchEvent("time changed");
    }

    get process(): HeatingProcess {
        return this.processDrawerTime.process;
    }

    set process(process: HeatingProcess) {
        this.processDrawerTime.process = process;
        this.processDrawerTime.v0 = process.x_max - 1;
    }

    followEvaluation() {
        this.follow_evaluation = true;
        this.last_redraw_time = 0;
    }
};