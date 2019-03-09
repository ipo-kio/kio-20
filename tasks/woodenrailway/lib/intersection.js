function line_side(x1, y1, x2, y2, x, y) {
    //(x - x1) / (x2 - x1) = (y - y1) / (y2 - y1)
    //x * (y2 - y1) + y * (x1 - x2) + y1 * x2 - y2 * x1 = 0
    let a = y2 - y1;
    let b = x1 - x2;
    let c = y1 * x2 - y2 * x1;

    let v = a * x + b * y + c;

    if (Math.abs(v) < 1e-5)
        return 0;
    else
        return Math.sign(v);
}

// let shown = false;
export function intersect_polys(poly1, poly2) {
    return intersect_polys_oneside(poly1, poly2) && intersect_polys_oneside(poly2, poly1);
}

function intersect_polys_oneside(poly1, poly2) { //if false => false, if true => may be true
    let n1_2 = poly1.length;
    let n2_2 = poly2.length;

    // let show = !shown;
    // shown = true;

    let side1 = line_side(poly1[0], poly1[1], poly1[2], poly1[3], poly1[4], poly1[5]);
    // if (show) console.log(side1, poly1, poly2);

    for (let i = 0; i < n1_2; i += 2) {
        let j = i + 2;
        if (j >= n1_2)
            j = 0;

        let all_at_other_side = true;
        for (let ii = 0; ii < n2_2; ii += 2) {
            let side = line_side(poly1[i], poly1[i + 1], poly1[j], poly1[j + 1], poly2[ii], poly2[ii + 1]);
            if (side === side1) {
                all_at_other_side = false;
                break;
            }
        }

        if (all_at_other_side)
            return false;
    }

    return true;
}

export class OutlineContext {

    path = [];
    matrix = [[1, 0, 0], [0, 1, 0] /*, [0, 0, 1]*/];

    push(x, y) {
        //transform
        let m = this.matrix;
        let xt = m[0][0] * x + m[0][1] * y + m[0][2];
        let yt = m[1][0] * x + m[1][1] * y + m[1][2];
        this.path.push(xt, yt);
    }

    beginPath() {
        this.path = [];
    }

    closePath() {
        //do nothing
    }

    moveTo(x, y) {
        this.push(x, y);
    }

    lineTo(x, y) {
        this.push(x, y);
    }

    bezierCurveTo(_1, _2, _3, _4, x, y) {
        this.push(x, y);
    }

    rotate(phi) {
        /*
             c -s 0       m[0][0] m[0][1] m[0][2]
             s  c 0       m[1][0] m[1][1] m[1][2]
             0  0 1          0       0       1
         */

        let m = this.matrix;
        let c = Math.cos(phi);
        let s = Math.sin(phi);

        this.matrix = [
            [c * m[0][0] + s * m[0][1], -s * m[0][0] + c * m[0][1], m[0][2]],
            [c * m[1][0] + s * m[1][1], -s * m[1][0] + c * m[1][1], m[1][2]]
        ];
    }

    translate(x, y) {
        /*
              1 0 x       m[0][0] m[0][1] m[0][2]
              0 1 y       m[1][0] m[1][1] m[1][2]
              0 0 1          0       0       1
         */
        let m = this.matrix;
        this.matrix = [
            [m[0][0], m[0][1], m[0][0] * x + m[0][1] * y + m[0][2]],
            [m[1][0], m[1][1], m[1][0] * x + m[1][1] * y + m[1][2]]
        ];
    }

    arc(cx, cy, r, phi1, phi2, acw) {
        let angles;
        // if (!acw) { //positive directon
        //     while (phi2 < phi1)
        //         phi2 += 2 * Math.PI;
        //     angles = [phi1, (phi1 + phi2) / 2, phi2];
        // } else { //negative direction
        //     while (phi2 > phi1)
        //         phi2 -= 2 * Math.PI;
        //     angles = [phi2, (phi1 + phi2) / 2, phi1];
        // }
        //
        if (acw)
            angles = [/*phi1, */(phi1 + phi2) / 2, phi2];
        else
            angles = [/*phi1, */phi2];

        for (let phi of angles)
            this.push(cx + r * Math.cos(phi), cy + r * Math.sin(phi))
    }

}