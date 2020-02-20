import { Global } from './Global.js'
import { InterfaceHelper } from "./InterfaceHelper.js"
import { TailorHelper } from './TailorHelper.js'

export class Tanimate
{
	ctx
	nn
	X0
	N = 1


	static drawNit(finishStep){

		let canvasBot = document.getElementById('canvas_bot')
		let ctxBot = canvasBot.getContext('2d');
		ctxBot.clearRect(0, 0, canvasBot.width, canvasBot.height);
		let n, j, x, lastY, x1, y1, mm, n1
		let p = Global._drawProcess;
		let i, tailor, totalResH
		let nitYstart = 130;
		let steLen = 10   //-- длина стежка в пикселях
		let tailorPng

		for(i = 0; i < p._tailorsArr.length; i++)
		{
			tailor = p._tailorsArr[i]

			if(tailor._currentState == 'R' || tailor._currentState == '@')
			{
				if(Global._moveNitStep < 6)
				{
					tailorPng = 'tailor_r0';
				}
				else{
					tailorPng = 'tailor_r2';
				}

				TailorHelper.drawTailor(tailor._id, tailorPng, i+1)
			}
			else if(tailor._currentState == '-')
			{
				tailorPng = 'tailor_m1-' + Global._moveNitStep ;

				TailorHelper.drawTailor(tailor._id, tailorPng, i+1)
			}
			else if(tailor._currentState == '+')
			{
				tailorPng = 'tailor_1';

				TailorHelper.drawTailor(tailor._id, tailorPng, i+1)
			}



			totalResH = tailor._totalResult * steLen //+ 50
			x = InterfaceHelper._tailorsLeft + (i)* 134
			lastY = nitYstart;

			//-- готовые стежки
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 10;
				ctxBot.strokeStyle = "silver";
				ctxBot.moveTo(x, nitYstart)
				ctxBot.lineTo(x, totalResH + nitYstart)
				ctxBot.stroke();
				ctxBot.closePath();

				ctxBot.beginPath();
				ctxBot.lineWidth = 2;
				ctxBot.strokeStyle = "#918951";
				ctxBot.moveTo(x, nitYstart)
				ctxBot.lineTo(x, totalResH + nitYstart)
				ctxBot.stroke();
				ctxBot.closePath();
			}

			//-- отметки стежков
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 2;
				ctxBot.strokeStyle = "black";

				if(tailor._totalResult > 0)
				{
					for (j = 0; j <= tailor._totalResult; j++)
					{
						lastY = (j*steLen) + nitYstart

						ctxBot.moveTo(x-2, lastY)
						ctxBot.lineTo(x+2, lastY)

					}
					//-- будущяя дырка от стежка
					//ctxBot.moveTo(x-2, lastY)
					//ctxBot.lineTo(x+2, lastY)
				}

				ctxBot.stroke();
				ctxBot.closePath();
			}

			if(tailor._totalResult % 2 == 0){
				mm  = -1
			}
			else{
				mm = 1
			}


			ctxBot.beginPath();
			ctxBot.lineWidth = 3;

			if(finishStep)
			{
				//log('drawNit -- finishStep')
				ctxBot.strokeStyle = "red";
			}
			else{
				//log('drawNit -- ')
				ctxBot.strokeStyle = "red";
			}

			//-- петля остатка


			n = ((tailor._lenCurrent-tailor._step+1)* steLen/2)
			//-- координата петли остатка
			x1 = x-(n * mm)
			//x1 = x;
			y1 = lastY + steLen/2  // ((tailor._lenCurrent-tailor._step-1)*5)




			if(!finishStep)
			{
				if(tailor._currentState == '-' || tailor._currentState == '+')
				{
					x1 = x1 + ((Global._moveNitStep/2) * mm)
				}

			}
			else{
				//log('fffffffffffffff')
			}

			//log('x1=' + x1 + ' Global._moveNitStep=' + Global._moveNitStep + ' step=' + tailor._step + ' n=' + n)

			if(tailor._lenCurrent > 0 || tailor._step > 1)
			{
				Tanimate.drawCurve(ctxBot, x, lastY, mm, tailor._lenCurrent, steLen, tailor._step, tailor._currentState)
			}

			ctxBot.stroke();
			ctxBot.closePath();

