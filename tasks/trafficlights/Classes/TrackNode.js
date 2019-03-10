export class TrackNode 
{
    _road;
    _crossId1  //-- первый перекресток, начало дороги
    _crossId2; //-- второй перекресток, куда едем
    //_crossIdList = '';
    _roadIds = []; //-- айдишники дорог от начала до конца
    _roadIdList = '';
    _trackDic = {};
    _result;
    _fullTikCount;
    _thisTikCount;
    _direct;
    _parentRoadId;
    _fullWaitCount;
    _fullStopCount = 0;


    constructor(road, parentTrackNode, thisTikCount, globalStartCrossId, LB)
    {
        this._road = road;
        this._thisTikCount = thisTikCount;


        if (parentTrackNode != null)
        {
            //this._crossIdList = parentTrackNode._crossIdList + road._crossId1 + ',' + road._crossId2 + ',' ;
            this._roadIdList = parentTrackNode._roadIdList + road._id + ',' ;
            this._trackDic = TrackNode.copy_assoc(parentTrackNode._trackDic);
            this._fullTikCount = parentTrackNode._fullTikCount + thisTikCount;
            this._fullWaitCount = parentTrackNode._fullWaitCount + thisTikCount - 1;
            this._fullStopCount = parentTrackNode._fullStopCount;
            this._roadIds = parentTrackNode._roadIds.slice();
            this._roadIds.push(road._id);


            if(thisTikCount > 1)
            {
                this._fullStopCount++;
            }

            this._fullPointCount = parentTrackNode._fullPointCount;


            
            
            let parentRoad = parentTrackNode._road;

            this._parentRoadId = parentRoad._id;


            //-- crossId1 - начальный перекресток  crossId2 - конечный перекресток

            if (parentTrackNode._crossId2 == road._crossId2) 
            {
                this._crossId2 = road._crossId1; 
                this._crossId1 = road._crossId2;
            }
            else {
                this._crossId2 = road._crossId2;
                this._crossId1 = road._crossId1;
            }

           

            if(parentRoad._X == road._X)
            {
                if(parentRoad._Y == road._Y)
                {
                    if(road._vh == 'v')
                    {
                        this._direct = 'T';
                    }
                    else{
                        this._direct = 'R';
                    }                  
                }
                else
                {
                    if(parentRoad._Y < road._Y)
                    {
                        if(road._vh == 'h')
                        {
                            this._direct = 'R';
                        }
                        else{
                            this._direct = 'T';
                        }                     
                    }
                    else{
                        this._direct = 'B';
                    }                
                }
            }
            else
            {
                if(parentRoad._Y == road._Y)
                {
                    if(parentRoad._X < road._X)
                    {
                        if(road._vh == 'v')
                        {
                            this._direct = 'T';
                        }
                        else{
                            this._direct = 'R';
                        }   
                    }
                    else{
                        this._direct = 'L';
                    }
                }
                else{
                    if(parentRoad._Y < road._Y)
                    {
                        this._direct = 'L';
                    }
                    else{
                        if(road._vh == 'v')
                        {
                            this._direct = 'B';
                        }
                        else{
                            this._direct = 'R';
                        }
                       
                    }
                }
            }
        }
        else
        {

            //this._crossIdList = ',' + road._crossId1 + ',' + road._crossId2 + ',';
            this._roadIdList = ',' + road._id + ',' ;
            this._trackDic = {};          
            this._fullTikCount = thisTikCount;
            this._fullWaitCount = thisTikCount - 1;
            this._fullStopCount = 0;
            this._fullPointCount = 0;
            this._roadIds.push(road._id);

            if (road._crossId1 == globalStartCrossId)
            {
                this._crossId1 = road._crossId1;
                this._crossId2 = road._crossId2;
            }
            else{
                this._crossId1 = road._crossId2;
                this._crossId2 = road._crossId1;
            }



            if(road._vh == 'h')
            {
                if(LB == 'L')
                {
                    this._direct = 'L';
                }
                else{
                    this._direct = 'R';
                }
                
            }
            else{
                if(LB == 'B')
                {
                    this._direct = 'B';
                }
                else{
                    this._direct = 'T';
                }
            }

        }

        this._trackDic[road._id] =  this;

    }

    static copy_assoc(arr) 
    {
        var out = [];

        for (var key in arr) {
            if (!arr.hasOwnProperty(key)) {
                continue;
            }

            out[key] = arr[key];
        }

        return out;
    }
}