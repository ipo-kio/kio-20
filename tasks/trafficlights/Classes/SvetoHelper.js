export class SvetoHelper
{

    static drawSvetOne(svetoCont, W, svetSide, canF, canL, canR)
    {
        //console.log(W + ', svetSide=' + svetSide);
        let svShape;
        let w2 = W / 2; //-- половина общей длинны(ширины)
        let aW = 20; // ширина стрелки
        let aW2 = aW / 2;
        let color;
        let colorS = 'silver';

        if (canF) {
            color = 'green';
        }
        else {
            color = 'red';
        }

        if (svetSide == 'B')  //-- подъезд снизу
        {

            svShape = new createjs.Shape();
            svShape.graphics.beginFill(color);
            svShape.graphics.beginStroke(colorS);
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(w2, w2)
                .lineTo(w2 + aW2, w2 + aW2)
                .lineTo(w2 + aW2, W)
                .lineTo(w2 - aW2, W)
                .lineTo(w2 - aW2, w2 + aW2)
                .lineTo(w2, w2) ;
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);

        }
        else if (svetSide == 'T')
        {
            svShape = new createjs.Shape();
            svShape.graphics.beginFill(color);
            svShape.graphics.beginStroke(colorS);
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(w2, w2)
                .lineTo(w2 + aW2, w2 - aW2)
                .lineTo(w2 + aW2, 0)
                .lineTo(w2 - aW2, 0)
                .lineTo(w2 - aW2, w2 - aW2)
                .lineTo(w2, w2);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);
        }
        else if (svetSide == 'L') {
            svShape = new createjs.Shape();
            svShape.graphics.beginFill(color);
            svShape.graphics.beginStroke(colorS);
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(w2, w2)          
                .lineTo(w2 - aW2, w2 - aW2)
                .lineTo(0, w2 - aW2)
                .lineTo(0, w2 + aW2)
                .lineTo(w2 - aW2, w2 + aW2)
                .lineTo(w2, w2);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);
        }
        else if (svetSide == 'R') {
            svShape = new createjs.Shape();
            svShape.graphics.beginFill(color);
            svShape.graphics.beginStroke(colorS);
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(w2, w2)
                .lineTo(w2 + aW2, w2 - aW2)
                .lineTo(W, w2 - aW2)
                .lineTo(W, w2 + aW2)
                .lineTo(w2 + aW2, w2 + aW2)
                .lineTo(w2, w2);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);
        }
    }
}
    /*
	static drawSvetOne(svetoCont, width, svetSide, canF, canL, canR)
	{
		let svShape;
		let arrW = 6;

		if (svetSide == 'B')  //-- подъезд снизу
		{
			if (canF) {
				svShape = new createjs.Shape();
				svShape.x = 0;
				svShape.y = 0;
				svShape.graphics.beginFill('white');
				svShape.graphics.beginStroke('green');
				svShape.graphics.setStrokeStyle(3);
				svShape.graphics.moveTo(50, 0).lineTo(50, width);
				SvetoHelper.arrow(svShape, 'T', 50, 0, width, arrW);
				svShape.graphics.endStroke();
				svShape.graphics.endFill();
				svetoCont.addChild(svShape);
			}

			if (canR) {
				svShape = new createjs.Shape();
				svShape.x = 0;
				svShape.y = 0;
				//svShape.graphics.beginFill('white');
				svShape.graphics.beginStroke('green');
				svShape.graphics.setStrokeStyle(3);
				svShape.graphics.moveTo(55, width).lineTo(55, width - width / 3).lineTo(width, width - width / 3);
				//svShape.graphics.moveTo(55, width).lineTo(55, width - width / 3).curveTo(55, width - width / 3, width, width - width / 3 );
				SvetoHelper.arrow(svShape, 'R', width, 55, width - width / 3, arrW);
				svShape.graphics.endStroke();
				//svShape.graphics.endFill();
				svetoCont.addChild(svShape);
			}
		}
		else if (svetSide == 'T')
		{
			if (canF)
			{
				svShape = new createjs.Shape();
				svShape.x = 0;
				svShape.y = 0;
				svShape.graphics.beginFill('white');
				svShape.graphics.beginStroke('green');
				svShape.graphics.setStrokeStyle(3);
				svShape.graphics.moveTo(30, 0).lineTo(30, width);				
				SvetoHelper.arrow(svShape, 'B', 30, width, width, arrW);
				svShape.graphics.endStroke();
				svShape.graphics.endFill();
				svetoCont.addChild(svShape);
			}



		}
	}

	static arrow(svShape, dir, x, y , lineW, arrW)
	{
		let arrY;
		let x1;

		if(dir == 'B')
		{
			arrY = lineW - arrW;
			x1 = x - arrW / 2;
			svShape.graphics.moveTo(x1, arrY).lineTo(x1 + arrW, arrY).lineTo(x1  + arrW / 2, arrY + arrW).lineTo(x1, arrY);
		}
		else if (dir == 'T') 
		{
			arrY = arrW;
			x1 = x - arrW / 2;
			svShape.graphics.moveTo(x1, arrY).lineTo(x1 + arrW, arrY).lineTo(x1 + arrW / 2, arrY - arrW).lineTo(x1, arrY);
		}
		else if (dir == 'R') {
			arrY = y - arrW;
			x1 = x ;
			svShape.graphics.moveTo(x1, arrY).lineTo(x1 + arrW, arrY + arrW/2).lineTo(x1 , arrY + arrW).lineTo(x1, arrY);
		}
	}
}
*/
/*
  drawSvetOne(svetoCont, x, y, r, svetSide, canF, canL, canR)
    {
        let svShape;
        let offXY = 10;
        let colorRed, colorGreen;
        let colorR, colorL;
        let svetOff = '#e8f2e9';
        let svetGreen = '#0ed125';
        let svetRed = 'red';
        let strelkaY, lampRedY, lampGreenY, lampRedX, lampGreenX;

        if(canF)
        {
            colorRed = svetOff;
            colorGreen = svetGreen;
        }
        else{
            colorRed = svetRed;
            colorGreen = svetOff;
        }

        if(svetSide == 'T')
        {
            strelkaY = y + offXY;
            lampRedY = y + (r * 2) + offXY;
            lampGreenY = y + offXY;
            lampRedX = x;
            lampGreenX = x;

            if(canL)
            {
                colorR = svetGreen;
            }
            else
            {
                colorR = svetRed;
            }
            if(canR)
            {
                colorL = svetGreen;
            }
            else
            {
                colorL = svetRed;
            }
        }
        else if(svetSide == 'B')
        {
            lampGreenY = y + r * 2 - offXY;
            strelkaY = lampGreenY;
            lampRedY = lampGreenY - r * 2;
            lampRedX = x;
            lampGreenX = x;

            if(canR)
            {
                colorR = svetGreen;
            }
            else
            {
                colorR = svetRed;
            }
            if(canL)
            {
                colorL = svetGreen;
            }
            else
            {
                colorL = svetRed;
            }
        }
        else if(svetSide == 'L')
        {
            strelkaY = y;
            lampRedY = y;
            lampGreenY = y;
            lampRedX = x + r * 2 + r + offXY;
            lampGreenX = x + r + offXY;
            if(canR)
            {
                colorR = svetGreen;
            }
            else
            {
                colorR = svetRed;
            }
            if(canL)
            {
                colorL = svetGreen;
            }
            else
            {
                colorL = svetRed;
            }
        }
        else if(svetSide == 'R')
        {
            strelkaY = y;
            lampRedY = y;
            lampGreenY = y;
            lampRedX = x - r * 2 - offXY ;
            lampGreenX = x - offXY ;
            if(canL)
            {
                colorR = svetGreen;
            }
            else
            {
                colorR = svetRed;
            }
            if(canR)
            {
                colorL = svetGreen;
            }
            else
            {
                colorL = svetRed;
            }
        }

        //-- красный
        this.drawSvetColor(svetoCont, lampRedX, lampRedY, colorRed, r, svetSide);

        //-- зеленый
        this.drawSvetColor(svetoCont, lampGreenX, lampGreenY, colorGreen, r, svetSide);


        if(svetSide == 'T' || svetSide == 'B')
        {
            //-- стрелка вправо
            svShape = new createjs.Shape();
            svShape.x = x + r;
            svShape.y = strelkaY;
            svShape.graphics.beginFill(colorR);
            svShape.graphics.beginStroke('silver');
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(0,0).lineTo(r*2, r).lineTo(0, r*2).lineTo(0, 0);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);

            //-- стрелка влево
            svShape = new createjs.Shape();
            svShape.x = x - r*2 - r;
            svShape.y = strelkaY;
            svShape.graphics.beginFill(colorL);
            svShape.graphics.beginStroke('silver');
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(0, r).lineTo(r*2, 0).lineTo(r*2, r*2).lineTo(0, r);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);
        }
        else
        {
            //--стрелка вверх
            svShape = new createjs.Shape();
            svShape.x = lampGreenX - r;
            svShape.y = strelkaY;
            svShape.graphics.beginFill(colorL);
            svShape.graphics.beginStroke('silver');
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(0,0).lineTo(r, - r * 2).lineTo(r * 2, 0).lineTo(0, 0);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);

            //--стрелка вниз

            svShape = new createjs.Shape();
            svShape.x = lampGreenX - r;
            svShape.y = strelkaY + r * 2;
            svShape.graphics.beginFill(colorR);
            svShape.graphics.beginStroke('silver');
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(0,0).lineTo(r,  r * 2).lineTo(r * 2, 0).lineTo(0, 0);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            svetoCont.addChild(svShape);

        }


	}
	
	drawSvetColor(svetoCont, x, y, color, r, svetSide)
    {
        let svShape = new createjs.Shape();
        svShape.x = x;
        svShape.y = y;
        svShape.graphics.beginFill(color);
        svShape.graphics.drawCircle(0, r, r);
        svShape.graphics.endFill();
        svetoCont.addChild(svShape);
    }
*/