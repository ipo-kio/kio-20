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
		let i
		for(i=0; i < Global._relArr.length; i++)
		{
			if(lenShape.name == Global._relArr[i]._name)
			{
				if(Global._relArr[i]._selected )
				{
					lenShape.fillCmd.style =  "yellow";
				}
				else{
					lenShape.fillCmd.style =  "white";
				}
			}
		}
	}

	static setPoweredState(ctx, dcShape)
	{
		let dc = Global._dcDic[dcShape.name]

		if(dc._selected)
		{
			dcShape.fillCmd.style =  "blue";
		}
		else
		{
			if(Helper.hasKey(Global._dcBadDic, dcShape.name))
			{
				//-- не охваченные
				dcShape.fillCmd.style =  "red";
			}
			else{
				//--охваченные
				dcShape.fillCmd.style =  "green";
			}
		}
	}
}
//http://sp-pr-dt0282.mara.local/kio/kio-20/dist/datacenters.html
function log(s){
	console.log(s);
}