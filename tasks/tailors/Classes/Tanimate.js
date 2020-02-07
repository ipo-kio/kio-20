import { Global } from './Global.js'

export class Tanimate
{
	ctx
	nn
	X0
	NEEDLE_LENGTH
	N = 1

	//run(x0, totalLen, lenCurrent)
	run(x0, lenCurrent, totalResult, step)
	{
		this.X0 = x0
		//this.NEEDLE_LENGTH = totalResult;
		//this.N = lenCurrent ;

		this.N = this.N + totalResult + 1;
		this.NEEDLE_LENGTH = lenCurrent - step // lenCurrent;

		log('this.N=' + this.N + ' NEEDLE_LENGTH=' + this.NEEDLE_LENGTH)

		this._animate();



	}

	_animate(){



		let start_frame_time = new Date().getTime();
        let frame = () => {
            let current_frame_time = new Date().getTime();
            let elapsed_time = (current_frame_time - start_frame_time) / 1000;

			//log('elapsed_time='  + (elapsed_time ));

            //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._draw(elapsed_time / TIME_FOR_ONE_STEP);


			if(elapsed_time < TIME_FOR_ONE_STEP)
			{
				let myReq = requestAnimationFrame(frame);
			}
			else{

			}


			//log('111')
			//let myReq = requestAnimationFrame(frame);

			//cancelAnimationFrame(myReq);
        };

		requestAnimationFrame(frame);


	}

	 _draw(time) {
		//log('_draw11');

		let nnn = this.NEEDLE_LENGTH;
		//let nnn = this.N;

        let segment_length = new Array(nnn).fill(0);
		let segment_type = new Array(nnn).fill(SEGMENT_TYPE_NO);

        let steps = nnn;
        let i = 0;
        let out_length = 0;
        while (time >= steps && i < nnn) {
            segment_length[i] = 1;
            segment_type[i] = SEGMENT_TYPE_INSERTED;
            time -= steps;
            i++;
            steps -= 1;
		}

        if (i < nnn) {
            if (time < 1) {
                segment_type[i] = SEGMENT_TYPE_TO_AIR_OUT;
                segment_length[i] = nnn - i;
            } else {
                let x = time - 1;
                segment_type[i] = SEGMENT_TYPE_TO_POINT;
                segment_length[i] = nnn - i - x;
                segment_type[i + 1] = SEGMENT_TYPE_TO_AIR_IN;
                segment_length[i + 1] = x;
                out_length = nnn - i - 1;
            }
		}

		/*
        let steps = this.N;
        let i = 0;
        let out_length = 0;
        while (time >= steps && i < this.N) {
            segment_length[i] = 1;
            segment_type[i] = SEGMENT_TYPE_INSERTED;
            time -= steps;
            i++;
            steps -= 1;
		}

        if (i < this.N) {
            if (time < 1) {
                segment_type[i] = SEGMENT_TYPE_TO_AIR_OUT;
                segment_length[i] = this.N - i;
            } else {
                let x = time - 1;
                segment_type[i] = SEGMENT_TYPE_TO_POINT;
                segment_length[i] = this.N - i - x;
                segment_type[i + 1] = SEGMENT_TYPE_TO_AIR_IN;
                segment_length[i + 1] = x;
                out_length = this.N - i - 1;
            }
		}
		*/

		let c = this.ctx;
		let needle = {dx: 0, dy: 1, x: 0, y: 1};

		for (let s = 0; s <= this.N; s++) {
            c.lineWidth = 1;
            c.strokeStyle = "rgba(128, 128, 0, 0.5)";
            c.moveTo(this.X0 - 3, Y0 + s * L - 3);
            c.lineTo(this.X0 + 3, Y0 + s * L + 3);
            c.moveTo(this.X0 - 3, Y0 + s * L + 3);
            c.lineTo(this.X0 + 3, Y0 + s * L - 3);
            c.stroke();
		}

        for (let s = 0; s < segment_type.length; s++)
            if (segment_type[s] !== SEGMENT_TYPE_NO) {
                c.save();
                c.translate(this.X0, Y0 + s * L);

                if (s % 2 === 1)
                    c.scale(-1, 1);

                needle = this._draw_segment(L * segment_length[s], segment_type[s], out_length, time);
                if (s % 2 === 1) {
                    needle.x *= -1;
                    needle.dx *= -1;
                }
                needle.x += this.X0;
                needle.y += Y0 + s * L;

                c.restore();
        	}
        // draw needle

        c.save();
        c.lineWidth = NEEDLE_THICKNESS;
        c.strokeStyle = NEEDLE_COLOR;
        let {x, y, dx, dy} = needle;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(x + dx * this.NEEDLE_LENGTH, y + dy * this.NEEDLE_LENGTH);
        c.stroke();

        c.restore();
		//log('_draw22');
	}

