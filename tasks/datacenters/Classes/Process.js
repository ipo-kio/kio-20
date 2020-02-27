
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
		let points2Count = 0; //Количество вершин, рядом с которыми 2 датацентра

		Global._dcBadDic = {}
		let dcGreenDic = {}  //-- тут те, которые не отмечены, но привязаны

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
		let name1

		for (var name in Global._dcDic)
		{
			dc = Global._dcDic[name]

			dc._points2Count = 0

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


						//-- найдем привязанного
						if(name != rel._dc1Name)
						{
							name1 = rel._dc1Name
						}
						else{
							name1 = rel._dc2Name
						}

						//-- если привязанный тоже отмечен, то пропускаем
						if(!Global._dcDic[name1]._selected)
						{
							if(Helper.hasKey(dcGreenDic, name1))
							{
								dcGreenDic[name1] = dcGreenDic[name1]  + 1
							}
							else{
								dcGreenDic[name1]  = 1
							}
						}


					}
				}
			}
		}

		/*
		3.суммарная длина расстояний от вершин до датацентров. Для каждой вершины, рядом с которой есть датацентры,
		выбирается ровно один ближайший, и расстояние скаладывается до него (надо как можно больше)
		*/


		//log('bad=' + Helper.dicLen(Global._dcBadDic) + ' res=' + selCount)

		let minLen
		let goodRel

		for (var nameGreen in dcGreenDic)
		{
			if(dcGreenDic[nameGreen] > 1)
			{
				points2Count++
				Global._dcDic[nameGreen]._points2Count = dcGreenDic[nameGreen]
			}


			//log(nameGreen)
			minLen = 111111111110
			goodRel = null

			//-- удалим лишние связи с ДС
			for(i = 0; i < Global._relArr.length; i++)
			{
				rel = Global._relArr[i]

				if(rel._selected)
				{
					if(nameGreen == rel._dc1Name || nameGreen == rel._dc2Name)
					{
						//-- это связь от нашего зеленого

						//log(rel)

						if(Global._dcDic[rel._dc1Name]._selected)
						{
							if(rel._len < minLen)
							{
								minLen = rel._len
								goodRel = rel
							}
						}

						if(Global._dcDic[rel._dc2Name]._selected)
						{
							if(rel._len < minLen)
							{
								minLen = rel._len
								goodRel = rel
							}
						}


						rel._selected = false
					}


				}
			}

			if(goodRel != null){
				goodRel._selected = true
			}

			//log(nameGreen + ' minLen=' + goodRel._len)
		}

		for(i=0; i < Global._relArr.length; i++)
		{
			rel = Global._relArr[i]

			if(Global._dcDic[rel._dc1Name]._selected && Global._dcDic[rel._dc2Name]._selected)
			{
				//-- это связь между двумя отмеченными ДС, ее считать не надо
				rel._selected = false
			}

			if(rel._selected)
			{
				totalLen = totalLen + rel._len
			}
		}

		Datacenters._currentSolution._dcBadCount = Helper.dicLen(Global._dcBadDic)
		Datacenters._currentSolution._dcSelectedCount = selCount
		Datacenters._currentSolution._dcSelectedArr = Global.getDcSelectedArr()
		Datacenters._currentSolution._len = totalLen
		Datacenters._currentSolution._dcPoints2 = points2Count

		Datacenters.saveCurrentSolution()

		Global._stageTop.update();

		//log('calcResult() - OK')
		//log(dcGreenDic)
	}
}

function log(s){
	console.log(s);
}