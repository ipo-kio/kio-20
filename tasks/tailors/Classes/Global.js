import { Tailors } from "../tailors.js"

import { Process } from './Process.js'
import { Tailor } from './Tailor.js'
import { TailorHelper } from './TailorHelper.js'
import { InterfaceHelper } from "./InterfaceHelper.js"
import { SettingsHelper } from "./SettingsHelper.js"
import { LogHelper } from "./LogHelper.js"

export class Global
{
	static _tailorsArr = [];
	static _tailorIdNext = 0;
	static _selectedTailor = null
	static _drawProcess
	static _canPlay = false
	static _princessDiv
	static _princessCtx
	static _princessTimeOutId
	static _princessState = ""
	static _princessCanvas

	static createResult()
	{
		let process = new Process()
		LogHelper.clearLog(process._tailorsArr)
		Tailors._currentSolution = process.calcFullSolution()
		Tailors.saveCurrentSolution()
	}

	static tailorPlus()
	{
		log('tailorPlus()')
		let tailor = Global.createTailor()

		TailorHelper.redrawTailors()

		Global.goToStart();
	}

	static createTailor()
	{
		Global._tailorIdNext++;

		let tailor = new Tailor()
		tailor._id = Global._tailorIdNext;
		Global._tailorsArr.push(tailor);

		TailorHelper.createTailorDiv(tailor)

		return tailor
	}

	static tailorMinus(){

		if(Global._selectedTailor == null) return

		if(Global._tailorsArr.length < 2)  return

		Global.tailorRemove(Global._selectedTailor._id)



		Global.goToStart();
	}

	static goToStart()
	{
		//log('goToStart()')
		Global.setCanPlay(false)
		Tailors._slider.value2 = 0

		Global._drawProcess = new Process()
		Global.createResult()
		InterfaceHelper.canvasBotClear()

	}

	static tailorClick(tailorDivId, e)
	{
		//log('tclick=' + tailorDivId)

		let div = document.getElementById(tailorDivId)
		let tailorId = div.getAttribute('tailor_id')
		Global.tailorSelect(tailorId)

		e.stopPropagation()
	}

	static tailorRemove(tailorId)
	{
		let i, tailor, div

		for(i=0; i < Global._tailorsArr.length; i++)
		{
			tailor = Global._tailorsArr[i]

			if(tailor._id == tailorId)
			{
				Global._tailorsArr.splice(i, 1)

				break;
			}
		}


		div = document.getElementById('tailor_div_' + tailorId);
		div.parentNode.removeChild(div)

		Global._selectedTailor = null;
		document.getElementById('tailor_control_div').style.display = 'none'

		TailorHelper.redrawTailors()
	}

	static tailorDelClick(tailorId, e)
	{
		Global.tailorMinus()

		//log('tailorDelClick() ' + tailorId)
		//Global.tailorRemove(tailorId)

		e.stopPropagation()
	}

