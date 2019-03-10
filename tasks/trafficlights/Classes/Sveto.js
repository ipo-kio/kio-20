export class Sveto
{
	_crossId;
	_programma = [];

	getProgForTik(tik) {
		return this._programma[this.getProgIndexByTik(tik)];
	}

	getProgIndexByTik(tik) {
		return (tik ) % this._programma.length;
	}

	getMyProgForTik(svetoSide, tik)
	{
			
		let currentProg = this.getProgForTik(tik);

		return this.getProgForSide(svetoSide, currentProg);
	}

	getProgForSide(svetoSide, currentProg)
	{
		let i;
		let svetoSideMinus = svetoSide + '-';

		if (currentProg.indexOf(svetoSideMinus) >= 0) //-- в программе есть секция для этой стороны светофора
		{
			let ss = currentProg.split(';'); //--'L-RTB;R-LTB;T-BLR;B-TLR'    T-BR;B-TR;R-T

			for (i = 0; i < ss.length; i++) 
			{
				if (ss[i].indexOf(svetoSideMinus) == 0) //-- это наша секция
				{
					if (ss[i].length > 2)
					{
						return ss[i].substr(2);
					}					
				}
			}
		}

		return '';
	}
}