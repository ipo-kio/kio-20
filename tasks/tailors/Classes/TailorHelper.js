import { Tailors } from "../tailors.js"
import { Tailor } from './Tailor.js'
import { Global } from './Global.js'


export class TailorHelper
{
	static createTailorDiv(tailor)
	{
		//log('createTailorDiv id=' + tailor._id)
		let div

		let tailorDiv = document.createElement('div')
		tailorDiv.innerHTML = ''
		tailorDiv.id = 'tailor_div_' + tailor._id
		tailorDiv.setAttribute('tailor_id', tailor._id)
		tailorDiv.className = 'tailor_div'

		tailorDiv.onclick = function(e){
			Global.tailorClick(tailorDiv.id, e)
		}

		let canvasTop = document.createElement('canvas')
		canvasTop.width = 80
		canvasTop.height = 80
		canvasTop.id = 'tailor_canvas_top_' + tailor._id
		canvasTop.className = 'canvas_top'
		tailorDiv.appendChild(canvasTop)

		var ctx = canvasTop.getContext('2d');
		let img1 = Tailors.kioapi.getResource('tailor_w')
		ctx.drawImage(img1, 2, 2, 80, 80);



		//------ MaxLen --
		{
			div = document.createElement('div')
			div.innerHTML = tailor._maxLen
			div.width = 20
			div.height = 20
			div.id = 'tailor_maxlen_' + tailor._id
			div.className = 'tailor_maxlen_div'
			div.title = 'Длина нити'
			tailorDiv.appendChild(div)
		}

		//------ currentLen --
		{
			div = document.createElement('div')
			div.innerHTML = '0'
			div.width = 20
			div.height = 20
			div.id = 'tailor_lencurrent_' + tailor._id
			div.className = 'tailor_lencurrent_div'
			div.title = 'Остаток нити'
			tailorDiv.appendChild(div)
		}

		//------ total res --
		{
			div = document.createElement('div')
			div.innerHTML = '0'
			div.width = 20
			div.height = 20
			div.id = 'tailor_total_' + tailor._id
			div.className = 'tailor_total_div'
			div.title = 'Текущий результат'
			tailorDiv.appendChild(div)
		}

		//------ close --
		{
			div = document.createElement('div')
			div.innerHTML = '&#215;'
			div.width = 10
			div.height = 10
			div.id = 'tailor_close_' + tailor._id
			div.className = 'tailor_close_div'
			div.title = 'Удалить'
			div.onclick = function(e){
				Global.tailorDelClick(tailor._id, e)
			}
			tailorDiv.appendChild(div)
		}


		Tailors._tailorsDiv.appendChild(tailorDiv)
	}



	static redrawTailors()
	{
		let i, tailor
		let canvas, ctx



		for(i=0; i < Global._tailorsArr.length; i++)
		{
			tailor = Global._tailorsArr[i]
/*
			canvas = document.getElementById('tailor_canvas_top_' + tailor._id)
			ctx = canvas.getContext('2d');
			TailorHelper.drawNumber(ctx, canvas, i+1)
*/
			TailorHelper.drawTailor(tailor._id, 'tailor_w', i+1)

		}

	}

	static drawTailor(tailorId, tailorPng, num)
	{
		let canvasT = document.getElementById('tailor_canvas_top_' + tailorId)
		let ctx = canvasT.getContext('2d');
		ctx.clearRect(0, 0, canvasT.width, canvasT.height);
		let img1 = Tailors.kioapi.getResource(tailorPng)
		ctx.drawImage(img1, 2, 2, 80, 80);

		//-- number

		let tx = 10
		let ty = 26

		if(num > 9){
			//tx = 15
		}

		ctx.beginPath();
		ctx.strokeStyle = "green";
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;
		ctx.font = "8pt Arial";
		ctx.fillText(num, tx, ty);
		ctx.stroke();
		ctx.closePath();
	}
/*
	static drawNumber(ctx, canvas, num)
	{




		ctx.beginPath();
		//ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = "green";
		ctx.fillStyle = "black";
		ctx.lineWidth = 1;
		ctx.font = "8pt Arial";
		//ctx.clearRect(tx, ty, 15, 15 - 8);
		ctx.fillText(num, tx, ty);
		ctx.stroke();
		ctx.closePath();
	}
*/
}

function log(s){
	console.log(s);
}