import { Datacenters } from "../datacenters.js"
import { Global } from "./Global.js"
import { Config } from "./Config.js"
import { LevelData } from "./LevelData.js"
import { DataCenter } from "./DataCenter.js"

export class InterfaceHelper
{
	static create(domNode, preferred_width){

		let btn, div, div1, t, tbody, divR, canvas
		let cellTopLeft, cellTopRight, row, cell
		let superDiv, topDiv

		//-- Полный див
		{
			superDiv = document.createElement('div')
			superDiv.id = 'super_div_dc'
			superDiv.className = 'super_div_dc'

			domNode.appendChild(superDiv)

			let canvasContDiv = document.createElement('div')
			canvasContDiv.innerHTML = ''
			canvasContDiv.id = 'canvasContDiv'
			canvasContDiv.className = 'canvas_cont_div'
			canvasContDiv.style.backgroundPositionX = '-180px';
			canvasContDiv.classList.add('datacenters-task')
			superDiv.appendChild(canvasContDiv)


			Global._canvasTop = document.createElement('canvas')
			Global._canvasTop.width = 1800
			Global._canvasTop.height = 500
			//Global._canvasTop.className = 'canvas_top'
			canvasContDiv.appendChild(Global._canvasTop)
		}
	}


	static prepareAll(){


		log('prepareAll()')
		Global._stageTop = new createjs.Stage(Global._canvasTop)
		//Global._stageTop.removeAllEventListeners();
		Global._stageTop.enableMouseOver();

		createjs.Ticker.on("tick", Global.tick);
		createjs.Ticker.interval = 600;
		//createjs.Ticker.framerate = 1000;

		//Config.setLevelData(Datacenters._level)

		let i, dc, dc1, dc2, dcObj, rel;

		let levelData = Config.getLevelData()
		Global._dcDic = levelData._dcDic
		Global._relArr = levelData._relArr

		let x1, x2, y1, y2, a, b,c
		let line, relName



		for(i=0; i < Global._relArr.length; i++)
		{
			rel = Global._relArr[i]

			dc1 = levelData._dcDic[rel._dc1Name]
			dc2 = levelData._dcDic[rel._dc2Name]

			line = new createjs.Shape();
			line.name = rel._name
			Global._stageTop.addChild(line)
			line.graphics.setStrokeStyle(3).beginStroke("brown");
			line.fillCmd = line.graphics.beginFill("brown").command;
			line.strokeCmd = line.graphics.beginStroke("brown").command;
			line.dotCmd = line.graphics.setStrokeDash([2,2]).command;
			//line.graphics.setStrokeDash([6,2])

			line.graphics.moveTo(dc1._x, dc1._y);
			line.graphics.lineTo(dc2._x, dc2._y);

			line.graphics.endStroke();

			//-- строим обозначение длинн линий



			a = Math.abs(dc1._x - dc2._x)
			b = Math.abs(dc1._y - dc2._y)
			c = Math.round(Math.sqrt((a*a) + (b*b)))

			rel._len = c

			let text = new createjs.Text(c, "italic bold 12pt Verdana", "blue");
			text.name = rel._name + '_text'
			//text.strokeCmd = text.graphics.beginStroke("black").command;
			if(dc1._x < dc2._x)
			{
				text.x = dc1._x + a/2 - 20
			}
			else
			{
				text.x = dc1._x - a/2 - 20
			}

			if(dc1._y < dc2._y){
				text.y = dc1._y + b/2
			}
			else{
				text.y = dc1._y - b/2
			}


			//Можно попробовать рисовать текст не на прямоугольниках, они очень явные, а сам по себе. Чтобы было контрастно, делать fillText,
			//белым а потом сразу strokeText черным.


			var shape = new createjs.Shape();
			shape.name = rel._name
			shape.graphics.append({exec: Global.setLenColor});
			shape.fillCmd = shape.graphics.beginFill("white").command;
			//shape.strokeCmd = shape.graphics.beginStroke("black").command;
			//shape.graphics.beginFill("white").beginStroke(1).setStrokeStyle('black').drawRect(0, 0, 32, 20);

			if(c > 999){
				x1 = 60
			}
			else{
				x1 = 42
			}

			//shape.graphics.beginStroke(1).setStrokeStyle('black').drawRect(0, 0, x1, 20);
			//shape.graphics.drawRect(0, 0, x1, 20);
			shape.graphics.drawRoundRectComplex (0, 0, x1, 20, 4,4,4,4)
			//shape.graphics.endFill()
			//shape.graphics.endStroke()


			if(rel._len < 100)
			{
				shape.x = text.x - 8
			}
			else{
				shape.x = text.x - 4
			}


			shape.y = text.y - 3
			Global._stageTop.addChild(shape)


			Global._stageTop.addChild(text)

		}

		i = 0
		let image

		for (var name in levelData._dcDic)
		{
			i++
			dcObj = levelData._dcDic[name];

			dc = new createjs.Container()
			dc.name = dcObj._name + '_cont'
			dc.dcName = dcObj._name
			dc.x = dcObj._x
			dc.y = dcObj._y
			dc.cursor = "pointer";
			Global._stageTop.addChild(dc)

			if(Global._ggg == 0){
				dc.on('click', function (event) {
					log('ccc')
					Global.clickDC(this.name)
				  })
			}

			dc1 = new createjs.Shape()
			dc1.name = dcObj._name
			dc1.graphics.append({exec: Global.setPoweredState});
			dc1.strokeCmd = dc1.graphics.beginStroke("black").command;
			dc1.fillCmd = dc1.graphics.beginFill("white").command;


			dc1.alpha = 1;
			dc1.x = 0
			dc1.y = 0

			dc.addChild(dc1)

			image = new createjs.Bitmap(Datacenters.kioapi.getResource('dc_sel'));
			image.visible = false;
			image.dcname = dc1.name
			image.name = dcObj._name + '_img_sel'
			image.scaleX=0.6
			image.scaleY=0.6
			image.x = -24
			image.y = -22
			dc.addChild(image);

			image = new createjs.Bitmap(Datacenters.kioapi.getResource('dc_red'));
			image.visible = true;
			image.dcname = dc1.name
			image.name = dcObj._name + '_img_red'
			image.scaleX=0.9
			image.scaleY=0.9
			image.x = -22
			image.y = -16
			dc.addChild(image);

			image = new createjs.Bitmap(Datacenters.kioapi.getResource('dc_green'));
			image.visible = true;
			image.dcname = dc1.name
			image.name = dcObj._name + '_img_green'
			image.scaleX=0.8
			image.scaleY=0.8
			image.x = -22
			image.y = -24
			dc.addChild(image);


			let text = new createjs.Text(i, "bold 12pt Verdana", "yellow");
			text.name = dc1.name + '_text'

			if(i > 9){
				text.x = -8
			}
			else{
				text.x = -4
			}
			text.y = -5
			dc.addChild(text);

		}



		Global._ggg = 1
		//Global._stageTop.update()



	}



}

function log(s){
	console.log(s);
}