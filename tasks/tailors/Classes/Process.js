import { Tailors } from "../tailors.js"
import { Global } from './Global.js'
import { Tailor } from './Tailor.js'
import { TailorHelper } from './TailorHelper.js'
import { Solution } from "./Solution.js"
import { SettingsHelper } from './SettingsHelper.js'
import { LogHelper } from './LogHelper.js'

export class Process
{
	 _nextReloadId
	 _currentReloadId
	 _reloadSecStep
	 _reloadCurrentIndex
	 _reloadSec
	 _qArr = [] //-- очередь на перезагрузку
	 _tailorsArr = []
	 _currentTik = 0
	 _princessState = 'run'
	 _princessLastPass
//	 _maxTailorTotalResult = 0  //-- самый длинный результат

	constructor()
	{
		this.prepareForStart()

	}

	prepareForStart()
	{
		this._princessState = 'run'
		let i
		let tailor, tailorG
		this._tailorsArr = []
		this._qArr = []
		this._princessLastPass = false
		this._currentTik = 0

		//if(Global._selectedTailor)
		//log('selected = ' + Global._selectedTailor._maxLen)

		for(i=0; i < Global._tailorsArr.length; i++)
		{
			tailorG = Global._tailorsArr[i]

			tailor = new Tailor()
			tailor._id = tailorG._id
			tailor._maxLen = tailorG._maxLen
			tailor._lenCurrent = tailorG._lenCurrent

			tailor._totalResult = 0;
			tailor._reloadCount = 0;
			tailor._totalWait = 0;
			tailor._step = 1;
			tailor._reloadStep = 0
			tailor._currentState = 'w';


			this._tailorsArr.push(tailor)
		}



		//-- пока простая очередь
		for(i=0; i < this._tailorsArr.length; i++)
		{
			tailor = this._tailorsArr[i]

			this._qArr.push(this._tailorsArr[i]._id)
		}

		this._currentReloadId = 0;// this._qArr[0]; //-- текущий на перезагрузке
		this._nextReloadId = this._qArr[0];  //-- id следующий в очереди на релоад
		this._reloadSecStep = 1;  //-- тут накапливаем тики для текущего релоада
		this._reloadCurrentIndex = 0;  //-- текущий индекс портного в очереди на перезагрузку
		this._reloadSec = Tailors._levelSettings.timeReloadInSec
		//this._maxTailorTotalResult = 0
	}

	calcFullSolution()
	{
		//log('calcFullSolution Global._currentTik=' + Global._currentTik + ' ss=' + Tailors._levelSettings.timeInSec)


		let tailor, tailorG
		let i


		this.prepareForStart()


		for(i = 0; i < Tailors._levelSettings.timeInSec; i++ )
		{
			this.calcNextTik()
			LogHelper.tikToLog(this)
		}


		//-- делаем результат

		let totalLenResult = 0;
		let totalReloads = 0;
		let totalWaits = 0;

		for(i=0; i < this._tailorsArr.length; i++)
		{
			tailor = this._tailorsArr[i]

			totalLenResult = totalLenResult + tailor._totalResult;
			totalReloads = totalReloads + tailor._reloadCount;
			totalWaits = totalWaits + tailor._totalWait;

			/*
			if(this._maxTailorTotalResult < tailor._totalResult)
			{
				this._maxTailorTotalResult = tailor._totalResult
			}
			*/
		}

		let solution = new Solution()
		solution._tailorsCount = this._tailorsArr.length
		solution._totalReloads = totalReloads
		solution._totalLenResult = totalLenResult

		solution._tailorsArr = this._tailorsArr

		return solution
	}

	calcNextTik(){
		this._currentTik++
		this.calcTik(this._currentTik)
	}

