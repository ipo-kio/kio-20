import { Tailors } from "../tailors.js"
import { Tailor } from './Tailor.js'
import { Global } from './Global.js'
import { Slider } from './slider.js'
import { TailorHelper } from "./TailorHelper.js"
import { LogHelper } from "./LogHelper.js"

export class InterfaceHelper
{
	static _canvasBotHeight = 60

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

			//-- tailor plus - minus
			{
				/*
				btn = document.createElement('button')
				btn.innerHTML = '&#8722;'; //'&#8678;'
				btn.id = 'btn_tailor_minus'
				btn.title = 'Удалить выбранного'
				btn.className = 'tailor_plusminus_btn'
				btn.addEventListener('click', function (evt) {
					Global.tailorMinus()
				})
				Tailors._stageDiv.appendChild(btn)
				*/

				btn = document.createElement('button')
				btn.innerHTML = '&#43;'
				btn.id = 'btn_tailor_plus'
				btn.title = 'Добавить'
				btn.className = 'tailor_plusminus_btn'
				btn.addEventListener('click', function (evt) {
					Global.tailorPlus()
				})
				Tailors._stageDiv.appendChild(btn)


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
				canvasPrinc.width = 40
				canvasPrinc.height = 40
				canvasPrinc.className = 'canvas_princ'
				canvasPrinc.id = 'canvas_princ'
				princessDiv.appendChild(canvasPrinc)


				Global._princessCanvas = canvasPrinc
				Global._princessCtx = Global._princessCanvas.getContext('2d');

				let img1 = Tailors.kioapi.getResource('princess')
				Global._princessCtx.drawImage(img1, 2, 2, 40, 40);
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
			tailorControl.innerHTML = 'Длина нити: <br>'
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


			t.onchange = function(){
				//Global.tailorControlMaxlenChange()
			}

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
				controlDiv.appendChild(btn)

				btn = document.createElement('button')
				btn.innerHTML = '&#187;';// >>
				btn.id = 'go_btn_toend'
				btn.title = 'В конец'
				btn.className = 'go_btn1'
				btn.addEventListener('click', function (evt) {
					Global.goToEnd()
				})
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
		let i, div, s, j, x, y, x1, n, h
		let tailor
		let pLeft = 0
		let img1
		let tailorPng
		let princessState = ''
		let totalResH



		let canvasBot = document.getElementById('canvas_bot')

		let w = p._tailorsArr.length * 90
		canvasBot.width = w

		/*
		if(p._maxTailorTotalResult > 5){
			h = InterfaceHelper._canvasBotHeight + (p._maxTailorTotalResult-5)*10
		}
		else{
			h = InterfaceHelper._canvasBotHeight
		}
		*/
		h = InterfaceHelper._canvasBotHeight
		canvasBot.height = h;

		//InterfaceHelper._canvasBotHeight = InterfaceHelper._canvasBotHeight + 10
		//canvasBot.height =  InterfaceHelper._canvasBotHeight

		let ctxBot = canvasBot.getContext('2d');


		InterfaceHelper.canvasBotClear()




		for(i = 0; i < p._tailorsArr.length; i++)
		{
			tailor = p._tailorsArr[i]

			div = document.getElementById('tailor_lencurrent_' + tailor._id);
			div.innerHTML = tailor._lenCurrent

			div = document.getElementById('tailor_total_' + tailor._id);
			div.innerHTML = tailor._totalResult

			if(tailor._currentState == 'R' || tailor._currentState == '@')
			{
				//-- этот сейчас на перезагрузке
				//pLeft = div.offsetLeft

				tailorPng = 'tailor_r';
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
				if(tailor._step % 2 == 0)
				{
					tailorPng = 'tailor_1';
				}
				else{
					tailorPng = 'tailor_2';
				}
			}

			TailorHelper.drawTailor(tailor._id, tailorPng, i+1)

			div = document.getElementById('tailor_div_' + tailor._id);
			pLeft = div.offsetLeft

			totalResH = tailor._totalResult * 10 + 10

			ctxBot.beginPath();
			ctxBot.lineWidth = 2;
			ctxBot.strokeStyle = "silver";
			//ctxBot.fillStyle = "red";

			x = 25 + (i)* 95

			ctxBot.moveTo(x, 10)
			ctxBot.lineTo(x, totalResH)



			/*
			for (j = 1; j < totalResH; j++) {

				x1 = x +  (Math.sin(10*j/180*Math.PI) * 10);

				//log('x1=' + x1)

				ctxBot.lineTo(x1, j);
			  }
			*/


			if(tailor._currentState == '-')
			{
				ctxBot.moveTo(x, 0)

				x1 = x- ((tailor._lenCurrent-tailor._step)*10)
				//log('l='+(tailor._lenCurrent)+ ' s=' + tailor._step)

				ctxBot.quadraticCurveTo(x1,5,x,10)
			}




			ctxBot.stroke();
			ctxBot.closePath();

			//-- отметки стежков
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 2;
				ctxBot.strokeStyle = "black";

				if(tailor._totalResult > 0)
				{
					n = totalResH / tailor._totalResult;

					for (j = 1; j < tailor._totalResult; j++)
					{
						ctxBot.moveTo(x-1, (j*n))
						ctxBot.lineTo(x+1, (j*n))
					}
				}

				ctxBot.stroke();
				ctxBot.closePath();
			}


			//-- длина нити
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 1;
				ctxBot.fillStyle = 'blue';
				ctxBot.font = 'bold 20px Arial';
				ctxBot.fillText(tailor._totalResult, x + 15 , 15 )
				ctxBot.stroke();
				ctxBot.closePath();
			}




			if(InterfaceHelper._canvasBotHeight < totalResH)
			{
				InterfaceHelper._canvasBotHeight = totalResH
			}
			else{
				//InterfaceHelper._canvasBotHeight = 60
			}

		}

		//log('Global._drawProcess._princessState =' + Global._drawProcess._princessState )


		if(Global._drawProcess._princessState == 'reload')
		{
			div = document.getElementById('tailor_div_' + Global._drawProcess._currentReloadId);
			pLeft = div.offsetLeft
			//log('sssssss 11')
		}
		else{
			// run
			div = document.getElementById('tailor_div_' + Global._drawProcess._nextReloadId)
			pLeft = div.offsetLeft - 30
		}

		pLeft = pLeft - 10;



		if(!(pLeft < Global._princessDiv.offsetLeft && pLeft > 0))
		{
			//log('pp=' + Global._princessDiv.offsetLeft)

			//pLeft = Global._princessDiv.offsetLeft + 3

			Global._princessDiv.style.left = (pLeft - 20) + 'px';
			Global._princessDiv.style.top = '130px';

			//log('LLLLLL=' + (pLeft-20))
		}
		else{

		}





		if(princessState == 'R'){
			s = 'princess'
			Global._princessState = "R"
		}
		else{
			s = 'princess_2'
			Global._princessState = ""
		}

		Global._princessCtx.clearRect(0, 0, Global._princessCanvas.width, Global._princessCanvas.height);
		img1 = Tailors.kioapi.getResource(s)
		Global._princessCtx.drawImage(img1, 0, 0, 50, 50);


		Tailors._slider.value2 = Global._drawProcess._currentTik


	}
}


function log(s){
	console.log(s);
}