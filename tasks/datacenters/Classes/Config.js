
import { LevelData } from "./LevelData.js"
import { DataCenter } from "./DataCenter.js"
import { Relay } from "./Relay.js"
import { DrawHelper } from "../../tailors/Classes/DrawHelper.js";
import { Helper } from "./Helper.js"

export class Config{

	static _levelData_0;


	static setLevelData(level)
	{
		Config.prepareLevelData(level)
	}

	static prepareLevelData(level)
	{
		let i, dc, rel, dc1, dc2
		let dcArr = []
		let relArr = []


		if(level == 1)
		{
			log('-----------level 1 -----------')
		}
		else if(level == 2)
		{
			log('-----------level 2 -----------')
		}
		else
		{
			log('-----------level 0 -----------')
			dcArr = [
				['dc_1', 400, 300],
				['dc_2',830, 60],
				['dc_3',180, 120],
				['dc_4',1180, 440],
				['dc_5',120, 460],
				['dc_6',580, 310],
				['dc_7',320, 50],
				['dc_8',900, 200],
				['dc_9',180, 240],
				['dc_10',480, 150]
			]

			relArr = [
				['dc_1', 'dc_2'],
				['dc_1', 'dc_3'],
				['dc_1', 'dc_4'],
				['dc_9', 'dc_5'],
				['dc_10', 'dc_6'],
				['dc_9', 'dc_10'],
				['dc_8', 'dc_10'],
				['dc_7', 'dc_3'],
				['dc_7', 'dc_2'],
				['dc_5', 'dc_4'],
				['dc_6', 'dc_8'],
			]
		}




		let levelData = new LevelData()

		for(i=0; i< dcArr.length; i++){
			dc = new DataCenter(dcArr[i][0], dcArr[i][1], dcArr[i][2])
			levelData._dcDic[dc._name] = dc
		}

		for(i=0; i < relArr.length; i++)
		{
			if(Helper.hasKey(levelData._dcDic, relArr[i][0]))
			{
				if(Helper.hasKey(levelData._dcDic, relArr[i][1]))
				{
					dc1 = levelData._dcDic[relArr[i][0]]
					dc2 = levelData._dcDic[relArr[i][1]]

					rel = new Relay(dc1._name, dc2._name)
					levelData._relArr.push(rel)

				}
				else{
					log('Config Error! -' + relArr[i][1] + ' not found!')
				}
			}
			else{
				log('Config Error! -' + relArr[i][0] + ' not found!')
			}
		}


		Config._levelData_0 = levelData;

		//log(Config._levelData_0)
	}

	static getLevelData()
	{
		return Config._levelData_0;
	}
}

function log(s){
	console.log(s);
}