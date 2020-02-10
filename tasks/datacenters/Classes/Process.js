
import { Global } from "./Global.js"
import { Helper } from "./Helper.js"
import { Relay } from "./Relay.js"
import { Datacenters } from "../datacenters.js"

export class Process{

	//--
	static calcResult(){
		//-- обходим все отмеченные
		//-- удаляем из общего списка всех кто имеет связь с отмеченным
		//-- а так же и самого отмеченного

		log('calcResult()')
		let i, dc, rel
		let totalLen = 0

		Global._dcBadDic = {}

		for(i=0; i < Global._relArr.length; i++)
		{
			Global._relArr[i]._selected = false
		}

		//-- строим список плохих, из которого потом удалим хорошие

		for (var name in Global._dcDic)
		{
			Global._dcBadDic[name] = 1
		}

		let selCount = 0;

		for (var name in Global._dcDic)
		{
			dc = Global._dcDic[name]

			if(dc._selected)
			{
				delete Global._dcBadDic[name]
				selCount++

				for(i = 0; i < Global._relArr.length; i++)
				{
					rel = Global._relArr[i]


					//log('n=' + name + ' n1=' + name1 + 'n2=' + name2)

					if(name == rel._dc1Name || name == rel._dc2Name)
					{
						//-- отмеченный учавствует в этой связи
						//-- удаляем из плохих
						if(Helper.hasKey(Global._dcBadDic, rel._dc1Name)){
							delete Global._dcBadDic[rel._dc1Name]
						}
						if(Helper.hasKey(Global._dcBadDic, rel._dc2Name)){
							delete Global._dcBadDic[rel._dc2Name]
						}

						Global._relArr[i]._selected = true;
						//totalLen = totalLen + rel._len
					}


				}
			}


			//log(dc._name + ' - ' + dc._selected)
		}

		for(i=0; i < Global._relArr.length; i++)
		{
			if(Global._relArr[i]._selected)
			{
				totalLen = totalLen + Global._relArr[i]._len
			}
		}

		//log('bad=' + Helper.dicLen(Global._dcBadDic) + ' res=' + selCount)

		Datacenters._currentSolution._dcBadCount = Helper.dicLen(Global._dcBadDic)
		Datacenters._currentSolution._dcSelectedCount = selCount
		Datacenters._currentSolution._dcSelectedArr = Global.getDcSelectedArr()
		Datacenters._currentSolution._len = totalLen

		Datacenters.saveCurrentSolution()

		Global._stageTop.update();

		log('calcResult() - OK')
	}
}

function log(s){
	console.log(s);
}