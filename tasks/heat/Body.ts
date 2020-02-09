export default class Body {

    private readonly elements: Material[][];

    constructor(elements: Material[][]) {
        this.elements = elements;
    }

    a(x: number, y: number): number {
        let m = this.elements[y][x];
        return A[m];
    }

    aa(x: number, y: number): number {
        let a = this.a(x, y);
        return a * a;
    }


    get width(): number {
        return this.elements[0].length;
    }

    get height(): number {
        return this.elements.length;
    }
}

enum Material {
    GLASS,
    AIR,
    TREE,
    ALUMINIUM
}

const A = [
    3.4e-7,
    1.9e-5,
    8.2e-8,
    8.418e-5
];