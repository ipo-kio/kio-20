import './threadexperiment.scss'; //TODO заменить имя файла со стилями

export class Threadexperiment { //TODO название класса должно совпадать с id задачи, но с заглавной буквы

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings) {
        this.settings = settings;

        //TODO здесь можно совершить инициализацию, которая не зависит от положения в DOM и kioapi
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'threadexperiment' + this.settings.level;
    }

    /**
     *
     * @param domNode
     * @param kioapi
     * @param preferred_width
     */
    initialize(domNode, kioapi, preferred_width) {
        this.kioapi = kioapi;

        let canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        domNode.appendChild(canvas);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this._animate();
    }

    /*
    static preloadManifest() {
        return [
            // {id: "pic1", src: "taskid-resources/pic1.png"},
            // {id: "pic2", src: "taskid-resources/pic2.png"}
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
    }
     */

    parameters() {
        return [
            //TODO добавить список параметров
        ];
    }

    solution() {
        //TODO вернуть объект с описанием решения участника
    }

    loadSolution(solution) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        //TODO загрузить объект с решением участника.
    }

    _animate() {
        let start_frame_time = new Date().getTime();
        let frame = () => {
            let current_frame_time = new Date().getTime();
            let elapsed_time = (current_frame_time - start_frame_time) / 1000;

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._draw(elapsed_time / TIME_FOR_ONE_STEP);

            // requestAnimationFrame(frame);
        };

        requestAnimationFrame(frame);

        // for (let time = 0; time <= 1000; time += 1) {
        //     this._draw(time / 10);
        // }
    }

    //
    _draw(time) {
        let segment_length = new Array(N).fill(0);
        let segment_type = new Array(N).fill(SEGMENT_TYPE_NO);
        let steps = N;
        let i = 0;
        let out_length = 0;
        while (time >= steps && i < N) {
            segment_length[i] = 1;
            segment_type[i] = SEGMENT_TYPE_INSERTED;
            time -= steps;
            i++;
            steps -= 1;
        }

        // first,              segment_length[i] = N - i;  segment_type[i] = TO_AIR_OUT
        //                     segment_length[i + 1] = 0;  segment_type[i + 1] = NO

        //after 1 step:        segment_length[i] = N - i;  segment_type[i] = TO_POINT
        //                     segment_length[i + 1] = 0;  segment_type[i + 1] = TO_AIR_IN

        //next steps-1 steps:  segment_length[i] = N - i - x;  segment_type[i] = TO_POINT
        //x = 0..N-i-1         segment_length[i + 1] = x;  segment_type[i + 1] = TO_AIR_IN

        if (time < 1) {
            segment_type[i] = SEGMENT_TYPE_TO_AIR_OUT;
            segment_length[i] = N - i;
        } else {
            let x = time - 1;
            segment_type[i] = SEGMENT_TYPE_TO_POINT;
            segment_length[i] = N - i - x;
            segment_type[i + 1] = SEGMENT_TYPE_TO_AIR_IN;
            segment_length[i + 1] = x;
            out_length = N - i - 1;
        }

        out_length = 1;
        segment_type = [SEGMENT_TYPE_INSERTED, SEGMENT_TYPE_TO_POINT, SEGMENT_TYPE_TO_AIR_IN];
        segment_length = [1, 2, 0.5];

        let c = this.ctx;
        c.lineWidth = THREAD_THICKNESS;
        c.strokeStyle = "black";
        for (let s = 0; s < segment_type.length; s++) {
            c.save();
            c.translate(X0, Y0 + s * L);

            if (s % 2 === 0)
                c.scale(-1, 1);

            c.fillStyle = "rgba(255,0,0,0.4)";
            c.beginPath();
            c.arc(0, 0, 4, 0, Math.PI * 2);
            c.fill();
            this._draw_segment(L * segment_length[s], segment_type[s], out_length);

            c.restore();
        }
    }

    _draw_segment(length, type, out_length) {
        let c = this.ctx;
        c.save();

        c.beginPath();
        if (type === SEGMENT_TYPE_INSERTED) {
            c.strokeStyle = THREAD_INSERTED_COLOR;
            c.moveTo(0, 0);
            c.lineTo(0, L);
        } else if (type === SEGMENT_TYPE_TO_POINT) {
            c.strokeStyle = THREAD_INSERTING_COLOR;
            this._add_round_path(0, 0, 0, L, length);
        } else if (type === SEGMENT_TYPE_TO_AIR_IN) {
            c.strokeStyle = THREAD_INSERTING_COLOR;

            if (out_length === 1) {
                this._add_round_path(0, 0, 0, length / 2, length);
            }
        }

        c.stroke();
        c.restore();
    }

    _add_round_path(x1, y1, x2, y2, len) {
        let c = this.ctx;

        let dx = x2 - x1;
        let dy = y2 - y1;
        let d = Math.sqrt(dx * dx + dy * dy);

        let l = Math.PI * d / 2;

        if (len > l) {
            let skip = (len - l) / 2;
            let vx = -dy / d * skip;
            let vy = dx / d * skip;

            c.moveTo(x1, y1);
            c.lineTo(x1 + vx, y1 + vy);
            this._add_arc_path(x1 + vx, y1 + vy, x2 + vx, y2 + vy, l);
            c.lineTo(x2, y2);
        } else
            this._add_arc_path(x1, y1, x2, y2, len);

        c.stroke();
    }

    _add_arc_path(x1, y1, x2, y2, len) {
        // sin(len / 2r) = d / 2r
        // len >= d
        // r = d/2: (>=)                              sin(len / d) <= 1
        // s = 1/r             s from 0 (>) to 2/d (<)

        let dx = x2 - x1;
        let dy = y2 - y1;
        let d = Math.sqrt(dx * dx + dy * dy);

        let s_left = 0;         // sin >
        let s_right = 2 / d;    // sin <

        for (let steps = 0; steps < 20; steps++) {
            let s0 = (s_left + s_right) / 2;
            let lhs = Math.sin(len / 2 * s0);
            let rhs = d / 2 * s0;

            if (lhs < rhs)
                s_right = s0;
            else
                s_left = s0;
        }

        let s0 = (s_left + s_right) / 2;
        if (Math.abs(s0) < 1e-5) { //if s0 is zero
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            return;
        }

        let r = 1 / s0;
        let v = Math.cos(len / (2 * r)) * r;
        let vx = dy / d * v;
        let vy = -dx / d * v;
        let x0 =  (x1 + x2) / 2 + vx;
        let y0 =  (y1 + y2) / 2 + vy;

        let startAngle = Math.atan2(y1 - y0, x1 - x0);
        let endAngle = Math.atan2(y2 - y0, x2 - x0);

        this.ctx.arc(x0, y0, r, startAngle, endAngle, true);
    }
}

const N = 10; // длина нити
const L = 20; // длина единичного сегмента нити в пикселях
const TIME_FOR_ONE_STEP = 1; // время в секундах на один шаг
const X0 = 100; // позиция начала нити.
const Y0 = 100;

const THREAD_THICKNESS = 2;
const THREAD_INSERTED_COLOR = '#00AA00';
const THREAD_INSERTING_COLOR = '#0000CC';

const SEGMENT_TYPE_NO = 0;
const SEGMENT_TYPE_INSERTED = 1;
const SEGMENT_TYPE_TO_POINT = 2;
const SEGMENT_TYPE_TO_AIR_IN = 3;
const SEGMENT_TYPE_TO_AIR_OUT = 4;