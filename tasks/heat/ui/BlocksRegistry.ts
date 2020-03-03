import {Material} from "../Body";
import {BodyUI, DEFAULT_MATERIAL} from "./BodyUI";
import Block from "./Block";
import {KioApi} from "../../KioApi";
import {ProcessDebugger} from "./ProcessDebugger";

export default class BlocksRegistry extends createjs.Container {

    private bodyUI: BodyUI;
    private processDebugger: ProcessDebugger;

    constructor(kioapi: KioApi, amount: { [key in Material]: number }, use_debugger: boolean = false) {
        super();

        this.bodyUI = new BodyUI(kioapi);
        this.addChild(this.bodyUI);

        let row_element = 0;
        let row_index = 0;
        for (let m in amount)
            if (m !== DEFAULT_MATERIAL) {
                let material = m as Material;
                let a = amount[material];
                for (let i = 0; i < a; i++) {
                    let x0 = this.bodyUI.width + 24 + row_element * (Block.WIDTH + DW);
                    let y0 = row_index * (Block.HEIGHT + DH);
                    let b = new Block(kioapi, material, x0, y0);
                    this.addChild(b);
                    row_element++;
                    if (row_element === ROW) {
                        row_element = 0;
                        row_index++;
                    }
                    b.addEventListener("block move", () => {
                        this.bodyUI.selected_cell = this.bodyUI.find_cell_for_position(b.x - this.bodyUI.x, b.y - this.bodyUI.y);
                    });
                    b.addEventListener("block stop move", () => {
                        let ij = this.bodyUI.selected_cell;
                        if (ij !== null)
                            this.bodyUI.set_block(ij, b);
                        else
                            b.move_home();
                    });
                    b.addEventListener("mousedown", () => {
                        this.setChildIndex(b, this.children.length - 1 - (use_debugger ? 3 : 2)); // 3 extra children
                        this.bodyUI.remove_block(b);
                    });
                }
            }

        this.bodyUI.x = 0;
        this.bodyUI.y = 0;

        if (use_debugger) {
            this.processDebugger = new ProcessDebugger();
            this.addChild(this.processDebugger);
            this.processDebugger.x = 0;
            this.processDebugger.y = this.bodyUI.height + 8 + 100 + 8; // 100 is the height of processDrawerTime
        }

        this.addChild(this.bodyUI.processDrawer);
        this.bodyUI.processDrawer.x = this.bodyUI.x;
        this.bodyUI.processDrawer.y = this.bodyUI.y;

        this.addChild(this.bodyUI.timeController);
        this.bodyUI.timeController.x = 0;
        this.bodyUI.timeController.y = 8 + this.bodyUI.height;

        if (use_debugger) {
            this.bodyUI.addEventListener("process changed", () => {
                this.processDebugger.process = this.bodyUI.process;
            });
            this.processDebugger.process = this.bodyUI.process;
        }
    }
}

const DW = 4;
const DH = 4;
const ROW = 5;
