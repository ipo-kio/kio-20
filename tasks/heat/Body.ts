export default class Body {

    private readonly elements: Material[][];

    constructor(elements: Material[][]) {
        this.elements = elements;
    }

    a(x: number, y: number): number {
        let m = this.elements[y][x];
        return A[m];
    }

    get width(): number {
        return this.elements[0].length;
    }

    get height(): number {
        return this.elements.length;
    }
}

export type Material = "glass" | "air" | "tree" | "aluminium" | "sand";

/*
const A = {
    "aluminium": 8.418e-5,
    "air": 1.9e-5,
    "sand": 1.15e-6,
    "glass": 3.4e-7,
    "tree": 8.2e-8
};
 */
const A = {
    "aluminium": 80,
    "air": 20,
    "sand": 1,
    "glass": 0.3,
    "tree": 0.04
};