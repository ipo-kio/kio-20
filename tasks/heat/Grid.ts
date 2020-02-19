import Body from "./Body";

export default class Grid {

    private readonly _N_element: number;
    private readonly _dh: number;

    private readonly _N_time: number;
    private readonly _dt: number;

    private readonly _body: Body;

    constructor(body: Body, N_element: number, dh: number, N_time: number, dt: number) {
        this._body = body;
        this._N_element = N_element;
        this._dh = dh;
        this._N_time = N_time;
        this._dt = dt;
    }

    get N_width(): number {
        return this._N_element * this._body.width
    }

    get N_height(): number {
        return this._N_element * this._body.height;
    }

    a(x: number, y: number) {
        let x1 = Math.floor(x / this._N_element);
        let y1 = Math.floor(y / this._N_element);

        if (x1 === this._body.width)
            x1 -= 1;
        if (y1 === this._body.height)
            y1 -= 1;

        return this._body.a(x1, y1);
    }

    get N_element(): number {
        return this._N_element;
    }

    get dh(): number {
        return this._dh;
    }

    get N_time(): number {
        return this._N_time;
    }

    get dt(): number {
        return this._dt;
    }

    get body(): Body {
        return this._body;
    }
}