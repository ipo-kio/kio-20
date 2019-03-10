export class Road 
{
    _crossId1;
    _crossId2;
    _id;
    _isBlocked;
    _vh;
    _X;
    _Y;
    x;
    y;

    constructor(roadId, crossId1, crossId2, vh, X, Y, x, y) 
    {      
        this._id = roadId;
        this._crossId1 = crossId1;
        this._crossId2 = crossId2;
        this._vh = vh;
        this._X = X;
        this._Y = Y;
        this.x = x;
        this.y = y;
    }

}