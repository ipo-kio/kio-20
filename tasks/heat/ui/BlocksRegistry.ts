import {BodyUI} from "./BodyUI";
import Block from "./Block";
import {KioApi} from "../../KioApi";
import {ProcessDebugger} from "./ProcessDebugger";
import {DEFAULT_MATERIAL, Material} from "../solver/Consts";

export default class BlocksRegistry extends createjs.Container {

    private bodyUI: BodyUI;
    private processDebugger: ProcessDebugger;
    private readonly index2block: Block[];

    constructor(kioapi: KioApi, amount: { [key in Material]: number }, use_debugger: boolean = false) {
        super();

        this.bodyUI = new BodyUI(kioapi);
        this.addChild(this.bodyUI);

        this.index2block = [];

        let index = 0;
        let row_element = 0;
        let row_index = 0;
        for (let m in amount)
            if (m !== DEFAULT_MATERIAL) {
                let material = m as Material;
                let a = amount[material];
                for (let i = 0; i < a; i++) {
                    let x0 = this.bodyUI.width + 12 + row_element * (Block.WIDTH + DW);
                    let y0 = row_index * (Block.HEIGHT + DH);
                    let b = new Block(kioapi, material, x0, y0, index++);
                    this.index2block.push(b);
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
            this.processDebugger.y = this.bodyUI.height + 4 + 100 + 4; // 100 is the height of processDrawerTime
        }

        this.addChild(this.bodyUI.processDrawer);
        this.bodyUI.processDrawer.x = this.bodyUI.x + this.bodyUI.width + 12  + (DW + Block.WIDTH) * ROW + 4;
        this.bodyUI.processDrawer.y = this.bodyUI.y;

        this.addChild(this.bodyUI.timeController);
        this.bodyUI.timeController.x = 0;
        this.bodyUI.timeController.y = 24 + this.bodyUI.height;

        if (use_debugger) {
            this.bodyUI.addEventListener("process changed", () => {
                this.processDebugger.process = this.bodyUI.process;
            });
            this.processDebugger.process = this.bodyUI.process;
        }
    }

    block_by_index(index: number) {
        return this.index2block[index];
    }
}

const DW = 4;
const DH = 4;
const ROW = 4;
