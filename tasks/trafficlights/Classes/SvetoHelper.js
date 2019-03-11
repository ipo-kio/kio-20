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

    static drawSvetOne2(svetoShape, W, svetSide, canF)
    {
        let svShape = svetoShape;
        let w2 = W / 2; //-- половина общей длинны(ширины)
        let aW = 10; // ширина стрелки
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

            //svShape = new createjs.Shape();
            svShape.graphics.beginFill(color);
            svShape.graphics.beginStroke(colorS);
            svShape.graphics.setStrokeStyle(1);
            svShape.graphics.moveTo(w2, w2)
                .lineTo(w2 + aW2, w2 + aW2)
                .lineTo(w2 + aW2, W)
                .lineTo(w2 - aW2, W)
                .lineTo(w2 - aW2, w2 + aW2)
                .lineTo(w2, w2);
            svShape.graphics.endStroke();
            svShape.graphics.endFill();
            //svetoCont.addChild(svShape);

        }
        else if (svetSide == 'T') {
            //svShape = new createjs.Shape();
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
            //svetoCont.addChild(svShape);
        }
        else if (svetSide == 'L') {
            //svShape = new createjs.Shape();
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
            //svetoCont.addChild(svShape);
        }
        else if (svetSide == 'R') {
            //svShape = new createjs.Shape();
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
            //svetoCont.addChild(svShape);
        }
    }

    static dirToSvetoSide(dir)
    {
        if (dir == 'T') return 'B';
        if (dir == 'B') return 'T';
        if (dir == 'L') return 'R';
        if (dir == 'R') return 'L';
    }
}
