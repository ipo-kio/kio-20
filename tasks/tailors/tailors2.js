import './tailors.scss'
import './slider.scss'
import { Solution } from './Classes/Solution.js'
import { Slider } from './Classes/slider.js'
//import { Process } from './Classes/Process.js'
import { DrawHelper } from './Classes/DrawHelper.js'
import { State } from './Classes/State.js'
import { Tailor } from './Classes/Tailor.js'
import { Global } from './Classes/Global.js'

var _thisProblem


export class Tailors
{
	_currentSolution
	_globalTik

	static _thisProblem

	/**
	 *
	 * @param settings Объект с настройками задачи. В данный момент, внутри объекта settings ожидается только поле level,
	 * которое может быть 0, 1 или 2.
	 */
	constructor (settings){
		this.settings = settings
	}

	/**
	 * Идентификатор задачи, используется сейчас только как ключ для
	 * хранения данных в localstorage
	 * @returns {string} идентификатор задачи
	 */
	id () {
		return 'tailors' + this.settings.level // TODO заменить task-id на реальный id задачи
	}

	initialize (domNode, kioapi, preferred_width) {
		this.kioapi = kioapi
		DrawHelper._kioapi = kioapi
		// TODO реализовать инициализацию
		this.initInterface(domNode, preferred_width)
	}

	static preloadManifest ()
	{
		return [
			{ id: 'slider_p', src: 'tailors-resources/slider_p.png' },
			{ id: 'background', src: 'tailors-resources/background.png' },
			{ id: 'tailor_minus', src: 'tailors-resources/tailor_minus.png' },
			{ id: 'tailor_plus', src: 'tailors-resources/tailor_plus.png' },
			{ id: 'tailor', src: 'tailors-resources/tailor.png' },
		] // TODO перечислить загружаемые ресурсы. Они находятся в каталоге taskid-resources
	}

	parameters () {
		return[];
	}

	solution (){
		return JSON.stringify(this._currentSolution)
	}

	loadSolution (solution){

	}

	initInterface (domNode, preferred_width) {
		console.log('initInterface()');
		_thisProblem = this

		let btn;
		let w = 500;
		let h = 400;

		let canvasContDiv = document.createElement('div')
		canvasContDiv.innerHTML = ''
		canvasContDiv.id = 'canvasContDiv'
		canvasContDiv.className = 'canvas_cont_div'
		canvasContDiv.style.width = w + 'px'
		canvasContDiv.style.height = h + 'px'
		domNode.appendChild(canvasContDiv);

		//-- canvas
		{
			this._canvasBottom = document.createElement('canvas')
			this._canvasBottom.width = w
			this._canvasBottom.height = h
			this._canvasBottom.className = 'canvas_bottom'
			canvasContDiv.appendChild(this._canvasBottom)

			this._canvasTop = document.createElement('canvas')
			this._canvasTop.width = w
			this._canvasTop.height = h
			this._canvasTop.className = 'canvas_top'
			canvasContDiv.appendChild(this._canvasTop)
		}

		let controlDiv = document.createElement('div')
		controlDiv.innerHTML = ''
		controlDiv.id = 'control_div'
		controlDiv.className = 'control_div'
		domNode.appendChild(controlDiv)

		//-- slider
		{
			btn = document.createElement('button')
			btn.innerHTML = '&#8722;'; //'&#8678;'
			btn.id = 'go_btn_plus'
			btn.title = 'Шаг назад'
			btn.className = 'go_btn1'
			btn.style.marginLeft = '20px'
			btn.addEventListener('click', function (evt) {
			_thisProblem.goStepPlus(false)
			})
			controlDiv.appendChild(btn)

			btn = document.createElement('button')
			btn.innerHTML = '&#43;';//'&#8680;'
			btn.id = 'go_btn_plus'
			btn.title = 'Шаг вперед'
			btn.className = 'go_btn1'
			btn.addEventListener('click', function (evt) {
			_thisProblem.goStepPlus(true)
			})
			controlDiv.appendChild(btn)

			this._slider = new Slider(
				controlDiv,
				0,
				100,
				45,
				this.kioapi.getResource('slider_p'),
				this.kioapi.getResource('slider_p')
			)

			this._slider.domNode.className = 'hexagons-slider'
			this._slider.resize(preferred_width - 16)
			this._slider.max_value = 100
			controlDiv.appendChild(this._slider.domNode)
		}

		//-- подготовка stage

		let img
		let btnShape

		DrawHelper._stageBottom = new createjs.Stage(this._canvasBottom)
		//DrawHelper._stageBottom.enableMouseOver()


		DrawHelper._stageTop = new createjs.Stage(this._canvasTop)
		DrawHelper._stageTop.enableMouseOver()

		DrawHelper._stageTop.nextStage = this._stageBottom


		// -- Подкладка под карту
		{
			/*
			let backGroundShape = new createjs.Shape()
			backGroundShape.graphics.beginFill(DrawHelper.BGCOLOR_KARTA)

			img = this.kioapi.getResource('background');
			backGroundShape.graphics.beginBitmapFill(img, "repeat");

			backGroundShape.graphics.drawRect(10,10,100,100)
			//backGroundShape.graphics.endFill()

			DrawHelper._stageBottom.addChild(backGroundShape)
			*/
		}




		//-- кнопки Добавить-Удалить тейлора
		{
			img = this.kioapi.getResource('tailor_minus');
			btnShape = new createjs.Shape()
			btnShape.name = 'buttonMinus'
			btnShape.x = 10
			btnShape.y = 20
			btnShape.graphics.beginBitmapFill(img, "no-repeat");
			btnShape.graphics.drawRect(0, 0, 20, 20)
			btnShape.graphics.endFill()
			btnShape.on('click', function (event) {
				Global.tailorMinus()
			})
			DrawHelper._stageTop.addChild(btnShape)

			img = this.kioapi.getResource('tailor_plus');
			btnShape = new createjs.Shape()
			btnShape.name = 'buttonPlus'
			btnShape.x = 40
			btnShape.y = 20
			btnShape.graphics.beginBitmapFill(img, "no-repeat");
			btnShape.graphics.drawRect(0, 0, 20, 20)
			btnShape.graphics.endFill()
			btnShape.on('click', function (event) {
				Global.tailorPlus()
			})
			DrawHelper._stageTop.addChild(btnShape)


		}




		DrawHelper.resetAll()
	}

	goStepPlus (plusminus) {
		let tik = this._slider.value

		if (plusminus) {
			tik++
		  } else {
			tik--
		}

		if (tik < 0)
		{
			tik = 0
			this.goToStart()
			return
		}

		this._globalTik = tik

		State._tik = tik



		DrawHelper.drawTik();


	}

	goToStart(){

	}
}

function log(s){
	console.log(s);
}