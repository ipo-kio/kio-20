import ProcessDrawer, {SliceType} from "./ProcessDrawer";
import {TIME_DIVISION, VIEW_DIVISION} from "./BodyUI";
import HeatingProcess from "../solver/HeatingProcess";

export default class TimeControl extends createjs.Container {
    private processDrawerTime: ProcessDrawer;
    private tick: createjs.Shape;
    private time: number = 0;

    constructor() {
        super();
        this.processDrawerTime = new ProcessDrawer(
            SliceType.TY,
            TIME_DIVISION,
            VIEW_DIVISION,
            640,
            100
        );
        this.addChild(this.processDrawerTime);

        // create tick
        this.tick = new createjs.Shape();
        let g = this.tick.graphics;
        // g
        //     .beginStroke("black")
        //     .th
    }

    get process(): HeatingProcess {
        return this.processDrawerTime.process;
    }

    set process(process: HeatingProcess) {
        this.processDrawerTime.process = process;
        this.processDrawerTime.v0 = process.x_max - 1;
    }
};