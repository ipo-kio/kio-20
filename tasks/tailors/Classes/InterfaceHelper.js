import { Tailors } from "../tailors.js"
import { Tailor } from './Tailor.js'
import { Global } from './Global.js'
import { Slider } from './slider.js'
import { TailorHelper } from "./TailorHelper.js"
import { LogHelper } from "./LogHelper.js"
import { Tanimate } from "./Tanimate.js"

export class InterfaceHelper
{
	static _canvasBotHeight = 60
	static _tailorsLeft = 130

	static create(domNode, preferred_width)
	{
		log('InterfaceHelper.create()')
		log(domNode)

		let btn, div, div1, t, tbody, divR, canvas
		let cellTopLeft, cellTopRight, row, cell
		let superDiv, topDiv

		//-- Полный див
		{
			superDiv = document.createElement('div')
			superDiv.id = 'super_div'
			superDiv.className = 'super_div'
			superDiv.setAttribute('style', 'background-image: url("./tailors-resources/background.png");')
			domNode.appendChild(superDiv)

			topDiv = document.createElement('div')
			topDiv.id = 'top_div'
			topDiv.className = 'top_div'
			superDiv.appendChild(topDiv)

			t = document.createElement('table')
			t.className = 'top_table'
			t.id = 'top_table'
			topDiv.appendChild(t)

			tbody = document.createElement('tbody')
			tbody.id = 'top_table_body'
			t.appendChild(tbody)

			row = tbody.insertRow()
			row.className = 'top_table_body_row'
			row.id = 'top_table_body_row'

			cellTopLeft  = row.insertCell(0);
			cellTopLeft.className = 'cellTopLeft'

			/*
			cell  = row.insertCell(1);
			cell.className = ''

			cellTopRight  = row.insertCell(2);
			cellTopRight.className = 'cellTopRight'
			*/
			btn = document.createElement('button')
			btn.innerHTML = '&#10225;'
			btn.id = 'btn_log_show'
			btn.title = 'Показать протокол'
			btn.className = 'btn_log_show'
			btn.addEventListener('click', function (evt) {
				LogHelper.openWindow()
			})
			cellTopLeft.appendChild(btn)


			//-- tailor plus - minus
			{

				btn = document.createElement('button')
				btn.innerHTML = '&#43;'
				btn.id = 'btn_tailor_plus'
				btn.title = 'Добавить'
				btn.className = 'tailor_plusminus_btn'
				btn.addEventListener('click', function (evt) {
					Global.tailorPlus()
				})
				//Tailors._stageDiv.appendChild(btn)
				//div.appendChild(btn)
				cellTopLeft.appendChild(btn)
			}



			div = document.createElement('div')
			div.className = 'stage1_div'
			cellTopLeft.appendChild(div)

			div.onclick = function(){
				Global.stageDivClick()
			}



		}

		//-- stage div
		{
			Tailors._stageDiv = document.createElement('div')
			Tailors._stageDiv.innerHTML = ''
			Tailors._stageDiv.id = 'stage_div'
			Tailors._stageDiv.className = 'stage_div'
			div.appendChild(Tailors._stageDiv)

			Tailors._stageDiv.onclick = function(){
				Global.stageDivClick()
			}




			//-- _tailorsDiv
			{
				Tailors._tailorsDiv = document.createElement('div')
				Tailors._tailorsDiv.innerHTML = ''
				Tailors._tailorsDiv.id = 'tailors_div'
				Tailors._tailorsDiv.className = 'tailors_div'
				Tailors._stageDiv.appendChild(Tailors._tailorsDiv)
			}

			//-- Канвас для готовых стежков
			{
				div = document.createElement('div')
				div.innerHTML = ''
				div.id = 'canvas_bot_div'
				div.className = 'canvas_bot_div'
				Tailors._stageDiv.appendChild(div)

				div.onclick = function(){
					Global.stageDivClick()
				}

				canvas = document.createElement('canvas')
				canvas.width = 40
				canvas.height = 40
				canvas.className = 'canvas_bot'
				canvas.id = 'canvas_bot'
				div.appendChild(canvas)

				Global._canvasBotCtx = canvas.getContext('2d');
			}


			//-- принцесса
			{
				let princessDiv = document.createElement('div')
				princessDiv.innerHTML = ''
				princessDiv.id = 'princess_div'
				princessDiv.className = 'princess_div'
				Tailors._stageDiv.appendChild(princessDiv)

				Global._princessDiv = princessDiv;

				let canvasPrinc = document.createElement('canvas')
				canvasPrinc.width = 80
				canvasPrinc.height = 80
				canvasPrinc.className = 'canvas_princ'
				canvasPrinc.id = 'canvas_princ'
				princessDiv.appendChild(canvasPrinc)


				Global._princessCanvas = canvasPrinc
				Global._princessCtx = Global._princessCanvas.getContext('2d');

				let img1 = Tailors.kioapi.getResource('princess')
				Global._princessCtx.drawImage(img1, 2, 2, 80, 80);
			}

			//-- протокол
			{
				let logDiv = document.createElement('div')
				logDiv.innerHTML = ''
				logDiv.id = 'log_div'
				logDiv.className = 'log_div'
				//Tailors._stageDiv.appendChild(logDiv)
				domNode.appendChild(logDiv)

				div = document.createElement('div')
				div.innerHTML = 'Протокол'
				div.id = 'log_div_header'
				div.className = 'log_div_header'
				logDiv.appendChild(div)

				div1 = document.createElement('span')
				div1.innerHTML = '&#215;' // x
				div1.id = 'log_div_close'
				div1.className = 'log_div_close'
				div1.addEventListener('click', function (evt) {
					LogHelper.closeWindow()
				})
				div.appendChild(div1)


				divR = document.createElement('div')
				divR.innerHTML = ''
				divR.id = 'log_div_right'
				divR.className = 'log_div_right'
				logDiv.appendChild(divR)

				div = document.createElement('div')
				div.innerHTML = ''
				div.id = 'log_div_table'
				div.className = 'log_div_table'
				divR.appendChild(div)

				t = document.createElement('table')
				t.className = 'log_table'
				div.appendChild(t)

				let thead = document.createElement('thead')
				thead.id = 'log_table_head'
				thead.className = 'log_table_head'
				t.appendChild(thead)

				tbody = document.createElement('tbody')
				tbody.id = 'log_table_body'
				t.appendChild(tbody)

			}
		}

		//-- tailor control div
		{

			let tailorControl = document.createElement('div')
			tailorControl.innerHTML = '<span style="color: #005d60;">Длина нити:</span> <br>'
			tailorControl.id = 'tailor_control_div'
			tailorControl.className = 'tailor_control_div'
			//superDiv.appendChild(tailorControl)
			tailorControl.addEventListener('click', function (evt) {
				evt.stopPropagation()
			})
			/*
			tailorControl.addEventListener('keyup', (event) => {
				const keyName = event.key;
				log('keypress event\n\n' + 'key: ' + keyName);

			  });
			  */
			Tailors._stageDiv.appendChild(tailorControl)


			btn = document.createElement('button')
			btn.innerHTML = '&#8722;'; //'&#8678;'
			btn.id = 'tailor_control_maxlen_minus'
			btn.className = 'tailor_control_maxlen_btn'
			btn.setAttribute('style', 'margin-left: 7px;')
			btn.addEventListener('click', function (evt) {
				Global.tailorMaxlenPlusMinus(-1)
				//evt.stopPropagation()
			})
			tailorControl.appendChild(btn)


			t = document.createElement('input')
			t.value = ''
			t.type = 'text'
			t.setAttribute('oninput', 'this.value=this.value.replace(/[^0-9]/g,"");')
			t.id = 'tailor_control_maxlen'
			t.className = 'tailor_control_maxlen'

			t.addEventListener('keyup', (event) => {
				//const keyName = event.key;
				//log('keypress event\n\n' + 'key: ' + keyName);
				Global.tailorControlMaxlenChange()
				event.stopPropagation()
			  });

			tailorControl.appendChild(t)

			btn = document.createElement('button')
			btn.innerHTML = '&#43'
			btn.id = 'tailor_control_maxlen_plus'
			btn.className = 'tailor_control_maxlen_btn'
			btn.addEventListener('click', function (evt) {
				Global.tailorMaxlenPlusMinus(1)
				//evt.stopPropagation()
			})
			tailorControl.appendChild(btn)



		}

		//-- controls div  && slider
		{
			let controlDiv = document.createElement('div')
			controlDiv.innerHTML = ''
			controlDiv.id = 'controls_div'
			controlDiv.className = 'controls_div'
			superDiv.appendChild(controlDiv)

			//-- slider
			{

				btn = document.createElement('button')
				btn.innerHTML = '&#171;';// <<
				btn.id = 'go_btn_tostart'
				btn.title = 'В начало'
				btn.className = 'go_btn1'
				btn.addEventListener('click', function (evt) {
					Global.goToStart()
				})
				/*
				btn.style.backgroundImage = 'url("./tailors-resources/btn_go_start.png")'
				btn.style.backgroundRepeat = 'no-repeat'
				btn.style.backgroundPosition = 'center'
				btn.setAttribute('onmouseover', 'this.style.backgroundImage=\'url("./tailors-resources/btn_go_start_hover.png")\'')
				btn.setAttribute('onmouseout', 'this.style.backgroundImage=\'url("./tailors-resources/btn_go_start.png")\'')
				*/
				controlDiv.appendChild(btn)

				btn = document.createElement('button')
				btn.innerHTML = '&#187;';// >>
				btn.id = 'go_btn_toend'
				btn.title = 'В конец'
				btn.className = 'go_btn1'
				btn.addEventListener('click', function (evt) {
					Global.goToEnd()
				})
				/*
				btn.style.backgroundImage = 'url("./tailors-resources/btn_go_end.png")'
				btn.style.backgroundRepeat = 'no-repeat'
				btn.style.backgroundPosition = 'center'
				btn.setAttribute('onmouseover', 'this.style.backgroundImage=\'url("./tailors-resources/btn_go_end_hover.png")\'')
				btn.setAttribute('onmouseout', 'this.style.backgroundImage=\'url("./tailors-resources/btn_go_end.png")\'')
				*/
				controlDiv.appendChild(btn)

				btn = document.createElement('button')
				btn.innerHTML = '&#8250;';// >
				btn.id = 'go_btn_play'
				btn.title = 'Поехали'
				btn.className = 'go_btn1'
				btn.style.marginLeft = '20px'
				btn.addEventListener('click', function (evt) {
					//Global.goContinue()
					Global.goPlayStartStop()
				})
				controlDiv.appendChild(btn)

				/*
				btn = document.createElement('button')
				btn.innerHTML = '&#108;&#108;';// ||
				btn.id = 'go_btn_stop'
				btn.title = 'Стоп'
				btn.className = 'go_btn1'
				btn.addEventListener('click', function (evt) {
					//Global.goPlayStop()
					Global.goPlayStartStop()
				})
				controlDiv.appendChild(btn)
				*/


			btn = document.createElement('button')
			btn.innerHTML = '&#8722;'; //'&#8678;'
			btn.id = 'go_btn_minus'
			btn.title = 'Шаг назад'
			btn.className = 'go_btn1'
			btn.style.marginLeft = '20px'
			btn.addEventListener('click', function (evt) {
				Global.goStepMinus()
			})
			controlDiv.appendChild(btn)

			btn = document.createElement('button')
			btn.innerHTML = '&#43;';//'&#8680;'
			btn.id = 'go_btn_plus'
			btn.title = 'Шаг вперед'
			btn.className = 'go_btn1'
			btn.addEventListener('click', function (evt) {
				Global.goStepPlus()
			})
			controlDiv.appendChild(btn)

			/*
			btn = document.createElement('button')
			btn.innerHTML = '&#215;' // x
			btn.id = 'go_btn_clear'
			btn.title = 'Очистить'
			btn.className = 'go_btn1'
			btn.style.marginLeft = '20px'
			btn.style.color = 'red'
			btn.addEventListener('click', function (evt) {
				Global.clearAll()
			})
			controlDiv.appendChild(btn)
			*/

			Tailors._slider = new Slider(
				controlDiv,
				0,
				Tailors._levelSettings.timeInSec,
				45,
				Tailors.kioapi.getResource('slider_p'),
				Tailors.kioapi.getResource('slider_p')
			)

			Tailors._slider.domNode.className = 'hexagons-slider'
			Tailors._slider.resize(preferred_width)
			Tailors._slider.max_value = Tailors._levelSettings.timeInSec
			controlDiv.appendChild(Tailors._slider.domNode)

			Tailors._slider.onvaluechange = function () {
				// -- тащим руками
				//console.log('slider val=' + Tailors._slider.value);
				Global.goPlayStop()
				Global.goStep(Tailors._slider.value)
			  }

			Tailors._slider.onvaluechange2 = function () {
				// -- изменяем программно
				 //console.log('slider val2=' + Math.round(Tailors._slider.value));
				//_thisProblem.goShowTik(Math.round(_thisProblem._slider.value))
			  }
		}
		}
	}

