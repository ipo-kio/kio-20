export default class SolverUpdateEvent extends createjs.Event {

    from: number;
    to: number;
    heat_time_updated: boolean;

    constructor(from: number, to: number, heat_time_updated: boolean) {
        super("heat update", false, false);
        this.from = from;
        this.to = to;
        this.heat_time_updated = heat_time_updated;
    }
}