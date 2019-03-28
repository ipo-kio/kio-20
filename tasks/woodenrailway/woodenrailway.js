import './woodenrailway.scss';
import {PinConstraint, VerletJS} from "./lib/verlet";
import Vec2 from "./lib/vec2";
import {Connection, RailwayBlock} from "./lib/railways";
import {RoundElement, SplitElement, StraightElement} from "./lib/elements";
import {City} from "./lib/city";

export class Woodenrailway {

    /**
     *
     * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
     * которое может быть 0, 1 или 2.
     */
    constructor(settings) {
        this.settings = settings;
        this.level = this.settings.level;

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

        let tools = this.create_tools_div();
        this.info = this.create_info_div();
        let canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 500;
        canvas.style.display = 'inline-block';
        domNode.append(tools);
        domNode.append(canvas);
        domNode.append(this.info);
        domNode.style.backgroundImage = 'url(' + kioapi.getResourceImageAsDataURL('bg-all', 'image/jpeg') + ')';

        this.ver = new VerletJS(canvas.width, canvas.height, canvas, this, ctx => {
            ctx.fillStyle = ctx.createPattern(this.kioapi.getResource('bg'), 'no-repeat');
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
        this.ver.gravity = new Vec2(0, 0);

        let block = new RailwayBlock(kioapi, this.create_cities());
        this.ver.composites.push(block);
        this.block = block;
        this.block.ver = this.ver;

        let loop = () => {
            let need_repeat = this.ver.frame(16);
            if (need_repeat && !this.ver.mouseDown) {
                for (let i = 0; i < 20; i++)
                    need_repeat = this.ver.frame(16);
            }

            this.ver.draw();
            requestAnimationFrame(loop);
        };

        loop();
    }

    create_cities() {

        let cities = [];

        let W = 800;
        let H = 500;
        let skip = 80;
        let x0 = 40;
        let y0 = 40;
        let r = 25;

        if (this.level === 0) {
            skip = 130;
            x0 = 60;
            y0 = 60;
            r = 30;
        }

        for (let x = x0; x < W; x += skip)
            for (let y = y0; y < H; y += skip)
                cities.push(new City(new Vec2(x, y), r));

        return cities;
    }

    parameters() {
        let ok = {
            name: 'ok',
            title: 'Дорога корректна',
            ordering: 'maximize',
            view: v => {
                if (v)
                    return 'да';
                else
                    return 'нет';
            }
        };
        let int = {
            name: 'intersections',
            title: 'Пересечений',
            ordering: 'minimize'
        };

        let st = {
            name: 'station',
            title: 'Станций соединено',
            ordering: 'maximize'
        };
        let num = {
            name: 'num',
            title: 'Количество элементов',
            ordering: 'minimize'
        };
        let leafs = {
            name: 'leafs',
            title: 'Тупиков',
            ordering: 'minimize'
        };
        let v = {
            name: 'v',
            title: 'Развилок',
            ordering: 'maximize'
        };

        /*
        - станций соединено
        - количество тупиков (минимизируем) это количество висящих концов дороги без соединения
        - Количество элементов (минимизируем)
        - развилок (минимизируем) - это количество элементов с развилкой
         */
        switch (this.level) {
            case 0:
            case 1:
                return [ok, int, st, leafs, num, v];
        }

        return [ok, int, leafs, st,  num, v];
    }

    solution() {
        return this.ver.composites[0].serialize();
    }

    loadSolution(solution) {
        // Все объекты, которые сюда передаются, были ранее возвращены методом solution,
        // но проверять их все равно необходимо.
        this.ver.block().deserialize(solution);

        //first time constraints are not relaxed, and thus are not satisfied
        this.ver.frame(16);
        this.ver.frame(16);
        //frames submit solutions by themselves
    }

    static preloadManifest() {
        return [
            {id: "bg", src: "woodenrailway-resources/bg.png"},
            {id: "bg-all", src: "woodenrailway-resources/bg-all.jpg"},
            {id: "wood", src: "woodenrailway-resources/wood.png"},
            {id: "nail", src: "woodenrailway-resources/nail.png"},

            {id: "bt-arrow-123", src: "woodenrailway-resources/bt-arrow-123.png"},
            {id: "bt-nail-123", src: "woodenrailway-resources/bt-nail-123.png"},
            {id: "bt-s-123", src: "woodenrailway-resources/bt-s-123.png"},
            {id: "bt-r-123", src: "woodenrailway-resources/bt-r-123.png"},
            {id: "bt-v-123", src: "woodenrailway-resources/bt-v-123.png"},

            {id: "train1", src: "woodenrailway-resources/train1.png"}
        ];
    }

    create_tools_div() {
        let tools = document.createElement('div');
        tools.style.display = 'inline-block';
        tools.style.padding = '1em';
        tools.style.verticalAlign = 'top';
        tools.className = 'woodenrailway-tools';

        let all_tools = [];

        let kioapi = this.kioapi;

        function create_tool(img, action, type) {
            let tool = document.createElement('button');
            let img_url = kioapi.getResourceImageAsDataURL(img);
            tool.style.backgroundRepeat = 'no-repeat';
            tool.style.backgroundImage = 'url(' + img_url + ')';
            tool.style.display = 'block';
            tool.style.width = '60px';
            tool.style.height = '60px';
            tool.style.margin = '0.6em 0';
            tool.className = 'tool-no-select';
            tool._type = type;
            tool.addEventListener('click', e => {
                for (let t of all_tools)
                    if (t._type === type)
                        t.className = 'tool-no-select';
                tool.className = 'tool-select';

                action(e);
            });
            tools.append(tool);

            all_tools.push(tool);

            return tool;
        }

        create_tool('bt-arrow-123', e => {
            this.selected_tool_over = 'delete';
        }, 1);

        let nail_tool = create_tool('bt-nail-123', e => {
            this.selected_tool_over = 'nail';
        }, 1);

        nail_tool.style.marginBottom = '150px';

        create_tool('bt-s-123', e => {
            this.selected_tool_miss = 'straight';
        }, 2);

        create_tool('bt-r-123', e => {
            this.selected_tool_miss = 'round';
        }, 2);

        create_tool('bt-v-123', e => {
            this.selected_tool_miss = 'split';
        }, 2);

        this.selected_tool_over = 'delete';
        this.selected_tool_miss = 'straight';

        all_tools[0].className = 'tool-select';
        all_tools[2].className = 'tool-select';

        return tools;
    }

    create_info_div() {
        let info = document.createElement('div');
        info.className = 'woodenrailway-info';

        let hint = document.createElement('span');
        hint.innerText = 'Неустойчиво!';
        let loadButton = document.createElement('button');
        loadButton.innerText = 'Загрузить последнее устойчивое состояние';

        loadButton.addEventListener('click', e => {
            this.block.deserialize(this.ver.last_stable_solution);
        });

        info.append(hint);
        info.append(loadButton);

        return info;
    }
}