	calcTik(tik)
	{
		//log('calcTik='+ tik)

		let i, tailor
		let canReload = true; //-- можно ли делать релоад новому портному в этом Тике
		this._princessState = ''

		this._currentReloadId = 0

		//log('11111   _currentReloadId='+ this._currentReloadId + ' this._nextReloadId=' + this._nextReloadId)

		for(i = 0; i < this._tailorsArr.length; i++)
		{
			tailor = this._tailorsArr[i]


			if(tailor._lenCurrent > 0)
			{
				//-- идет процесс стежка

				if(tailor._step == tailor._lenCurrent)
				{
					tailor._lenCurrent--;
					tailor._totalResult++;
					tailor._step = 1;
					tailor._currentState = '+'; //--завершение стежка
				}
				else
				{
					tailor._step++;
					tailor._currentState = '-';  //-- протягивает нить
				}

				//-- если его очередь на Релоад, а релоад ему не нужен, то двигаем к следующему

				if((this._nextReloadId == tailor._id) && canReload)
				{
					if(tailor._reloadStep > 0)
					{
						this._currentReloadId = this._nextReloadId
						this.setNextReloadId() //-- this._nextReloadId
						this._princessState = 'run'
						tailor._reloadStep = 0
					}
					else{
						//-- принцесса бежит к нему
						tailor._reloadStep++
						this._princessState = 'run'
						this._currentReloadId = 0
					}

					canReload = false; //-- запрет всем остальным делать релоад в этом цикле

					this._princessLastPass = true
					//log('NNNNNNNNNNN 1')
				}
				else{
					//this._princessLastPass = false
					//log('NNNNNNNNNNN 3')
				}
			}
			else
			{
				//-- это ожидающие или на перезагрузке

				if((this._nextReloadId == tailor._id) && canReload)
				{
					//-- это его очередь на перевдевание
					//-- но может быть принцесса к нему еще не подошла



					/*
					if(this._reloadSecStep < this._reloadSec)
					{
						//-- идет цикл перевдевания длинной в _reloadSec
						this._reloadSecStep++;
						tailor._currentState = 'R';
					}
					else
					*/
					{
						//-- окончание перевдевания (завершающий шаг)




						//-- принцесса ждет 1 такт на релоаде
						//-- либо она уже тут пробежав мимо предыдущего
						if(tailor._reloadStep > 0 || this._princessLastPass)
						{
							this._currentReloadId = this._nextReloadId
							this._princessState = 'reload'
							canReload = false; //-- запрет всем остальным делать релоад в этом цикле

							tailor._lenCurrent = tailor._maxLen;
							tailor._reloadCount++;
							tailor._currentState = '@';


							this._reloadSecStep = 1;

							//-- назначаем следующего по очереди на Релоад
							//-- пропуская тех, у которых еще есть запас

							//-- назначаем следующего на перезагрузку
							//this._nextReloadId = 0;

							this.setNextReloadId() //-- this._nextReloadId
							tailor._reloadStep = 0
							//log('NNNNNNNNNNN 2')
							this._princessLastPass = false
						}
						else{
							//-- принцесса бежит к нему
							tailor._reloadStep++
							this._princessState = 'run'
							this._currentReloadId = 0
						}


					}
				}
				else
				{
					//-- ожидание очереди на перевдевание

					tailor._totalWait++;
					tailor._currentState = 'w';
				}


			}
		}

		//log('222222 _currentReloadId='+ this._currentReloadId + ' this._nextReloadId=' + this._nextReloadId)
	}

	setNextReloadId()
	{
		if(this._reloadCurrentIndex < this._qArr.length-1)
		{
			this._reloadCurrentIndex++;

		}
		else{
			this._reloadCurrentIndex = 0;
		}


		this._nextReloadId = this._qArr[this._reloadCurrentIndex];
	}

	calcToTik(newStep)
	{
		let tik
		this.prepareForStart()

		for(tik=0; tik < newStep; tik++)
		{
			this._currentTik++
			this.calcTik(this._currentTik)
		}
	}
}

function log(s){
	console.log(s);
}