			ctxBot.beginPath();
			ctxBot.lineWidth = 3;
			ctxBot.strokeStyle = "red";

			if(tailor._currentState == '-' || tailor._currentState == '+')
			{
				{

					//-- петля продернутая
					Tanimate.drawFree(ctxBot, x, lastY + steLen, tailor._step, steLen, tailor._totalResult, tailor._lenCurrent, tailor._currentState);

					//Tanimate.bbb(ctxBot, x, lastY + 10, tailor._step, tailor._lenCurrent, tailor._totalResult, steLen, finishStep)
				}
			}
			else{
				//log(tailor._currentState)
			}


			ctxBot.stroke();
			ctxBot.closePath();




			//-- длина нити _totalResult
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 1;
				ctxBot.fillStyle = 'blue';
				ctxBot.font = 'bold 20px Arial';
				ctxBot.fillText(tailor._totalResult, x + 15 , nitYstart + 20 )
				ctxBot.stroke();
				ctxBot.closePath();
			}
		}
	}

	static drawCurve(ctx, xStart, yStart, mm, lenCurrent, steLen, step, currentState)
	{
		let moveNitStep1

		if(currentState == '-' || currentState == '++++')
		{
			moveNitStep1 = Global._moveNitStep
		}
		else{
			moveNitStep1 = 0
		}

		let n, x


		let lineLen = ((lenCurrent-step)/2 ) * steLen

		if(lenCurrent % 2 == 0){
			lineLen = lineLen - 1
		}

		if(lineLen < 0)
		{
			lineLen = 0
		}

		//-- верхняя прямая часть петли

		if(moveNitStep1 == 0){
			n = (lineLen)* (-mm)
		}
		else{
			n = (lineLen * (-mm) + (moveNitStep1/2)* (mm))
		}

		x = xStart + n

		//log('lineLen=' + lineLen + ' step='+ step + ' x=' + x + ' Global._moveNitStep=' + moveNitStep1 + ' m='+ mm + ' xStart=' + xStart + ' n=' + n)

		if(mm < 0 && x > xStart)
		{
			ctx.moveTo(xStart, yStart)
			ctx.lineTo( x, yStart)
			//-- нижняя прямая
			ctx.moveTo(xStart, yStart + steLen)
			ctx.lineTo(x, yStart + steLen)

			ctx.moveTo(x, yStart)
			ctx.arc(x, yStart + steLen/2 , steLen/2, -Math.PI/2, Math.PI/2, (mm > 0));
		}
		else
		{
			if(mm > 0 && x < xStart)
			{
				ctx.moveTo(xStart, yStart)
				ctx.lineTo( x, yStart)
				//-- нижняя прямая
				ctx.moveTo(xStart, yStart + steLen)
				ctx.lineTo(x, yStart + steLen)

				ctx.moveTo(x, yStart)
				ctx.arc(x, yStart + steLen/2 , steLen/2, -Math.PI/2, Math.PI/2, (mm > 0));
			}
			else
			{
				//log('cccccccccccccccc x=' )
				ctx.moveTo(x, yStart)

				if(step == lenCurrent){
					if(moveNitStep1 == 0)
					{
						ctx.lineTo(x, yStart + steLen)
					}
					else{
						//log('dddddddddddddd')
						//ctx.arc(x-Global._moveNitStep , yStart + steLen/2 , steLen/2, -Math.PI/2 + Math.PI/2/10*Global._moveNitStep, Math.PI/2 - Math.PI/2/10*Global._moveNitStep, (mm > 0));
						ctx.moveTo(xStart, yStart)
						ctx.lineTo(xStart, yStart + steLen)
					}
				}
				else{
					if(moveNitStep1 == 0){
						ctx.arc(x, yStart + steLen/2 , steLen/2, -Math.PI/2, Math.PI/2, (mm > 0));
					}
					else{
						//log('fffffffff')
						ctx.moveTo(xStart, yStart)
						ctx.lineTo(xStart, yStart + steLen)
						//ctx.arc(x, yStart + steLen/2 , steLen/2, -Math.PI/2, Math.PI/2, (mm > 0));
					}
				}



			}
		}
	}


	static drawFree(ctx, xStart, yStart, step, steLen, totalResult, lenCurrent, currentState)
	{
		if(step == 1) return;
		let p, n, mm , mm1, n1, x, st, xLast, yLast;

		let moveNitStep1

		if(currentState == '-' || currentState == '+')
		{
			moveNitStep1 = Global._moveNitStep
		}
		else{
			moveNitStep1 = 0
		}


		if(totalResult % 2 == 0){
			mm  = -1
		}
		else{
			mm = 1
		}

		//-- step это длина продернутой нити

		let stepLine = Math.trunc(lenCurrent/2)  //-- это номера шагов для верхней прямой. От 0 до stepLine

		if(lenCurrent % 2 == 0){
			stepLine = stepLine - 1
		}


		//log('stepLine=' + stepLine + ' step=' + step)

		ctx.moveTo(xStart, yStart);

		xLast = xStart
		yLast = yStart;

		//-- прорисовываем каждый предыдущий степ кроме последнего
		for(st = 2; st < step; st++)
		{

			//log('st=' + st +  ' lastX=' + xLast)


			if(st <= stepLine + 1)
			{
				//-- верхняя прямая часть петли

				//n = (steLen*(step - (1 - Global._moveNitStep*0.1))) * mm
				x = (xLast + (steLen)* mm)


				//log('111111 stepLine=' + stepLine + ' x=' + x)

				ctx.lineTo(x, yStart);

				xLast = x
			}
			else if(st > stepLine+2)
			{
				//-- нижняя прямая часть петли
				yLast = yStart + steLen

				if(mm > 0){
					x = (xStart + (steLen*stepLine -  (st-stepLine-1)*steLen) *  mm)
				}
				else{
					x = (xStart + (steLen*stepLine -  (st-stepLine-2)*steLen) *  mm)
				}


				ctx.lineTo(x, yLast);

				//log('222222 stepLine=' + stepLine+ ' x=' + x)

				xLast = x
			}
			else{
				//-- это закругление

				Tanimate.drawNitArc(ctx, xLast, yStart, steLen, false, mm)

				ctx.moveTo(xLast, yLast + steLen);

				//log('zzzzz stepLine=' + stepLine+ ' x=' + x)
			}
		}

		//-- рисуем последний степ

		let dd = false

		if(step <= stepLine+1)
		{
			if(moveNitStep1 == 0){
				x = (xStart + steLen*(step-1)* mm)
			}
			else{
				x = (xLast  + (( moveNitStep1)* mm))
			}

			//log('aa=' + x)

			ctx.lineTo(x, yStart);
			xLast = x
		}
		else if(step > stepLine+2)
		{
			//-- нижняя прямая
			yLast = yStart + steLen

			if(moveNitStep1 == 0){
				x = (xStart + (steLen*stepLine -  (step-stepLine-2)*steLen - 0) *  mm)
			}
			else{
				x = (xLast  - (( moveNitStep1)* mm))

				if(x < xStart && mm > 0)
				{
					dd = true
				}
				else if(x > xStart && mm < 0)
				{
					dd = true
				}

				//log('dd='+ x + ' mm=' + mm + ' xLast=' + xLast + ' moveNitStep1=' + moveNitStep1 + ' dd=' + dd)
			}

			if(dd){
				//ctx.lineTo(x, yLast);
			}
			else{
				ctx.lineTo(x, yLast);
			}

			xLast = x
		}
		else{
			Tanimate.drawNitArc(ctx, xLast, yStart, steLen, true, mm)
		}

		//log(x + ' step=' + step +  ' _moveNitStep=' + Global._moveNitStep)
	}

	static drawNitArc(ctx, xLast, yStart, steLen, lastStep, mm)
	{
		let yLast = yStart + steLen/2
		let n

		if(Global._moveNitStep == 0)
		{
			n = Math.PI/2
		}
		else{
			if(lastStep){


				if(mm > 0){
					n = -Math.PI/2 + (((Math.PI/2)/10) * Global._moveNitStep)
				}
				else{
					n = -Math.PI/2 - (((Math.PI/2)/10) * Global._moveNitStep)
				}

			}
			else{
				n = Math.PI/2
			}


		}

		//if(lastStep)log('Global._moveNitStep=' + Global._moveNitStep + ' n=' + n + ' mm=' + mm)


		ctx.arc(xLast, yLast , steLen/2, -Math.PI/2, n, (mm < 0));
	}

}


function log(s){
	console.log(s);
}