	_draw_segment(length, type, out_length, time) {
        let c = this.ctx;
        c.save();

        let line_type_index = 1;
        let needle;

        c.beginPath();
        if (type === SEGMENT_TYPE_INSERTED) {
            c.moveTo(0, 0);
            c.lineTo(0, L);
            line_type_index = 0;

            needle = {dx: 0, dy: 1, x: 0, y: L};
        } else if (type === SEGMENT_TYPE_TO_POINT) {
            needle = this._add_round_path(0, 0, 0, L, length);
        } else if (type === SEGMENT_TYPE_TO_AIR_IN) {
            needle = this._add_round_path(0, 0, 0, L, (out_length + 1) * L, length);
        } else if (type === SEGMENT_TYPE_TO_AIR_OUT) {
            needle = this._add_round_path(0, 0, 0, L, length + L - time * L, length);
        }

        this._stroke(line_type_index);
        c.restore();

        return needle;
	}

	_add_round_path(x1, y1, x2, y2, len, len2 = len) {
        let c = this.ctx;

        let dx = x2 - x1;
        let dy = y2 - y1;
        let d = Math.sqrt(dx * dx + dy * dy);

        let l = Math.PI * d / 2;

        let needle;

        if (len > l) {
            let skip = (len - l) / 2;
            let real_skip = Math.min(skip, len2);
            let vx = dy / d * real_skip;
            let vy = -dx / d * real_skip;

            c.moveTo(x1, y1);
            c.lineTo(x1 + vx, y1 + vy);

            needle = {dx: dy / d, dy: -dx / d, x: x1 + vx, y: y1 + vy};

            if (len2 > skip) {
                len2 -= skip;
                let x3 = x2 + vx;
                let y3 = y2 + vy;
                needle = this._add_arc_path(x1 + vx, y1 + vy, x3, y3, l, Math.min(l, len2));
                if (len2 > l) {
                    len2 -= l;
                    let end_x = x3 + (x2 - x3) / skip * len2;
                    let end_y = y3 + (y2 - y3) / skip * len2;
                    c.lineTo(end_x, end_y);

                    needle = {dx: -dy / d, dy: dx / d, x: end_x, y: end_y};
                }
            }
        } else
            needle = this._add_arc_path(x1, y1, x2, y2, len, Math.min(len, len2));

        this._stroke(1);

        return needle;
    }

