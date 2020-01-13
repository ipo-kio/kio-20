
import { State } from './State.js'
import { Tailor } from './Tailor.js'
import { Global } from './Global.js'

export class DrawHelper
{
	static _kioapi
	static _stageBottom
	static _stageTop
	static BGCOLOR_KARTA = 'gray'

	static drawTik()
	{
		log('ddddddddd - ' + State._tik);
		let i;
		let tailor;


		for(i=0; i < State._tailorArr.length; i++)
		{
			tailor = State._tailorArr[i];
		}


		DrawHelper._stageTop.update()
	}

	static tailorPlus(tailorId, tailorNumber)
	{
		let tailorConteiner = new createjs.Container()
		tailorConteiner.name = 'tailor_' + tailorId;

		tailorConteiner.on('click', function (event) {
			Global.tailorClick(tailorId)
		})
/*
		let img = DrawHelper._kioapi.getResource('tailor');
		let shape = new createjs.Shape()
		shape.name = 'tailor_' + tailorId
		shape.x = 50  + ( 30 * tailorNumber)
		shape.y = 50  + ( 30 * tailorNumber)
		shape.graphics.beginBitmapFill(img, "no-repeat");
		shape.graphics.drawRect(0, 0, 30, 30)
		shape.graphics.endFill()



		tailorConteiner.addChild(shape);
*/



		DrawHelper._stageTop.addChild(tailorConteiner)
	}

	static resetAll()
	{
		DrawHelper._stageBottom.update()
		DrawHelper._stageTop.clear()
		DrawHelper._stageTop.update()

		log('prepareAll');
	}
}

function log(s){
	console.log(s);
}