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

export type Material = "glass" | "air" | "tree" | "aluminium" | "sand";

// http://scask.ru/q_book_emp.php?id=35
const MUL = 1;
const A = {
    "aluminium": 8.418e-5 * MUL,
    "air": 1.9e-5 * MUL,
    "sand": 1.15e-6 * MUL,
    "glass": 3.4e-7 * MUL,
    "tree": 8.2e-8  * MUL
};
const K = {
    "aluminium": 239 * MUL,
    "air": 0.02 * MUL,
    "sand": 1.01 * MUL,
    "glass": 1.01 * MUL,
    "tree": 0.15  * MUL
};

export const A_DEBUG = A;