	static canvasBotClear()
	{
		let canvasBot = document.getElementById('canvas_bot')
		let ctxBot = canvasBot.getContext('2d');
		ctxBot.clearRect(0, 0, canvasBot.width, canvasBot.height);
	}

	static drawCurrentTik()
	{
		let p = Global._drawProcess;
		let i, div, s, j, x, y, x1, n, h, y1
		let tailor
		let pLeft = 0
		let img1
		let tailorPng
		let princessState = ''
		let totalResH

		let canvasBot = document.getElementById('canvas_bot')
		let w = p._tailorsArr.length * 130
		canvasBot.width = w + 300

		h = InterfaceHelper._canvasBotHeight
		canvasBot.height = h;

		let nitYstart = 100;

		for(i = 0; i < p._tailorsArr.length; i++)
		{
			tailor = p._tailorsArr[i]

			//tailor._tanimate =  Global.getTanimate(tailor._id);

			div = document.getElementById('tailor_lencurrent_' + tailor._id);
			div.innerHTML = tailor._lenCurrent

			div = document.getElementById('tailor_total_' + tailor._id);
			div.innerHTML = tailor._totalResult

			if(tailor._currentState == 'R' || tailor._currentState == '@')
			{
				//-- этот сейчас на перезагрузке

				tailorPng = 'tailor_r0';
				princessState = 'R'

				//document.getElementById('tailor_lencurrent_' + tailor._id).style.backgroundColor = 'red'
				$('#tailor_lencurrent_' +  + tailor._id).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)
			}
			else if(tailor._currentState == 'w')
			{
				tailorPng = 'tailor_w';
			}
			else if(tailor._currentState == '-')
			{
				if(tailor._step % 2 == 0)
				{
					tailorPng = 'tailor_m1';
				}
				else{
					tailorPng = 'tailor_m2';
				}
			}
			else
			{
				tailorPng = 'tailor_1';

			}

			TailorHelper.drawTailor(tailor._id, tailorPng, i+1)

			div = document.getElementById('tailor_div_' + tailor._id);
			pLeft = div.offsetLeft

			totalResH = tailor._totalResult * 10 //+ 50


			x = InterfaceHelper._tailorsLeft + (i)* 95


			if(InterfaceHelper._canvasBotHeight < totalResH + nitYstart + 50)
			{
				InterfaceHelper._canvasBotHeight = totalResH + nitYstart + 50
			}
			else{
				//InterfaceHelper._canvasBotHeight = 60
			}

		}