	static tailorControlMaxlenChange(){
		let t = document.getElementById('tailor_control_maxlen').value

		let n = parseInt(t)

		if(n > 0)
		{
			Global._selectedTailor._maxLen = t
			document.getElementById('tailor_maxlen_' + Global._selectedTailor._id).innerHTML = t

			$('#tailor_maxlen_'+ Global._selectedTailor._id).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100)

			Global.goToStart()
		}
		else{

		}

	}

	static tailorSelect(tailorId)
	{
		let i, tailorDiv, tailor

		//log(' sel Global._tailorsArr.length=' + Global._tailorsArr.length + ' tailorId=' + tailorId)

		Global.tailorsUnselect(tailorId)

		tailorDiv = document.getElementById('tailor_div_' + Global._selectedTailor._id)

		tailorDiv.style.borderColor = 'red';
		document.getElementById('tailor_close_' + Global._selectedTailor._id).style.display = 'block'

		Global.tailorControlShow()
	}



	static tailorControlShow()
	{
		let txt = document.getElementById('tailor_control_maxlen')
		txt.value = Global._selectedTailor._maxLen

		//let table = document.getElementById('top_table')
		//let el = table.rows[0].cells[0];

		let div = document.getElementById('tailor_div_' + Global._selectedTailor._id);
		let pLeft = div.offsetLeft// - el.scrollLeft;

		let tcd = document.getElementById('tailor_control_div')
		tcd.style.left = pLeft + 'px'
		tcd.style.top = '180px'
		tcd.style.display = 'block'

		txt.focus()
		txt.setSelectionRange(0, txt.value.length)

	}

	static goStepPlus()
	{
		Global.setCanPlay(false);
		if(Global._drawProcess._currentTik >= Tailors._levelSettings.timeInSec)
		{
			return
		}
		Global._drawProcess.calcNextTik()

		InterfaceHelper.drawCurrentTik()

		LogHelper.selectTik(Global._drawProcess._currentTik)
	}

	static goStepMinus()
	{
		Global.tailorsUnselectAndControlHide()
		Global.setCanPlay(false);

		if(Global._drawProcess._currentTik <= 0)
		{
			return
		}

		Global._drawProcess._currentTik--

		Global._drawProcess.calcToTik(Global._drawProcess._currentTik)
		InterfaceHelper.drawCurrentTik()
		LogHelper.selectTik(Global._drawProcess._currentTik)
	}

	static stageDivClick()
	{
		Global.setCanPlay(false)

		Global.tailorsUnselectAndControlHide()
	}

	static tailorsUnselectAndControlHide(){
		Global._selectedTailor = null
		Global.tailorsUnselect(0)
		Global.tailorControlHide()
	}

	static tailorsUnselect(tailorId)
	{
		let tailor, i, tailorDiv

		for(i=0; i < Global._tailorsArr.length; i++)
		{
			tailor = Global._tailorsArr[i]

			tailorDiv = document.getElementById('tailor_div_' + tailor._id)

			tailorDiv.style.borderColor = 'transparent';// 'beige';

			document.getElementById('tailor_close_' + tailor._id).style.display = 'none'

			if(tailor._id == tailorId){
				Global._selectedTailor = tailor
			}
		}
	}

	static tailorControlHide(){
		let tcd = document.getElementById('tailor_control_div')
		tcd.style.display = 'none'
	}
	static tailorMaxlenPlusMinus(n)
	{
		let txt = document.getElementById('tailor_control_maxlen')

		let newN = (txt.value * 1) + n

		if(newN > 0)
		{
			txt.value = newN
			Global.tailorControlMaxlenChange()
		}
	}

	static goStep(newStep)
	{
		Global._drawProcess.calcToTik(newStep)

		InterfaceHelper.drawCurrentTik()

		LogHelper.selectTik(Global._drawProcess._currentTik)
	}

	static goPlayStartStop()
	{
		if(Global._canPlay)
		{
			Global.goPlayStop()
		}
		else{
			Global.goContinue()
		}
	}

	static goPlayStop()
	{
		Global.tailorsUnselectAndControlHide()
		Global.setCanPlay(false)
	}

	static goContinue()
	{
		Global.tailorsUnselectAndControlHide()

		if(!Global._canPlay )
		{
			if(Global._drawProcess._currentTik < Tailors._levelSettings.timeInSec)
			{
				Global.setCanPlay(true)
				setTimeout(Global.playNexTik, 500)
			}
			else{
				Global.goToStart();
			}
		}
	}

	static setCanPlay(canPlay)
	{
		Global._canPlay = canPlay

		let s, tt

		if(canPlay)
		{
			s = '&#108;&#108;' // ||
			tt = 'Стоп'
		}
		else{
			s = '&#9658;' //&#8250; >
			tt = 'Поехали'
		}


		//document.getElementById('go_btn_stop').disabled = !canPlay;

		//document.getElementById('go_btn_play').disabled = canPlay;
		document.getElementById('go_btn_play').innerHTML = s
		document.getElementById('go_btn_play').title = tt
	}

	static playNexTik()
	{
		if(!Global._canPlay) return



		Global._drawProcess.calcNextTik()
		InterfaceHelper.drawCurrentTik()
		LogHelper.selectTik(Global._drawProcess._currentTik)

		if(Global._drawProcess._currentTik < Tailors._levelSettings.timeInSec && Global._canPlay)
		{
			setTimeout(Global.playNexTik, 500)
			Global.movePrincess();
		}
		else{
			Global.setCanPlay(false)
		}
	}

	static movePrincess()
	{
		if(!Global._canPlay) return
		if(Global._princessState == 'R') return;

		let pLeft = Global._princessDiv.offsetLeft;

		Global._princessDiv.style.left = (pLeft + 5) + 'px';

		//log('p=' + pLeft)
		clearTimeout(Global._princessTimeOutId)
		Global._princessTimeOutId = setTimeout(Global.movePrincess, 100)
	}

	static goToEnd()
	{
		Global.tailorsUnselectAndControlHide()
		Global._drawProcess.calcToTik(Tailors._levelSettings.timeInSec)

		InterfaceHelper.drawCurrentTik()

		LogHelper.selectTik(Global._drawProcess._currentTik)
	}

	static clearAll()
	{
		let i, tailor

		while(Global._tailorsArr.length > 0)
		{
			tailor = Global._tailorsArr[Global._tailorsArr.length-1]

			Global.tailorRemove(tailor._id)
		}


		Global.tailorPlus()

	}
}


function log(s){
	console.log(s);
}