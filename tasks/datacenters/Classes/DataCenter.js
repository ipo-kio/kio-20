
export class DataCenter{
	_name
	_x
	_y
	_selected
	_points2Count

	constructor(name, x, y)
	{
		this._name = name
		this._x = x;
		this._y = y
		this._selected = false
		this._points2Count = 0
	}
}