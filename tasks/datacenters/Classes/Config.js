
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
			dcArr = [
				['dc_1', 100, 100],
				['dc_2',200, 200],
				['dc_3',100, 250],
				['dc_4',50, 360],
				['dc_5',110, 450],
				['dc_6',200, 400],
				['dc_7',380, 330],
				['dc_8',360, 450],
				['dc_9',500, 450],
				['dc_10',700, 450],
				['dc_11',220, 310],
				['dc_12',510, 230],
				['dc_13',690, 210],
				['dc_14',790, 310],
				['dc_15',820, 210],
				['dc_16',230, 110],
				['dc_17',300, 210],
				['dc_18',370, 140],
				['dc_19',540, 100],
			]

			relArr = [
				['dc_1', 'dc_2'],
				['dc_1', 'dc_3'],
				['dc_3', 'dc_4'],
				['dc_4', 'dc_5'],
				['dc_5', 'dc_6'],
				['dc_6', 'dc_8'],
				['dc_7', 'dc_2'],
				['dc_7', 'dc_9'],
				['dc_9', 'dc_10'],
				['dc_11', 'dc_2'],
				['dc_11', 'dc_6'],
				['dc_12', 'dc_8'],
				['dc_12', 'dc_10'],
				['dc_11', 'dc_19'],
				['dc_16', 'dc_17'],
				['dc_17', 'dc_7'],
				['dc_1', 'dc_16'],
				['dc_16', 'dc_18'],
				['dc_18', 'dc_19'],
				['dc_19', 'dc_13'],
				['dc_9', 'dc_15'],
				['dc_13', 'dc_15'],
				['dc_14', 'dc_15'],
				['dc_10', 'dc_14'],
			]

		}
		else if(level == 2)
		{
			log('-----------level 2 -----------')
			dcArr = [
				['dc_1', 100, 100],
				['dc_2',200, 200],
				['dc_3',100, 250],
				['dc_4',50, 360],
				['dc_5',110, 450],
				['dc_6',200, 400],
				['dc_7',380, 330],
				['dc_8',360, 450],
				['dc_9',500, 450],
				['dc_10',780, 450],
				['dc_11',220, 310],
				['dc_12',510, 230],
				['dc_13',690, 190],
				['dc_14',790, 310],
				['dc_15',650, 260],
				['dc_16',230, 110],
				['dc_17',300, 210],
				['dc_18',370, 140],
				['dc_19',540, 100],
				['dc_20',860, 100],
				['dc_21',900, 300],
				['dc_22',860, 400],
				['dc_23',970, 400],
				['dc_24',980, 200],
			]

			relArr = [
				['dc_1', 'dc_2'],
				['dc_1', 'dc_3'],
				['dc_3', 'dc_4'],
				['dc_4', 'dc_5'],
				['dc_5', 'dc_6'],
				['dc_6', 'dc_8'],
				['dc_7', 'dc_2'],
				['dc_7', 'dc_9'],
				['dc_9', 'dc_10'],
				['dc_11', 'dc_2'],
				['dc_11', 'dc_6'],
				['dc_12', 'dc_8'],
				['dc_12', 'dc_10'],
				['dc_11', 'dc_19'],
				['dc_16', 'dc_17'],
				['dc_17', 'dc_7'],
				['dc_1', 'dc_16'],
				['dc_16', 'dc_18'],
				['dc_18', 'dc_19'],
				['dc_19', 'dc_13'],
				['dc_9', 'dc_15'],
				['dc_13', 'dc_15'],
				['dc_14', 'dc_15'],
				['dc_10', 'dc_14'],
				['dc_13', 'dc_20'],
				['dc_20', 'dc_21'],
				['dc_21', 'dc_22'],
				['dc_22', 'dc_12'],

				['dc_20', 'dc_24'],
				['dc_24', 'dc_23'],
				['dc_23', 'dc_22'],
			]
		}
		else
		{
			log('-----------level 0 -----------')
			dcArr = [
				['dc_1', 100, 100],
				['dc_2',200, 200],
				['dc_3',100, 250],
				['dc_4',50, 360],
				['dc_5',110, 450],
				['dc_6',200, 400],
				['dc_7',380, 330],
				['dc_8',360, 450],
				['dc_9',500, 450],
				['dc_10',700, 450],
				['dc_11',220, 310],
				['dc_12',630, 210],
			]

			relArr = [
				['dc_1', 'dc_2'],
				['dc_1', 'dc_3'],
				['dc_3', 'dc_4'],
				['dc_4', 'dc_5'],
				['dc_5', 'dc_6'],
				['dc_6', 'dc_8'],
				['dc_7', 'dc_2'],
				['dc_7', 'dc_9'],
				['dc_9', 'dc_10'],
				['dc_11', 'dc_2'],
				['dc_11', 'dc_6'],
				['dc_12', 'dc_8'],
				['dc_12', 'dc_10'],
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