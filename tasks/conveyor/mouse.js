export class Mouse {
    _x;
    _y;

    get x() {
        return this._x;
    }

    get y() {
        return this._y;
    }
}

export class TranslatedMouse {
    tx = 0;
    ty = 0;

    constructor(mouse, tx, ty) {
        this.mouse = mouse;
        this.tx = tx;
        this.ty = ty;
    }

    get x() {
        return this.mouse.x - this.tx;
    }

    get y() {
        return this.mouse.y - this.ty;
    }
}