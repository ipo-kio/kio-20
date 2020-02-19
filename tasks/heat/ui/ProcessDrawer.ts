import HeatingProcess from "../HeatingProcess";

export default class ProcessDrawer extends createjs.Shape {

    process: HeatingProcess;

    constructor(process: HeatingProcess) {
        super();
        this.process = process;
        this.process
    }
}