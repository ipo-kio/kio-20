const H = 8;

export default class Ticks extends createjs.Container {

    constructor(W: number, ind0: number, ind1: number, step: number, postfix: string = '', font: string = '14px Arial') {
        super();

        let ticks = new createjs.Shape();
        this.addChild(ticks);
        let g = ticks.graphics;
        let unit_length = (ind1 - ind0) / W;
        g.beginStroke('black');
        g.moveTo(0, 0);
        g.lineTo(W, 0);
        for (let ind = ind0; ind <= ind1; ind += step) {
            let l = (ind - ind0) / unit_length;
            g.moveTo(l, 0).lineTo(l, H);

            let label = ind.toString() + postfix;
            let t = new createjs.Text(label, font);
            this.addChild(t);
            t.textAlign = "center";
            t.textBaseline = "top";
            t.x = l;
            t.y = H + 4;

            console.log("ind", ind, l);
        }
        g.endStroke();
    }
}