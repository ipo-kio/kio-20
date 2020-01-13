export class Tailor
{
	_id;
	_maxLen = 1 //-- полная длина нити
	_lenCurrent = 0
	_step = 1
	_currentState
	_totalWait
	_reloadCount
	_totalResult
	_reloadStep  //-- количество текущих ожиданий на перезагрузке
}