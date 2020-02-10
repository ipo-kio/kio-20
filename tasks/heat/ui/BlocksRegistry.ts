import {Material} from "../Body";
import {BodyUI, DEFAULT_MATERIAL} from "./BodyUI";

export default class BlocksRegistry extends createjs.Container {

    private bodyUI: BodyUI;

    constructor(amount: {[key in Material]: number}) {
        super();

        this.bodyUI = new BodyUI();
        this.addChild(this.bodyUI);

        for (let material in amount)
            if (material !== DEFAULT_MATERIAL) {
                let a = amount[material as Material];
                for (let i = 0; i < a; i++)
            }
    }


}