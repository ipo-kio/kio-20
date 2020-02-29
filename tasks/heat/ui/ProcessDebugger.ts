import HeatingProcess from "../solver/HeatingProcess";
import ProcessDrawer, {SliceType} from "./ProcessDrawer";
import {N_time, VIEW_DIVISION} from "./BodyUI";

export class ProcessDebugger extends createjs.Container {

    private _process: HeatingProcess;
    private _drawer: ProcessDrawer[] = [];

    get process(): HeatingProcess {
        return this._process;
    }

    set process(value: HeatingProcess) {
        this._process = value;
        this.update_process();
    }

    private update_process() {
        for (let d of this._drawer)
            this.removeChild(d);
        this._drawer = [];

        for (let t = 0; t <= N_time; t++) {
            let d = new ProcessDrawer(
                this._process,
                SliceType.XY,
                VIEW_DIVISION, VIEW_DIVISION,
                W, H
            );
            this._drawer.push(d);
            this.addChild(d);
            d.alpha = 1;
            d.v0 = t;

            let j = t % 5;
            let i = Math.floor(t / 5);

            d.x = j * (W + 4);
            d.y = i * (H + 4);
        }
    }

}

const W = 100;
const H = 100;