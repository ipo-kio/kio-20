import './conveyor.scss';
import {Experiments} from "./experiments";
import {Detail} from "./detail";

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
        this.canvas.height = 600;
        this.ctx = this.canvas.getContext('2d');

        domNode.append(this.canvas);

        for (let i = 0; i < 10; i++) {
            let d = new Detail([1, 2, 3, 1, 1, 2, 1, 1, 1, 1]);
            d.x = 100;
            d.y = 50 + i * 120;
            d.rotation = 2 * Math.PI / d.n * i;
            d.draw(this.ctx);
        }
    }

    /*static preloadManifest() {
        return [
            // {id: "pic1", src: "taskid-resources/pic1.png"},
            // {id: "pic2", src: "taskid-resources/pic2.png"}
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге conveyor-resources
    }*/

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