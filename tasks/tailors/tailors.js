import './tailors.scss'
import './slider.scss'
import { Slider } from './Classes/slider.js'
import { Global } from './Classes/Global.js'
import { Solution } from './Classes/Solution.js'
import { SettingsHelper } from './Classes/SettingsHelper.js'
import { InterfaceHelper } from './Classes/InterfaceHelper.js'
import { TailorHelper } from './Classes/TailorHelper'

var _thisProblem = null

export class Tailors
{
	static _stageDiv
	static _tailorsDiv
	static kioapi = null
	static _levelSettings
	static _slider

	static _currentSolution

		/**
	 *
	 * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
	 * которое может быть 0, 1 или 2.
	 *
	 * level
	 */
	constructor (settings){
		this.settings = settings

		//log(settings)

		Tailors._currentSolution = new Solution()
		Tailors._currentSolution._level = settings.level

		SettingsHelper.setSettings(this.settings)

		Tailors._levelSettings = this.settings.levels[settings.level]

		document.addEventListener('keydown', function(event) {
			if(event.code == 'Delete')
			{
				Global.tailorMinus()
			}
		});
	}

	/**
	 * Идентификатор задачи, используется сейчас только как ключ для
	 * хранения данных в localstorage
	 * @returns {string} идентификатор задачи
	 */
	id () {
		return 'tailors' + this.settings.level // TODO заменить task-id на реальный id задачи
	}

	initialize (domNode, kioapi, preferred_width)
	{
		//if(_thisProblem != null) return
		Tailors.kioapi = kioapi
		// TODO реализовать инициализацию
		log('initialize')
		//log(kioapi)
		this.initInterface(domNode, preferred_width)
	}

	static preloadManifest ()
	{
		return [
			{ id: 'slider_p', src: 'tailors-resources/slider_p.png' },
			{ id: 'princess', src: 'tailors-resources/princess.png' },
			{ id: 'princess_2', src: 'tailors-resources/princess_2.png' },
			{ id: 'tailor_minus', src: 'tailors-resources/tailor_minus.png' },
			{ id: 'tailor_plus', src: 'tailors-resources/tailor_plus.png' },
			{ id: 'tailor_w', src: 'tailors-resources/tailor_w.png' },
			{ id: 'tailor_r', src: 'tailors-resources/tailor_r.png' },
			{ id: 'tailor_1', src: 'tailors-resources/tailor_1.png' },
			{ id: 'tailor_2', src: 'tailors-resources/tailor_2.png' },
			{ id: 'tailor_m1', src: 'tailors-resources/tailor_m1.png' },
			{ id: 'tailor_m2', src: 'tailors-resources/tailor_m2.png' },
		] // TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
	}

	parameters () {

		let _totalLenResult = {
			name: '_totalLenResult',
			title: 'Общая длинна:',
			ordering: 'maximize'
		}

		let _totalReloads = {
			name: '_totalReloads',
			title: 'Количество перевдеваний:',
			ordering: 'minimize'
		}

		let _tailorsCount = {
			name: '_tailorsCount',
			title: 'Количество портных:',
			ordering: 'minimize'
		}

		if(Tailors._currentSolution._level != 2)
		{
			return[_totalLenResult, _tailorsCount];
		}
		else{
			return[_totalLenResult, _totalReloads, _tailorsCount];
		}


	}

	solution (){
		log('solution()')
		return JSON.stringify(Tailors._currentSolution)
	}

	loadSolution (solution){
		// Все объекты, которые сюда передаются, были ранее возвращены методом solution,
		// но проверять их все равно необходимо.
		// TODO загрузить объект с решением участника.

		 console.log('loadSolution()... ');

		 Global._tailorsArr = []
		 Global._currentTik = 0
		 document.getElementById('tailors_div').innerHTML = ''

		 Global.tailorControlHide()

		let loadOK = false
		let sol, i

		if (solution !== undefined)
		{
			sol = JSON.parse(solution)
			loadOK = true
		}

		if (loadOK && sol != null && sol._tailorsArr.length > 0)
		{
			//log('loadSolution  loadOK sol._tailorsArr.length=' + sol._tailorsArr.length)

			//Tailors._currentSolution = sol
			let tailor


			for(i=0; i < sol._tailorsArr.length; i++)
			{
				tailor = Global.createTailor()
				tailor._maxLen = sol._tailorsArr[i]._maxLen
				document.getElementById('tailor_maxlen_' + tailor._id).innerHTML = tailor._maxLen

			}

			//Global.createResult()
			TailorHelper.redrawTailors()
			Global.goToStart()
			//InterfaceHelper.drawCurrentTik()
		}
		else
		{
			//Global.tailorPlus()
			this.start()
		}



	}

	initInterface (domNode, preferred_width)
	{
		console.log('initInterface')
		_thisProblem = this

		InterfaceHelper.create(domNode, preferred_width)

		//this.start()
	}

	static saveCurrentSolution ()
	{
		Tailors.kioapi.submitResult({
		  _tailorsCount: Tailors._currentSolution._tailorsCount,
		  _totalLenResult: Tailors._currentSolution._totalLenResult,
		  _totalReloads: Tailors._currentSolution._totalReloads
		})
	}

	start()
	{
		Global.tailorPlus()

		//Tailors.saveCurrentSolution()
	}
}

function log(s){
	console.log(s);
}