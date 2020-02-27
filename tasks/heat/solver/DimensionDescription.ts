export class DimensionDescription {
    private readonly _n: number;
    private readonly x_min:number;
    private readonly _min: number;
    private readonly _max: number;
    private readonly _dx: number;

    constructor(min: number, max: number, n: number, is_neuman: boolean) {
        this._min = min;
        this._max = max;
        this._n = n;

        if (is_neuman) {
            //is_neuman = true
            //(max - min + dx) / (n - 1) = dx => max - min + dx = (n-1)dx
            //dx = (max - min) / (n - 2)

            this._dx = (max - min) / (n - 2);
            this.x_min = min - this._dx / 2;
        } else {
            //is_neuman = false
            //dx = (max - min) / (n - 1)

            this.x_min = min;
            this._dx = (max - min) / (n - 1);
        }
    }

    /**
     *
     * @param i in 0 .. n - 1
     */
    v(i: number) {
        return this.x_min + i * this._dx;
    }

    get n(): number {
        return this._n;
    }


    get min(): number {
        return this._min;
    }

    get max(): number {
        return this._max;
    }


    get dx(): number {
        return this._dx;
    }
}
