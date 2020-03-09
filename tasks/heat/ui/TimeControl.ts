import ProcessDrawer, {SliceType} from "./ProcessDrawer";
import {download} from "./BodyUI";
import {TIME_DIVISION, VIEW_DIVISION} from "../solver/Consts";
import HeatingProcess from "../solver/HeatingProcess";
import MouseEvent = createjs.MouseEvent;

const W = 640;
const H = 100;
const L = 5;

export default class TimeControl extends createjs.Container {
    private processDrawerTime: ProcessDrawer;
    private tick: createjs.Shape;
    private _time: number = 0;

    constructor() {
        super();
        this.processDrawerTime = new ProcessDrawer(
            SliceType.TY,
            TIME_DIVISION,
            VIEW_DIVISION,
            W,
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
            this.time = (me.localX / W) * (this.process.t_max + 1);
        };
        this.addEventListener("pressmove", time_change_listener);
        this.addEventListener("mousedown", time_change_listener);
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
        let l = W / t;
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
};