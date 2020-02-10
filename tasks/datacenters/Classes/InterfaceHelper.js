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
			superDiv.id = 'super_div'
			superDiv.className = 'super_div'

			domNode.appendChild(superDiv)

			let canvasContDiv = document.createElement('div')
			canvasContDiv.innerHTML = ''
			canvasContDiv.setAttribute('style', 'background-image: url("./datacenters-resources/bg.jpg");')
			canvasContDiv.id = 'canvasContDiv'
			canvasContDiv.className = 'canvas_cont_div'
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

		//createjs.Ticker.on("tick", Global.tick);
		//createjs.Ticker.interval = 1000;
		//createjs.Ticker.framerate = 1000;

		//Config.setLevelData(Datacenters._level)

		let i, dc, dc1, dc2, dcObj, rel;

		let levelData = Config.getLevelData()

		//log(levelData)

		Global._dcDic = levelData._dcDic
		Global._relArr = levelData._relArr


		let x1, x2, y1, y2, a, b,c
		let line, relName

		for(i=0; i < Global._relArr.length; i++)
		{
			rel = Global._relArr[i]
			//log(rel._dc1Name)

			//dc1 = Global._stageTop.getChildByName(rel._dc1Name + '_cont')
			//dc2 = Global._stageTop.getChildByName(rel._dc2Name + '_cont')

			dc1 = levelData._dcDic[rel._dc1Name]
			dc2 = levelData._dcDic[rel._dc2Name]



			//log('x1=' + dc1.x)
			//log('x2=' + dc2.x)

			line = new createjs.Shape();
			Global._stageTop.addChild(line)
			line.graphics.setStrokeStyle(3).beginStroke("brown");

			line.graphics.moveTo(dc1._x, dc1._y);
			line.graphics.lineTo(dc2._x, dc2._y);

			line.graphics.endStroke();

			//-- строим обозначение длинн линий



			a = Math.abs(dc1._x - dc2._x)
			b = Math.abs(dc1._y - dc2._y)
			c = Math.round(Math.sqrt((a*a) + (b*b)))

			//log(rel._dc1Name + '-' + rel._dc2Name + '=' + c)


			rel._len = c

			let text = new createjs.Text(c, "14px Arial", "blue");
			if(dc1._x < dc2._x)
			{
				text.x = dc1._x + a/2
			}
			else
			{
				text.x = dc1._x - a/2
			}

			if(dc1._y < dc2._y){
				text.y = dc1._y + b/2
			}
			else{
				text.y = dc1._y - b/2
			}

			var shape = new createjs.Shape();
			shape.name = rel._name
			shape.graphics.append({exec: Global.setLenColor});
			shape.fillCmd = shape.graphics.beginFill("white").command;
			//shape.graphics.beginFill("white").beginStroke(1).setStrokeStyle('black').drawRect(0, 0, 32, 20);

			if(c > 999){
				x1 = 40
			}
			else{
				x1 = 32
			}

			shape.graphics.beginStroke(1).setStrokeStyle('black').drawRect(0, 0, x1, 20);
			//shape.graphics.endFill()
			shape.graphics.endStroke()

			shape.x = text.x - 4
			shape.y = text.y - 4
			Global._stageTop.addChild(shape)


			Global._stageTop.addChild(text)

		}

		i = 0

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
					Global.clickDC(this.name)
				  })
			}

			dc1 = new createjs.Shape()
			dc1.name = dcObj._name
			dc1.graphics.append({exec: Global.setPoweredState});
			dc1.strokeCmd = dc1.graphics.beginStroke("white").command;
			dc1.fillCmd = dc1.graphics.beginFill("white").command;
			dc1.graphics.drawCircle(0, 0, 15)
			//dc1.graphics.endFill()
			dc1.alpha = 1;
			dc1.x = 0
			dc1.y = 0



			dc.addChild(dc1)
			let text = new createjs.Text(i, "14px Arial", "yellow");
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