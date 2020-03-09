import {A, K, Material} from "./solver/Consts";

export default class Body {

    private readonly elements: Material[][];

    constructor(elements: Material[][]) {
        this.elements = elements;
    }



    a(x: number, y: number): number {
        let m = this.elements[y][x];
        return A[m];
    }

    k(x: number, y: number): number {
        let m = this.elements[y][x];
        return K[m];
    }

    get width(): number {
        return this.elements[0].length;
    }

    get height(): number {
        return this.elements.length;
    }
}