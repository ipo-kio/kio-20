export class Experiments {

    // (33) (12) [3, 2, 4, 1, 2, 1, 2, 1, 2, 1]
    // (31) (15) [1, 2, 3, 1, 1, 2, 1, 1, 1, 1]
    // 49 13 (8) [2, 3, 2, 2, 2, 2, 2, 2]
    // 25 12 (8) [1, 1, 1, 1, 1, 3, 1, 2]
    // 15 10 (8) [1, 2, 3, 1, 2, 3, 1, 2]
    // 29 14 (9) [1, 1, 1, 1, 1, 1, 1, 2, 3]

    /**
     * we have n rotation
     * @param n number of rotations
     * @param t max ray length
     * @param rays lengths of rays (from 1 to t), n elements in array
     */
    constructor(rays, allow_back) {

        let t = Math.max(...rays);
        let n = rays.length;
        console.log('start', n, t, rays);

        this.rays = rays;
        this.t = t;
        this.n = n;

        let all_found_rotation_sets = new Set();
        let rotation_set_was_already_found = rot_set => all_found_rotation_sets.has(rot_set.serialize());
        let new_rotation_set_found = rot_set => all_found_rotation_sets.add(rot_set.serialize());

        let all_rotations = [];
        for (let i = 0; i < n; i++)
            all_rotations.push(i);

        let initial_rotation_set = new RotationsSet(all_rotations);
        new_rotation_set_found(initial_rotation_set);
        let layer = [initial_rotation_set];

        let CNT = 0;
        while (layer.length > 0 && CNT <= 100) {
            CNT++;
            let next_layer = [];

            for (let rot_set of layer) {
                for (let i = allow_back ? -t : 1; i <= t; i++) {
                    if (i === 0)
                        continue;

                    let new_rot_set = rot_set.next(rays, i);
                    new_rot_set.history.push(...rot_set.history, i);
                    if (!rotation_set_was_already_found(new_rot_set)) {
                        if (new_rot_set.is_singleton()) {
                            let h = new_rot_set.history;
                            console.log('found', h.length, h, new_rot_set.a[0]);
                            this.history = h;
                            this.length = h.length;
                            return;
                        }

                        new_rotation_set_found(new_rot_set);
                        next_layer.push(new_rot_set);
                    }
                }
            }

            layer = next_layer;
        }
        console.log('nothing found');
    }


}

class RotationsSet {
    a = [];
    history = [];

    constructor(a) {
        a.sort((x, y) => x - y);
        let b = [a[0]];
        for (let i = 1; i < a.length; i++)
            if (a[i] !== a[i - 1])
                b.push(a[i]);
        this.a = b;
    }

    serialize() {
        return this.a.join(',');
    }

    /*static deserialize(repr) {
        return new RotationsSet(repr.split(',').map(x => +x));
    }*/

    next(rays, len_sign) {
        let len = Math.abs(len_sign);
        let dir = Math.sign(len_sign);

        let n = rays.length;
        let b = [];
        for (let i of this.a)
            if (rays[i] >= len) {
                let j = i + dir;
                if (j >= n)
                    j -= n;
                if (j < 0)
                    j += n;
                b.push(j);
            } else
                b.push(i);

        return new RotationsSet(b);
    }

    is_singleton() {
        return this.a.length === 1;
    }


}