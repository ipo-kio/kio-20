export class MercatorProjector {

    c;
    y0;
    long1;

    /**
     * Прямоугольник для рисования карты
     * @param x1 координата левой стороны прямоугольника
     * @param x2 координата правой стороны прямоугольника
     * @param y1 координата верхней стороны прямоугольника
     * @param long1 долгота левой сторон прямоугольника в градусах
     * @param long2 долгота правой сторон прямоугольника в градусах
     * @param lat1 широта верхней стороны прямоугольника в градусах
     */
    constructor(x1, x2, y1, long1=-180, long2=180, lat1=86) {
        lat1 *= Math.PI / 180;
        long1 *= Math.PI / 180;
        long2 *= Math.PI / 180;

        //c(long2 - long1) = (x2 - x1)
        //y1 = y0 + c ln tg (lat1/2 + pi/4)
        //y2 = y0 + c ln tg (lat2/2 + pi/4)
        this.c = (x2 - x1) / (long2 - long1);
        this.y0 = y1 - this.c * Math.log(Math.tan(lat1 / 2 + Math.PI / 4));
        this.long1 = long1;
    }

    /**
     * Возвращает евклидовы координаты по широте и долготе.
     * @returns {number[]} массив из двух чисел.
     */
    sphere2euclid([lat, long]) {
        lat *= Math.PI / 180;
        long *= Math.PI / 180;
        let x = this.c * (long - this.long1);
        let y = this.y0 + this.c * Math.log(Math.tan(lat / 2 + Math.PI / 4));
        return [x, y];
    }

    euclid2sphere([x, y]) {
        //x = c * (long - this.long1)
        let long = x / this.c + this.long1;
        //y = y0 + c * ln tn (lat/2 + pi/4)
        let lat = 2 * Math.atan(Math.exp((y - this.y0) / this.c)) - Math.PI / 2;
        return [lat * 180 / Math.PI, long * 180 / Math.PI];
    }

    sphere23d([lat, long]) {
        lat *= Math.PI / 180;
        long *= Math.PI / 180;
        return [
            Math.cos(lat) * Math.cos(long),
            Math.cos(lat) * Math.sin(long),
            Math.sin(lat)
        ]
    }

    /**
     * Возвращает длину кратчайшего расстояния между двумя точками. Результат надо умножить на предполагаемый радиус
     * глобуса
     */
    get_path_length([lat1, long1], [lat2, long2]) {
        let [x1, y1, z1] = this.sphere23d([lat1, long1]);
        let [x2, y2, z2] = this.sphere23d([lat2, long2]);

        let dot = x1 * x2 + y1 * y2 + z1 * z2;
        return Math.acos(dot);
    }

    /**
     * Рисует путь между двумя точками, заданными широтой и долготой. Этот путь проходит всегда по видимой части
     * карты, даже если кратчайший путь реально проходит через точку с долготой 180. По
     */
    draw_path(ctx, [lat1, long1], [lat2, long2]) {
        let [x1, y1, z1] = this.sphere23d([lat1, long1]);
        let [x2, y2, z2] = this.sphere23d([lat2, long2]);

        let x3 = y1 * z2 - y2 * z1;
        let y3 = -(x1 * z2 - x2 * z1);
        let z3 = x1 * y2 - x2 * y1;

        long1 *= Math.PI / 180;
        long2 *= Math.PI / 180;

        let dx = this.c * (long2 - long1);
        let steps = Math.floor(dx / 4) + 2;

        for (let i = 0; i < steps; i++) {
            let long = i * (long2 - long1) / (steps - 1);
            let b = -z3;
            let a = x3 * Math.cos(long) + y3 * Math.sin(long);
            if (a < 0) {
                a = -a;
                b = -b;
            }
            let lat = Math.atan2(b, a);
            let [x, y] = this.sphere2euclid([lat * 180 / Math.PI, long * 180 / Math.PI]);
            if (i === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);
        }
    }

}