    _add_arc_path(x1, y1, x2, y2, len, len2) {
        // sin(len / 2r) = d / 2r
        // len >= d
        // r = d/2: (>=)                              sin(len / d) <= 1
        // s = 1/r             s from 0 (>) to 2/d (<)

        let dx = x2 - x1;
        let dy = y2 - y1;
        let d = Math.sqrt(dx * dx + dy * dy);

        let s_left = 0;         // sin >
        let s_right = 2 / d;    // sin <

        for (let steps = 0; steps < 20; steps++) {
            let s0 = (s_left + s_right) / 2;
            let lhs = Math.sin(len / 2 * s0);
            let rhs = d / 2 * s0;

            if (lhs < rhs)
                s_right = s0;
            else
                s_left = s0;
        }

        let s0 = (s_left + s_right) / 2;
        if (Math.abs(s0) < 1e-5) { //if s0 is zero
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            return {dx: dx / d, dy: dy / d, x: x2, y: y2};
        }

        let r = 1 / s0;
        let v = Math.cos(len / (2 * r)) * r;
        let vx = -dy / d * v;
        let vy = dx / d * v;
        let x0 = (x1 + x2) / 2 + vx;
        let y0 = (y1 + y2) / 2 + vy;

        let startAngle = Math.atan2(y1 - y0, x1 - x0);
        let endAngle = Math.atan2(y2 - y0, x2 - x0);

        endAngle = startAngle + (endAngle - startAngle) * len2 / len;

        this.ctx.arc(x0, y0, r, startAngle, endAngle);

        return {
            dx: -Math.sin(endAngle),
            dy: Math.cos(endAngle),
            x: x0 + r * Math.cos(endAngle),
            y: y0 + r * Math.sin(endAngle)
        };
    }

    _stroke(line_type_index) {
        let c = this.ctx;

        c.lineWidth = THREAD_THICKNESS1;
        c.strokeStyle = line_type_index === 0 ? THREAD_INSERTED_COLOR1 : THREAD_INSERTING_COLOR1;
        c.stroke();

        c.lineWidth = THREAD_THICKNESS2;
        c.strokeStyle = line_type_index === 0 ? THREAD_INSERTED_COLOR2 : THREAD_INSERTING_COLOR2;
        c.stroke();
	}

	static drawNit(finishStep){

		let canvasBot = document.getElementById('canvas_bot')
		let ctxBot = canvasBot.getContext('2d');
		ctxBot.clearRect(0, 0, canvasBot.width, canvasBot.height);
		let n, j, x, lastY, x1, y1, mm, n1
		let p = Global._drawProcess;
		let i, tailor, totalResH
		let nitYstart = 130;
		let steLen = 10   //-- длина стежка в пикселях


		for(i = 0; i < p._tailorsArr.length; i++)
		{
			tailor = p._tailorsArr[i]

			totalResH = tailor._totalResult * steLen //+ 50
			x = 25 + (i)* 95
			lastY = nitYstart;

			//-- готовые стежки
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 4;
				ctxBot.strokeStyle = "silver";
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
					//n = totalResH / tailor._totalResult;
					//n = 10;

					for (j = 0; j <= tailor._totalResult; j++)
					{
						lastY = (j*steLen) + nitYstart

						ctxBot.moveTo(x-2, lastY)
						ctxBot.lineTo(x+2, lastY)

					}
					//-- будущяя дырка от стежка
					//ctxBot.moveTo(x-2, ((tailor._totalResult+1)*steLen) + nitYstart)
					//ctxBot.lineTo(x+2, ((tailor._totalResult+1)*steLen) + nitYstart)
				}

				ctxBot.stroke();
				ctxBot.closePath();
			}

			if(tailor._totalResult % 2 == 0){
				mm  = 1
			}
			else{
				mm = -1
			}


			ctxBot.beginPath();

			//-- петля остатка
			ctxBot.moveTo(x, lastY)

			n = ((tailor._lenCurrent-tailor._step+1)* steLen/2)
			//-- координата петли остатка
			x1 = x-(n * mm)
			y1 = lastY + steLen/2  // ((tailor._lenCurrent-tailor._step-1)*5)



			//log('x1=' + x1 + ' Global._moveNitStep=' + Global._moveNitStep + ' step=' + tailor._step)
			if(!finishStep)
			{

				x1 = x1 + ((Global._moveNitStep) * mm)
			}
			else{
				//log('fffffffffffffff')
			}

			if(tailor._lenCurrent > 0 || tailor._step > 1){
				//log('x11=' + x1 )
				ctxBot.bezierCurveTo(x1, lastY,   x1, lastY + steLen,   x,lastY + steLen)
			}





