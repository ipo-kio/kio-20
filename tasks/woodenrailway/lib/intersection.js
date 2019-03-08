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

export function intersect_polys(poly1, poly2) {
    let n1_2 = poly1.length;
    let n2_2 = poly2.length;

    let side1 = line_side(poly1[0], poly1[1], poly1[2], poly1[3], poly1[4], poly1[5]);
    let side2 = line_side(poly2[0], poly2[1], poly2[2], poly2[3], poly2[4], poly2[5]);

    for (let i = 0; i < n1_2; i += 2) {
        let j = i + 2;
        if (j >= n1_2)
            j = 0;

        for (let ii = 0; ii < n2_2; ii += 2) {
            let side = line_side(poly1[i], poly1[i + 1], poly1[j], poly1[j + 1], poly2[ii], poly2[ii + 1]);
            if (side === 0 || side === -side1)
                return true;
        }
    }

    return false;
}