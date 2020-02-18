import './datacenters.scss'
import {InterfaceHelper} from './Classes/InterfaceHelper.js'
import {Solution} from './Classes/Solution.js'
import {Global} from './Classes/Global'
import {Helper} from './Classes/Helper'
import {Process} from './Classes/Process'
import {Config} from './Classes/Config'
import {MercatorProjector} from "./Classes/MercatorProjector";

var _thisProblem = null

export class Datacenters {
    static _currentSolution
    static kioapi
    static _level

    constructor(settings) {
        this.settings = settings

        Datacenters._currentSolution = new Solution()
        Datacenters._currentSolution._level = settings.level
        Datacenters._level = settings.level
    }

    id() {
        return 'datacenters' + this.settings.level
    }

    initialize(domNode, kioapi, preferred_width) {
        //if(_thisProblem != null) return
        Datacenters.kioapi = kioapi
        // TODO реализовать инициализацию
        log('initialize')
        //log(kioapi)
        // this.initInterface(domNode, preferred_width)

        this.initMercatorExampleInterface(domNode);

    }

    static preloadManifest() {
        return [
            {id: 'bg', src: 'datacenters-resources/bg.jpg'},
        ] // TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
    }

    parameters() {
        let _dcSelectedCount = {
            name: '_dcSelectedCount',
            title: 'Количество:',
            ordering: 'minimize'
        }

        let _len = {
            name: '_len',
            title: 'Расстояние:',
            ordering: 'minimize'
        }

        let _dcBadCount = {
            name: '_dcBadCount',
            title: 'Пропущено:',
            ordering: 'minimize'
        }


        return [_dcSelectedCount, _len, _dcBadCount];
    }

    solution() {
        log('solution()')
        return JSON.stringify(Datacenters._currentSolution)
    }

    loadSolution(solution) {
        console.log('loadSolution()... ');
        console.log(solution);

        let sol, i, name


        if (solution !== undefined) {
            log('loadSolution()... solution OK  Global._dcDic.len=' + Helper.dicLen(Global._dcDic))

            Datacenters._currentSolution = JSON.parse(solution)

            log('loadSolution()... _dcSelectedArr len=' + Datacenters._currentSolution._dcSelectedArr.length)

            for (name in Global._dcDic) {
                Global._dcDic[name]._selected = false
            }

            for (i = 0; i < Datacenters._currentSolution._dcSelectedArr.length; i++) {
                name = Datacenters._currentSolution._dcSelectedArr[i]

                //log('name=' + name)

                if (Helper.hasKey(Global._dcDic, name)) {
                    Global._dcDic[name]._selected = true
                } else {
                    //log('nnn')
                }
            }

        } else {
            //Datacenters._currentSolution = new Solution()
            //Datacenters._currentSolution._level = settings.level
        }


        //Datacenters.saveCurrentSolution();


        Process.calcResult()

        //Global._stageTop.update();

    }

    initInterface(domNode, preferred_width) {
        console.log('initInterface')
        _thisProblem = this

        Config.setLevelData(Datacenters._level)

        InterfaceHelper.create(domNode, preferred_width)

        InterfaceHelper.prepareAll();
    }

    static saveCurrentSolution() {
        log('saveCurrentSolution ()')

        Datacenters.kioapi.submitResult({
            _dcSelectedCount: Datacenters._currentSolution._dcSelectedCount,
            _len: Datacenters._currentSolution._len,
            _dcBadCount: Datacenters._currentSolution._dcBadCount,
            _dcSelectedArr: Global.getDcSelectedArr(),
        })
    }

    initMercatorExampleInterface(domNode) {
        let canvas = document.createElement('canvas');
        canvas.width = 640;
        canvas.height = 480;
        domNode.appendChild(canvas);
        let ctx = canvas.getContext('2d');

        let m = new MercatorProjector(0, 640, 0);

        //grid
        ctx.strokeStyle = 'grey';
        for (let lat = -80; lat <= 80; lat += 10) {
            ctx.beginPath();
            for (let long = -180; long <= 180; long += 45) {
                let [x, y] = m.sphere2euclid([lat, long]);
                if (long === -180)
                    ctx.moveTo(x, y);
                else
                    ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        for (let long = -180; long <= 180; long += 5) {
            ctx.beginPath();
            for (let lat = -80; lat <= 80; lat += 10) {
                let [x, y] = m.sphere2euclid([lat, long]);
                if (lat === -80)
                    ctx.moveTo(x, y);
                else
                    ctx.lineTo(x, y);
            }
            ctx.stroke();
        }

        //diagonal

        ctx.beginPath();
        ctx.strokeStyle = 'blue';
        for (let i = 0; i < 10; i++) {
            let lat = -60 + i * 10;
            let long = -100 + i * 20;
            let [x, y] = m.sphere2euclid([lat, long]);
            if (lat === -80)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);
        }
        ctx.stroke();

        //circles
		ctx.strokeStyle = 'red';
        for (let lat = 80; lat >= -80; lat -= 10) {
            ctx.beginPath();
            m.draw_path(ctx, [lat, -180], [lat, 180]);
            ctx.stroke();
        }
    }
}

function log(s) {
    console.log(s);
}