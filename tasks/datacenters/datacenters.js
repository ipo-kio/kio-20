import './datacenters.scss'
import { InterfaceHelper } from './Classes/InterfaceHelper.js'
import { Solution } from './Classes/Solution.js'
import { Global } from './Classes/Global'
import { Helper } from './Classes/Helper'
import { Process } from './Classes/Process'
import { Config } from './Classes/Config'
import { LOCALIZATION } from "./localization";

var _thisProblem = null

export class Datacenters
{
	static _currentSolution
	static kioapi
	static _level

    static LOCALIZATION = LOCALIZATION

	constructor (settings){
		this.settings = settings

		Datacenters._currentSolution = new Solution()
		Datacenters._currentSolution._level = settings.level
		Datacenters._level = settings.level
	}

	id () {
		return 'datacenters' + this.settings.level
	}

	initialize (domNode, kioapi, preferred_width)
	{
		//if(_thisProblem != null) return
		Datacenters.kioapi = kioapi
		// TODO реализовать инициализацию
		log('initialize')
		//log(kioapi)
		this.initInterface(domNode, preferred_width)
	}

	static preloadManifest ()
	{
		return [
			{ id: 'bg', src: 'datacenters-resources/karta-fon-all.jpg' },
			{ id: 'dc_sel', src: 'datacenters-resources/dom1.png' },
			{ id: 'dc_red', src: 'datacenters-resources/dom2.png' },
			{ id: 'dc_green', src: 'datacenters-resources/dom3.png' },
		] // TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
	}

	parameters ()
	{
		/*
		1.Количество пропущенных вершин (надо как можно меньше)
		2.Количество вершин, рядом с которыми 2 датацентра (надо как можно больше, только второй уровень)
		3.суммарная длина расстояний от вершин до датацентров. Для каждой вершины, рядом с которой есть датацентры,
		выбирается ровно один ближайший, и расстояние скаладывается до него (надо как можно больше)
		*/

        if (!this.message)
            this.message = s => s;

		let _dcBadCount = {
			name: '_dcBadCount',
			title: this.message('Пропущено:'),
			ordering: 'minimize'
		}

		let _dcPoints2 = {
			name: '_dcPoints2',
			title: this.message('Дублированные:'),
			ordering: 'maximize'
		}

		let _dcSelectedCount = {
			name: '_dcSelectedCount',
			title: this.message('Количество:'),
			ordering: 'minimize'
		}

		let _len = {
			name: '_len',
			title: this.message('Расстояние:'),
			ordering: 'minimize'
		}


		if(Datacenters._level == 2){
			return[_dcBadCount, _dcSelectedCount, _dcPoints2, _len];
		}
		else{
			return[_dcBadCount, _dcSelectedCount,  _len];
		}



	}

	solution (){
		log('solution()')
		return JSON.stringify(Datacenters._currentSolution)
	}

	loadSolution (solution)
	{
		console.log('loadSolution()... ');
		console.log(solution);

		let sol, i, name


		if (solution !== undefined)
		{
			log('loadSolution()... solution OK  Global._dcDic.len=' + Helper.dicLen(Global._dcDic))

			Datacenters._currentSolution = JSON.parse(solution)

			log('loadSolution()... _dcSelectedArr len=' + Datacenters._currentSolution._dcSelectedArr.length)

			for (name in Global._dcDic)
			{
				Global._dcDic[name]._selected = false
			}

			for(i=0; i< Datacenters._currentSolution._dcSelectedArr.length; i++)
			{
				name = Datacenters._currentSolution._dcSelectedArr[i]

				//log('name=' + name)

				if(Helper.hasKey(Global._dcDic, name)){
					Global._dcDic[name]._selected = true
				}
				else{
					//log('nnn')
				}
			}

		}
		else{
			//Datacenters._currentSolution = new Solution()
			//Datacenters._currentSolution._level = settings.level
		}


		//Datacenters.saveCurrentSolution();



		Process.calcResult()

		//Global._stageTop.update();

	}

	initInterface (domNode, preferred_width)
	{
		console.log('initInterface')
		_thisProblem = this

		Config.setLevelData(Datacenters._level)

		InterfaceHelper.create(domNode, preferred_width)

		InterfaceHelper.prepareAll();
	}

	static saveCurrentSolution ()
	{
		log('saveCurrentSolution ()')

		Datacenters.kioapi.submitResult({
		  _dcSelectedCount: Datacenters._currentSolution._dcSelectedCount,
		  _dcPoints2: Datacenters._currentSolution._dcPoints2,
		  _len: Datacenters._currentSolution._len,
		  _dcBadCount: Datacenters._currentSolution._dcBadCount,
		  _dcSelectedArr: Global.getDcSelectedArr(),
		})
	}
}

function log(s){
	console.log(s);
}
