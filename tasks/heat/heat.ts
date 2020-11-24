import './heat.scss'; //TODO заменить имя файла со стилями
import {KioApi, KioResourceDescription, KioTaskSettings} from "../KioApi";
import BlocksRegistry from "./ui/BlocksRegistry";
import Legend from "./ui/Legend";
import {HEAT_POSITION_DEFAULT_VALUE} from "./solver/Solver";
import Stage = createjs.Stage;
import { LOCALIZATION } from './localization';

export class Heat { //TODO название класса должно совпадать с id задачи, но с заглавной буквы

    static LOCALIZATION = LOCALIZATION;

    private settings: KioTaskSettings;
    private kioapi: KioApi;

    private canvas: HTMLCanvasElement;
    private blocksRegistry: BlocksRegistry;

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings: KioTaskSettings) {
        this.settings = settings;
    }

    /**
     * Идентификатор задачи, используется сейчас только как ключ для
     * хранения данных в localstorage
     * @returns {string} идентификатор задачи
     */
    id() {
        return 'heat' + this.settings.level;
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
        this.canvas.height = 610;

        let stage: Stage = new Stage(this.canvas);

        stage.enableMouseOver();
        this.blocksRegistry = new BlocksRegistry(kioapi, +this.settings.level, {
            "aluminium": 5,
            "sand": 5,
            "air": 7,
            "glass": 7,
            "tree": 12
        });
        stage.addChild(this.blocksRegistry);
        let legend = new Legend(kioapi);
        stage.addChild(legend);
        legend.x = 20;
        legend.y = 490;

        createjs.Ticker.addEventListener('tick', stage);

        domNode.appendChild(this.canvas);
        domNode.classList.add('heat-task-container');
    }

    static preloadManifest(): KioResourceDescription[] {
        return [
            {id: "air", src: "heat-resources/air.jpg"},
            {id: "aluminium", src: "heat-resources/aluminium.jpg"},
            {id: "glass", src: "heat-resources/glass.jpg"},
            {id: "sand", src: "heat-resources/sand.jpg"},
            {id: "tree", src: "heat-resources/tree.jpg"}
        ]; //TODO перечислить загружаемые ресурсы. Они находятся в каталоге heat-resources
    }

    message(msg: string): string {
        return '--';
    }

    parameters() {
        if (!this.message)
            this.message = s => s;

        return [
            {
                name: 'e',
                title: this.message('Вычисление'),
                view: (v: number) => {
                    if (v == 0)
                        return "...";
                    return this.message("вычислено");
                },
                ordering: 'maximize'
            },
            {
                name: 'p',
                title: this.message('Процент нагретого'),
                ordering: 'maximize',
                view(v: number) {
                    if (v == -1)
                        return "?";
                    return v.toString()
                }
            },
            {
                name: 't',
                title: this.message('Время'),
                ordering: 'minimize',
                view(v: number) {
                    if (v == HEAT_POSITION_DEFAULT_VALUE)
                        return "?";
                    return v.toString()
                }
            }
        ];
    }

    /*loadSolution(solution: string) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        this.blocksRegistry.bodyUI.deserialize = solution;
    }

    solution() {
        let solution = this.blocksRegistry.bodyUI.serialize;
        return solution;
    }*/

    loadSolution(solution: any) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.

        if (solution.f) {
            this.blocksRegistry.bodyUI.deserialize = solution.f;
            this.kioapi.submitResult({
                e: solution.e,
                p: solution.p,
                t: solution.t
            });
        } else
            this.blocksRegistry.bodyUI.deserialize = solution;
    }

    solution(): Solution {
        let field = this.blocksRegistry.bodyUI.serialize;
        let process = this.blocksRegistry.bodyUI.process;
        return {
            f: field,
            e: process.heat_position == -1 ? 0 : 1,
            p: process.heat_percent,
            t: process.heat_position
        };
    }
}

interface Solution {
    f: string,
    e: number,
    p: number,
    t: number
}
