export class Relay
{
	_dc1Name
	_dc2Name
	_len
	_selected
	_name

	constructor(name1, name2)
	{
		this._dc1Name = name1
		this._dc2Name = name2
		this._len = 0
		this._selected = false
		this._name = name1 + '_' + name2
	}
}