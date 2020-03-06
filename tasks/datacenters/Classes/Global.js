import { Process } from "./Process.js"
import { Relay } from "./Relay.js"
import { Helper } from "./Helper.js"
import { Datacenters } from "../datacenters.js"

export class Global
{
	_stageTop
	_canvasTop
	static _ggg = 0
	static _dcDic = {}
	static _relArr = []
	static _dcBadDic = {}
	static _tik01 = false;

	static clickDC(name)
	{
		let dcCont = Global._stageTop.getChildByName(name)
		let dcShape = dcCont.getChildByName(dcCont.dcName)

		let dc = Global._dcDic[dcShape.name]

		dc._selected = !dc._selected



		Process.calcResult()

	}

	static getDcSelectedArr()
	{
		let dcSelectedArr = []
		let dc

		for (var name in Global._dcDic)
		{
			dc = Global._dcDic[name]
			if(dc._selected){
				dcSelectedArr.push(name)
			}
		}

		return dcSelectedArr
	}

	static setLenColor(ctx, lenShape)
	{
		let i, text, line
		for(i=0; i < Global._relArr.length; i++)
		{
			if(lenShape.name == Global._relArr[i]._name)
			{
				text = Global._stageTop.getChildByName(lenShape.name + '_text')
				line = Global._stageTop.getChildByName(Global._relArr[i]._name)

				if(Global._relArr[i]._selected )
				{
					lenShape.fillCmd.style =  "white";
					text.color = '#027202'

					line.strokeCmd.style =  "#027202";
					line.dotCmd.segments = null
				}
				else{
					lenShape.fillCmd.style =  "#979797";
					text.color = 'white'
					line.strokeCmd.style =  "#c00000";
					line.dotCmd.segments =  [12,5]

				}

			}
		}
	}

	static setPoweredState(ctx, dcShape)
	{
		let dc = Global._dcDic[dcShape.name]

		let cont = Global._stageTop.getChildByName(dc._name + '_cont')
		let text = cont.getChildByName(dc._name + '_text')
		let imgSel = cont.getChildByName(dc._name + '_img_sel')
		let imgRed = cont.getChildByName(dc._name + '_img_red')
		let imgGreen = cont.getChildByName(dc._name + '_img_green')

		if(dc._selected)
		{
			/*
			if(Global._tik01)
			{
				dcShape.fillCmd.style =  "green";
			}
			else{
				dcShape.fillCmd.style =  "#62e362";
			}
			*/
			dcShape.fillCmd.style =  "yellow";

			imgSel.visible = true
			imgRed.visible = false
			imgGreen.visible = false
			text.color =  "white";
		}
		else
		{
			if(Helper.hasKey(Global._dcBadDic, dcShape.name))
			{
				//-- не охваченные
				//dcShape.fillCmd.style =  "red";
				imgSel.visible = false
				imgRed.visible = true
				imgGreen.visible = false
				text.color =  "#5c5c5c";
			}
			else{
				//--охваченные

				if(dc._points2Count > 0)
				{
					dcShape.strokeCmd.style =  "red";
				}
				else{
					dcShape.strokeCmd.style =  "black";
				}

				//dcShape.fillCmd.style =  "green";
				imgSel.visible = false
				imgRed.visible = false
				imgGreen.visible = true

				text.color =  "#5c5c5c";
			}

		


		}

	}

	static tick(){
		//log('tick')
		Global._tik01 = !Global._tik01
		Global._stageTop.update();
	}
}
//http://sp-pr-dt0282.mara.local/kio/kio-20/dist/datacenters.html
function log(s){
	console.log(s);
}