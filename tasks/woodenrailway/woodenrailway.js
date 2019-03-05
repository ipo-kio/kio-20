import './woodenrailway.scss';
import {go_railways} from "./lib/kiorailways";

export class Woodenrailway {

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings) {
        this.settings = settings;
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'woodenrailway' + this.settings.level;
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
        canvas.width = 800;
        canvas.height = 500;
        domNode.append(canvas);

        this.ver = go_railways(canvas.width, canvas.height, canvas);

        let loop = () => {
            this.ver.frame(16);
            this.ver.draw();
            requestAnimationFrame(loop);
        };

        loop();
    }

    parameters() {
        return [
            //TODO добавить список параметров
        ];
    }

    solution() {
        return this.ver.composites[0].serialize();
    }

    loadSolution(solution) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        this.ver.composites[0].deserialize(solution);
    }
}