			if(tailor._currentState == '-')
			{


			//-- петля
				{

					//-- петля продернутая

					Tanimate.bbb(ctxBot, x, lastY + 10, tailor._step, tailor._lenCurrent, tailor._totalResult, steLen, finishStep)

				}
			}

			ctxBot.stroke();
			ctxBot.closePath();




			//-- длина нити
			{
				ctxBot.beginPath();
				ctxBot.lineWidth = 1;
				ctxBot.fillStyle = 'blue';
				ctxBot.font = 'bold 20px Arial';
				ctxBot.fillText(tailor._totalResult, x + 15 , nitYstart + 40 )
				ctxBot.stroke();
				ctxBot.closePath();
			}
		}
	}

	static bbb(ctx, xStart, yStart, step, lenCurrent, totalResult, steLen, finishStep)
	{
		if(lenCurrent == 0) return;

		let p, n, mm, n1;
		let accuracy = 0.01 //this'll give the bezier 100 segments


		if(totalResult % 2 == 0){
			mm  = 1
		}
		else{
			mm = -1
		}

		n = (( lenCurrent)* steLen/2)

		let p0 = {x: xStart, y: yStart} //use whatever points you want obviously
		let p1 = {x: xStart + n * mm, y: yStart}
		let p2 = {x: xStart + n * mm, y: yStart + steLen}
		let p3 = {x: xStart, y: yStart + steLen}


		ctx.moveTo(xStart, yStart);

		n = ((1 / lenCurrent) * (lenCurrent - step))

		//Global._moveNitStep  //-- 1..5





		//log('step=' + step + ' lenCurrent=' +  lenCurrent +  ' n=' + n + ' Global._moveNitStep=' + Global._moveNitStep + ' n1=' + n1)

		if(!finishStep){
			n1 = n + 0.1 - (Global._moveNitStep) * 0.02
			n = n1
		}
		else{
			//log('finishStep')
		}


		for (let i=0; i<(1-n); i+=(accuracy))
		{
			p = Tanimate.bezier(i, p0, p1, p2, p3, mm);

			ctx.lineTo(p.x, p.y);
		}



	}

	static bezier(t, p0, p1, p2, p3, mm)
	{
		var cX = 3 * (p1.x - p0.x) ,
			bX = 3 * (p2.x - p1.x) - cX,
			aX = p3.x - p0.x - cX - bX;

		var cY = 3 * (p1.y - p0.y),
			bY = 3 * (p2.y - p1.y) - cY,
			aY = p3.y - p0.y - cY - bY;

		var x = (aX * Math.pow(t, 3)) + (bX * Math.pow(t, 2)) + (cX * t) + p0.x ;
		var y = (aY * Math.pow(t, 3)) + (bY * Math.pow(t, 2)) + (cY * t) + p0.y;

		return {x: x, y: y};
	  }
}

//const N = 3; // длина нити
const L = 20; // длина единичного сегмента нити в пикселях
const TIME_FOR_ONE_STEP = 1; // время в секундах на один шаг
//const X0 = 50; // позиция начала нити.
const Y0 = 130;

const THREAD_THICKNESS1 = 4;
const THREAD_THICKNESS2 = 2;
const THREAD_INSERTED_COLOR1 = '#5daa0c';
const THREAD_INSERTED_COLOR2 = '#6ced39';
const THREAD_INSERTING_COLOR1 = '#fd4c39';
const THREAD_INSERTING_COLOR2 = '#ffd739';

//const NEEDLE_LENGTH = 10;
const NEEDLE_THICKNESS = 1;
const NEEDLE_COLOR = '#c7ac60';

const SEGMENT_TYPE_NO = 0;
const SEGMENT_TYPE_INSERTED = 1;
const SEGMENT_TYPE_TO_POINT = 2;
const SEGMENT_TYPE_TO_AIR_IN = 3;
const SEGMENT_TYPE_TO_AIR_OUT = 4;

function log(s){
	console.log(s);
}