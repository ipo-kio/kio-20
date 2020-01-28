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

            requestAnimationFrame(frame);
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
        while (time >= steps && i < N) {
            segment_length[i] = 1;
            segment_type[i] = SEGMENT_TYPE_INSERTED;
            time -= steps;
            i++;
            steps -= 1;
        }

        // first,              segment_length[i] = N - i;  segment_type[i] = TO_AIR
        //                     segment_length[i + 1] = 0;  segment_type[i + 1] = NO

        //after 1 step:        segment_length[i] = N - i;  segment_type[i] = TO_POINT
        //                     segment_length[i + 1] = 0;  segment_type[i + 1] = TO_AIR

        //next steps-1 steps:  segment_length[i] = N - i - x;  segment_type[i] = TO_POINT
        //x = 0..N-i-1         segment_length[i + 1] = x;  segment_type[i + 1] = TO_AIR

        if (time < 1) {
            segment_type[i] = SEGMENT_TYPE_TO_AIR;
            segment_length[i] = N - i;
        } else {
            let x = time - 1;
            segment_type[i] = SEGMENT_TYPE_TO_POINT;
            segment_length[i] = N - i - x;
            segment_type[i + 1] = SEGMENT_TYPE_TO_AIR;
            segment_length[i + 1] = x;
        }

        // console.log(time, segment_length.join(' : '), segment_type.join(' # '));

        let c = this.ctx;
        c.lineWidth = THREAD_THICKNESS;
        for (let s = 0; s < segment_type.length; s++) {
            c.save();
            c.translate(X0, Y0 + s * L);

            // if (s % 2 === 0)
            //     c.scale(-1, 0);
            this._draw_segment(segment_length[s], segment_type[s]);

            c.restore();
        }
    }

    _draw_segment(length, type) {
        let c = this.ctx;
        c.save();

        if (type === SEGMENT_TYPE_INSERTED) {
            c.strokeStyle = THREAD_INSERTED_COLOR;
            c.moveTo(0, 0);
            c.lineTo(0, L);
            c.stroke();
        }

        c.restore();
    }
}

const N = 10; // длина нити
const L = 10; // длина единичного сегмента нити в пикселях
const TIME_FOR_ONE_STEP = 1; // время в секундах на один шаг
const X0 = 100; // позиция начала нити.
const Y0 = 100;

const THREAD_THICKNESS = 2;
const THREAD_INSERTED_COLOR = '#00AA00';
const THREAD_INSERTING_COLOR = '#0000CC';

const SEGMENT_TYPE_NO = 0;
const SEGMENT_TYPE_INSERTED = 1;
const SEGMENT_TYPE_TO_POINT = 2;
const SEGMENT_TYPE_TO_AIR = 3;