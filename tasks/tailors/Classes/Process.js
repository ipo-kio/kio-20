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
	 _moveCurrentIndex
	 _reloadSec
	 _qArr = [] //-- очередь на перезагрузку
	 _tailorsArr = []
	 _currentTik = 0
	 _princessState = 'run'
	 _princessLastPass
	 _princessToTailorId = 0  //-- к кому сейчас бежит принцесса
//	 _maxTailorTotalResult = 0  //-- самый длинный результат
	_nextTikAllWait = 0

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
		this._princessToTailorId = 0

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

		this._princessToTailorId = this._nextReloadId  // тот, у кого находится принцесса в этом шаге  = this._nextReloadId
		this._reloadSecStep = 1;  //-- тут накапливаем тики для текущего релоада
		this._reloadCurrentIndex = 0;  //-- текущий индекс портного в очереди на перезагрузку
		this._princessState = 1
		this._moveCurrentIndex = 0 //-- текущий индекс портного, к которому будет двигаться принцесса
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



		}

		let solution = new Solution()
		solution._tailorsCount = this._tailorsArr.length
		solution._totalReloads = totalReloads
		solution._totalLenResult = totalLenResult
		solution._waitCount = totalWaits

		solution._tailorsArr = this._tailorsArr

		return solution
	}

	calcNextTik(){
		this._currentTik++
		this.calcTik(this._currentTik)
	}

	calcTik(tik)
	{
		//--все параметры определяются на конец секундного тика.
		//-- Т.е. определяем состояние портного после завершения тика с этим номером
		let i, tailor
		let canReload = true; //-- можно ли делать релоад новому портному в этом Тике
		if(tik == 1)
		{
			canReload = false
		}

		let canPrincessMoveNext = true  //-- может ли принцесса двигаться к следующему портному
		let canNextReload = false

		for(i = 0; i < this._tailorsArr.length; i++)
		{
			tailor = this._tailorsArr[i]

			if(tailor._lenCurrent > 0)  // --предыдущее значение остатка нити
			{


				if(tailor._step == tailor._lenCurrent)
				{
					tailor._currentState = '+'; //-- завершает стежок
					tailor._totalResult++;
					tailor._step = 1
					tailor._lenCurrent--  // новое значение остатка нити
				}
				else{

					tailor._currentState = '-'; //-- протягивает
					tailor._step++;
				}

				if((this._nextReloadId == tailor._id))
				{
					//this.setNextReloadId()  //-- была его очередь, но ему перезагрузка не требуется
					//-- и принцесса должна пройти мимо не останавливаясь
					canNextReload = true
				}
			}
			else
			{
				//-- это ожидающие или на перезагрузке

				if((this._nextReloadId == tailor._id) && canReload && (this._princessToTailorId ==  tailor._id))
				{

					//if(this._currentReloadId == tailor._id)
					{
						//-- принцесса подошла к нему в прошлом шаге. Перегружаем его
						// и принцесса остается у него
						tailor._lenCurrent = tailor._maxLen;
						tailor._reloadCount++;
						tailor._currentState = '@';

						//this.setNextReloadId()
						canReload = false; //-- запрет всем остальным делать релоад в этом цикле

						canPrincessMoveNext = false
						canNextReload = true
					}
					/*
					else
					{
						//-- принцесса идет к нему, но еще не подошла
						this._currentReloadId = tailor._id
					}
					*/
				}
				else
				{
					tailor._currentState = 'w';
				}
			}


		}


		if(tik == 1){

		}
		else
		{

			if(canNextReload)
			{
				this.setNextReloadId()
			}

			if(canPrincessMoveNext)
			{

				this._princessToTailorId = this.getNextTailorId() //-- это следующий, к кому подойдет принцесса в следующем шаге
				this._princessState =  (this._moveCurrentIndex + 1)
			}
			else{
				this._princessState = '@'
			}

			if(tailor._currentState == 'w'){
				tailor._totalWait++;
			}
		}

		//log('tik='+ tik + ' _princessToTailorId=' + this._princessToTailorId + ' nextReloadId=' + this._nextReloadId)

	}

	calcTik_old(tik)
	{
		//log('calcTik='+ tik)


		if(this._nextTikAllWait == 1){
			this._nextTikAllWait++
		}

		let i, tailor
		let canReload = true; //-- можно ли делать релоад новому портному в этом Тике
		this._princessState = ''
		let reloadOK = false;
		this._currentReloadId = 0
		let princessCanMoveNext = true;



		//log('11111   _currentReloadId='+ this._currentReloadId + ' this._nextReloadId=' + this._nextReloadId + ' this._princessToTailorId=' + this._princessToTailorId)

		for(i = 0; i < this._tailorsArr.length; i++)
		{
			tailor = this._tailorsArr[i]

			log('STEP tailor._id=' + tailor._id + ' st=' + tailor._step + ' l=' + tailor._lenCurrent)

			if(tailor._lenCurrent > 0)
			{
				//-- идет процесс стежка

				//log('STEP T-' + i + ' 111')

				if(tailor._step == tailor._lenCurrent)
				{
					//log('STEP T-' + i + ' 111-1')
					tailor._lenCurrent--;
					tailor._totalResult++;
					tailor._step = 1;
					tailor._currentState = '+'; //--завершение стежка
				}
				else
				{
					//log('STEP T-' + i + ' 111-2')
					tailor._step++;
					tailor._currentState = '-';  //-- протягивает нить
				}


				if(tailor._lenCurrent > 0)
				{
					tailor._currentState = '+';
				}
				else{
					tailor._currentState = '-';
				}

				//-- если его очередь на Релоад, а релоад ему не нужен, то двигаем к следующему

				if((this._nextReloadId == tailor._id) && canReload)
				{
					//log('STEP T-' + i + ' 111-3')
					if(tailor._reloadStep > 0)
					{
						this._currentReloadId = this._nextReloadId
						this._princessState = 'run'
						tailor._reloadStep = 0

						//log('STEP T-' + i + ' 111-4')
						canReload = false; //-- запрет всем остальным делать релоад в этом цикле
					}
					else{
						//-- принцесса бежит к нему
						tailor._reloadStep++
						this._princessState = 'run'
						this._currentReloadId = 0
						//log('STEP T-' + i + ' 111-5')


					}

					if(this._nextReloadId == tailor._id)
					{
						this._nextTikAllWait = 1 // сигнал что в следующем тике все ждут
					}


					this._princessLastPass = true

				}
				else{

					//log('STEP T-' + i + ' 111-6')

				}
			}
			else
			{
				//-- это ожидающие или на перезагрузке

				//log('STEP T-' + i + ' 222 canReload=' + canReload)

				if((this._nextReloadId == tailor._id) && canReload )
				{
					//-- это его очередь на перевдевание
					//-- но может быть принцесса к нему еще не подошла

					//log('STEP T-' + i + ' 222-1')

					if(this. _nextTikAllWait == 0 || this._princessToTailorId == tailor._id)
					{
						//-- окончание перевдевания (завершающий шаг)

						//-- принцесса ждет 1 такт на релоаде
						//-- либо она уже тут пробежав мимо предыдущего
						if(tailor._reloadStep > 0 || this._princessLastPass)
						{
							//log('STEP T-' + i + ' 222-2(@)')
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

							tailor._reloadStep = 0

							this._princessLastPass = false

							princessCanMoveNext = false


							if(this._nextReloadId == tailor._id)
							{
								this._nextTikAllWait = 1 // сигнал что в следующем тике все ждут
							}

						}
						else
						{
							//log('STEP T-' + i + ' 222-3')
							//-- принцесса бежит к нему
							tailor._reloadStep++
							this._princessState = 'run'
							this._currentReloadId = 0
							reloadOK = true;
						}
					}
					else{
						//log('STEP T-' + i + ' 222-5')
						reloadOK = true;
						tailor._reloadStep++
						this._princessState = 'run'
					}
				}
				else
				{
					//-- ожидание очереди на перевдевание


					tailor._currentState = 'w';
					//log('STEP T-' + i + ' 222-4 w=' + tailor._totalWait)
				}
			}

			if(tailor._currentState == 'w'){
				tailor._totalWait++;
			}
		}

		if(princessCanMoveNext && tik > 1)
		{
			this._princessToTailorId = this.getNextTailorId()
		}

		if(!reloadOK && tik > 1)
		{
			//log('reloadOK = FALSE')
			this.setNextReloadId()

		}



		if(this._nextTikAllWait == 1 )
		{
			this._nextTikAllWait++
		}
		else if(this._nextTikAllWait > 1 )
		{
			this._nextTikAllWait = 0
		}



		//log('222222 _currentReloadId='+ this._currentReloadId + ' this._nextReloadId=' + this._nextReloadId + ' pct=' + this._princessState
		//+ ' this._princessToTailorId=' + this._princessToTailorId + ' this. _nextTikAllWait=' + this. _nextTikAllWait)
	}

	setNextReloadId()
	{
		//log('setNextReloadId()')

		if(this._reloadCurrentIndex < this._qArr.length-1)
		{
			this._reloadCurrentIndex++;

		}
		else{
			this._reloadCurrentIndex = 0;
		}


		this._nextReloadId = this._qArr[this._reloadCurrentIndex];
	}


	getNextTailorId()
	{
		//log('getNextTailorId() ')
		if(this._moveCurrentIndex < this._qArr.length-1)
		{
			this._moveCurrentIndex++;

		}
		else{
			this._moveCurrentIndex = 0;
		}

		//log('getNextTailorId() this._moveCurrentIndex=' + this._moveCurrentIndex)

		return this._qArr[this._moveCurrentIndex];
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