		if(!Global._canPlay)
		{
			Tanimate.drawNit(true);

			//log('Global._drawProcess._princessState =' + Global._drawProcess._princessState  + ' nextId=' + Global._drawProcess._nextReloadId)

		}



		if(Global._drawProcess._currentTik == 0){
			pLeft = 10
		}
		else{
			if(Global._drawProcess._princessState == 'reload')
			{
				div = document.getElementById('tailor_div_' + Global._drawProcess._currentReloadId);
				pLeft = div.offsetLeft
				//log('sssssss 11')
			}
			else{
				// run
				//div = document.getElementById('tailor_div_' + Global._drawProcess._nextReloadId)
				div = document.getElementById('tailor_div_' + Global._drawProcess._princessToTailorId)

				pLeft = div.offsetLeft //- 30

				//log('sssssss 22')
			}
		}


		if(!Global._canPlay)
		{
			Global._princessDiv.style.left = (pLeft - 30) + 'px';
		}

		if(princessState == 'R'){
			s = 'princess'
			Global._princessState = "R"
		}
		else
		{


			s = 'princess_2'

			Global._princessState = ""
		}

		Global._princessCtx.clearRect(0, 0, Global._princessCanvas.width, Global._princessCanvas.height);
		img1 = Tailors.kioapi.getResource(s)
		Global._princessCtx.drawImage(img1, 0, 0, 80, 80);


		Tailors._slider.value2 = Global._drawProcess._currentTik
		LogHelper.selectTik(Global._drawProcess._currentTik)

	}
}


function log(s){
	console.log(s);
}