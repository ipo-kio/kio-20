export default class SolverUpdateEvent extends createjs.Event {

    from: number;
    to: number;

    constructor(from: number, to: number) {
        super("heat update", false, false);
        this.from = from;
        this.to = to;
    }
}