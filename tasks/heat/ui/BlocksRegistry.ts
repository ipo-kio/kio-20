import {Material} from "../Body";
import {BodyUI, DEFAULT_MATERIAL} from "./BodyUI";
import Block from "./Block";
import {KioApi} from "../../KioApi";

export default class BlocksRegistry extends createjs.Container {

    private bodyUI: BodyUI;

    constructor(kioapi: KioApi, amount: { [key in Material]: number }) {
        super();

        this.bodyUI = new BodyUI();
        this.addChild(this.bodyUI);

        let row_element = 0;
        let row_index = 0;
        for (let m in amount)
            if (m !== DEFAULT_MATERIAL) {
                let material = m as Material;
                let a = amount[material];
                for (let i = 0; i < a; i++) {
                    let b = new Block(kioapi, material, row_element * (Block.WIDTH + DW), row_index * (Block.HEIGHT + DH));
                    this.addChild(b);
                    row_element++;
                    if (row_element === ROW) {
                        row_element = 0;
                        row_index++;
                    }
                    b.addEventListener("block move", () => {
                        // console.log(this.bodyUI.find_cell_for_position(b.x - this.bodyUI.x, b.y - this.bodyUI.y));
                    });
                    b.addEventListener("block stop move", () => {
                        console.log("stop move", this.bodyUI.find_cell_for_position(b.x - this.bodyUI.x, b.y - this.bodyUI.y));
                    });
                }
            }

        this.bodyUI.x = 0;
        this.bodyUI.y = (Block.HEIGHT + DH) * 3;
        console.log(this.bodyUI.x, this.bodyUI.y)
    }


}

const DW = 8;
const DH = 8;
const ROW = 8;