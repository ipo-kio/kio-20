import './conveyor.scss';
import {Experiments} from "./experiments";
import {Detail} from "./domain/detail";
import {Belt} from "./domain/belt";
import {Mouse} from "./mouse";

export class Conveyor {

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings) {
        this.level = settings.level;

        // console.log('--------');
        // // new Experiments(4, [1, 1, 2, 2]);
        // new Experiments([1, 1, 2, 3, 4, 5, 6, 7, 8, 9], true);
        // new Experiments([1, 1, 2, 3, 4, 5, 6, 7, 8, 9], false);
        //
        // new Experiments([1, 2, 1, 3, 1, 4, 1, 5, 1, 6], true);
        // new Experiments([1, 2, 1, 3, 1, 4, 1, 5, 1, 6], false);
        // new Experiments([1, 2, 1, 2, 1, 2, 1, 2, 1, 3], true);
        // new Experiments([1, 2, 1, 2, 1, 2, 1, 2, 1, 3], false);
        // new Experiments([1, 3, 3, 1, 2, 4, 1, 1], true);
        // new Experiments([1, 3, 3, 1, 2, 4, 1, 1], false);

        return;

        for (let i = 1; i <= 1; i++) {
            console.log('-----------------------------------');
            let rays = [1, 2, 3, 1, 2, 3, 1, 2];
            let t = 3;
            // for (let j = 0; j < 8; j++)
            //     rays.push(Math.floor(t * Math.random() + 1));

            let e1 = new Experiments(rays, false);
            let e2 = new Experiments(rays, true);

            console.log(e1.length, e2.length, rays);
        }
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'conveyor' + this.level;
    }

    /**
     *
     * @param domNode
     * @param kioapi
     * @param preferred_width
     */
    initialize(domNode, kioapi, preferred_width) {
        this.kioapi = kioapi;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 900;
        this.canvas.height = 620;
        this.ctx = this.canvas.getContext('2d');

        this.mouse = new Mouse();

        this.canvas.onmousemove = e => {
            let rect = this.canvas.getBoundingClientRect();
            this.mouse._x = e.clientX - rect.left;
            this.mouse._y = e.clientY - rect.top;
        };

        this.canvas.onmousedown = e => {
            for (let b of this.belts)
                b.mouse_click();
        };

        domNode.append(this.canvas);

        this.n = 10;
        this._init_belts();

        let current_time = new Date().getTime();

        let loop = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            requestAnimationFrame(loop);

            let now = new Date().getTime();
            let elapsed_time = now - current_time;
            current_time = now;

            for (let belt of this.belts) {
                belt.time += elapsed_time / 1000;
                belt.draw(this.ctx);
            }
        };

        loop();
    }

    _init_belts() {
        this.belts = new Array(this.n);
        let initial_rays = [1, 2, 3, 1, 1, 2, 1, 1, 1, 1];

        let program_change_handler = new_program => {
            for (let b of this.belts)
                b.program = new_program;
        };

        for (let i = 0; i < this.n; i++) {
            let belt = new Belt(initial_rays, 62, 96 + i * 156, this.mouse, this.kioapi, program_change_handler);
            belt.program = [1, 2, 3, 3, 2, 1, 1];

            let first_ray = initial_rays[0];
            initial_rays = initial_rays.slice(1);
            initial_rays.push(first_ray);

            this.belts[i] = belt;
        }
    }

    static preloadManifest() {
        return [
            {id: "belt", src: "conveyor-resources/belt.png"},
            // {id: "pic2", src: "taskid-resources/pic2.png"}
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге conveyor-resources
    }

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
}