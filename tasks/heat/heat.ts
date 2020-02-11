import './heat.scss'; //TODO заменить имя файла со стилями
import {KioApi, KioTaskSettings} from "../KioApi";
import BlocksRegistry from "./ui/BlocksRegistry";

export class Heat { //TODO название класса должно совпадать с id задачи, но с заглавной буквы
    private settings: KioTaskSettings;
    private kioapi: KioApi;

    private canvas: HTMLCanvasElement;
    private scene: createjs.Stage;
    private blocksRegistry: BlocksRegistry;

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings: KioTaskSettings) {
        this.settings = settings;

        //TODO здесь можно совершить инициализацию, которая не зависит от положения в DOM и kioapi
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'heat' + this.settings.level; //TODO заменить task-id на реальный id задачи
    }

    /**
     *
     * @param domNode
     * @param kioapi
     * @param preferred_width
     */
    initialize(domNode: HTMLElement, kioapi: KioApi, preferred_width: number) {
        this.kioapi = kioapi;

        this.canvas = document.createElement('canvas');
        this.canvas.width = 900;
        this.canvas.height = 600;

        this.scene = new createjs.Stage(this.canvas);
        this.blocksRegistry = new BlocksRegistry(kioapi, {
            "glass": 5,
            "air": 5,
            "aluminium": 5,
            "sand": 5,
            "tree": 16
        });
    }

    /*
    static preloadManifest() {
        return [
            // {id: "pic1", src: "heat-resources/pic1.png"},
            // {id: "pic2", src: "heat-resources/pic2.png"}
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге heat-resources
    }
    */

    parameters() {
        return [
            {name: 'num', title: 'num'}
        ];
    }

    loadSolution(solution: string) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        //TODO загрузить объект с решением участника.
    }

    solution() {
        return "";
        //TODO вернуть объект с описанием решения участника
    }
}