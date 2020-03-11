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
		Tailors._currentLevel = settings.level

		SettingsHelper.setSettings(this.settings)

		Tailors._levelSettings = this.settings.levels[settings.level]
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

		document.addEventListener('keydown', function(event) {
			if(event.code == 'Delete')
			{
				Global.tailorMinus()
			}
		});
	}

	static preloadManifest ()
	{
		return [
			{ id: 'slider_p', src: 'tailors-resources/slider_p.png' },
			{ id: 'princess', src: 'tailors-resources/princess_01_r.png' },
			{ id: 'princess_2', src: 'tailors-resources/princess_02_move.png' },
			{ id: 'princess_3', src: 'tailors-resources/princess_03_move.png' },
			{ id: 'tailor_minus', src: 'tailors-resources/tailor_minus.png' },
			{ id: 'tailor_plus', src: 'tailors-resources/tailor_plus.png' },
			{ id: 'tailor_w', src: 'tailors-resources/taior_01_w.png' },
			{ id: 'tailor_r0', src: 'tailors-resources/taior_03_r.png' },
			{ id: 'tailor_r1', src: 'tailors-resources/taior_04_r.png' },
			{ id: 'tailor_r2', src: 'tailors-resources/taior_05_r.png' },
			{ id: 'tailor_r3', src: 'tailors-resources/taior_06_r.png' },
			{ id: 'tailor_r4', src: 'tailors-resources/taior_07_r.png' },
			{ id: 'tailor_1', src: 'tailors-resources/taior_26_plus.png' },
			{ id: 'tailor_m1', src: 'tailors-resources/taior_09_m.png' },

			{ id: 'tailor_m1-0', src: 'tailors-resources/Taior_11.png' },
			{ id: 'tailor_m1-1', src: 'tailors-resources/Taior_11.png' },
			{ id: 'tailor_m1-2', src: 'tailors-resources/Taior_13.png' },
			{ id: 'tailor_m1-3', src: 'tailors-resources/Taior_15.png' },
			{ id: 'tailor_m1-4', src: 'tailors-resources/Taior_17.png' },
			{ id: 'tailor_m1-5', src: 'tailors-resources/Taior_19.png' },
			{ id: 'tailor_m1-6', src: 'tailors-resources/Taior_21.png' },
			{ id: 'tailor_m1-7', src: 'tailors-resources/Taior_23.png' },
			{ id: 'tailor_m1-8', src: 'tailors-resources/Taior_24.png' },
			{ id: 'tailor_m1-9', src: 'tailors-resources/taior_25_m.png' },
			{ id: 'tailor_m1-10', src: 'tailors-resources/taior_26_plus.png' },

			{ id: 'tailor_m2', src: 'tailors-resources/taior_25_m.png' },
			{ id: 'bg', src: 'tailors-resources/background.png' },
		] // TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
	}

	parameters () {

		let _totalLenResult = {
			name: '_totalLenResult',
			title: 'Общая длина:',
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

		let _waitCount = {
			name: '_waitCount',
			title: 'Количество ожиданий:',
			ordering: 'minimize'
		}

		if(Tailors._currentLevel == 1)
		{
			return[_totalLenResult, _totalReloads, _tailorsCount];
		}
		else if(Tailors._currentLevel == 2)
		{
			return[_totalLenResult, _totalReloads, _tailorsCount, _waitCount];
		}
		else{
			return[_totalLenResult, _tailorsCount];
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
			Global.goToEnd()
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
		  _totalReloads: Tailors._currentSolution._totalReloads,
		  _waitCount: Tailors._currentSolution._waitCount
		})
	}

	start()
	{
		Global.tailorPlus()
		//Global.goToStart()
		Global.goToStart()
		Global.goToEnd()

		//Tailors.saveCurrentSolution()
	}
}

function log(s){
	console.log(s);
}