import { Tailors } from "../tailors.js"
import { Tailor } from './Tailor.js'
import { Global } from './Global.js'
import { Process } from './Process.js'

export class LogHelper
{
	static tikToLog(process)
	{
		let i, tailor, cell, n
		let tbody = document.getElementById('log_table_body');

		var row   = tbody.insertRow()
		row.id = 'log_tik_row_' + process._currentTik
		row.className = 'log_row_tik'

		n = 0
		cell  = row.insertCell(0);
		cell.innerHTML = '<b>' + process._currentTik + '</b>'


		for(i=0; i < process._tailorsArr.length; i++){
			tailor = process._tailorsArr[i]

			cell  = row.insertCell(i+1);
			cell.innerHTML = tailor._currentState
			n++
		}

		cell  = row.insertCell(n+1);
		cell.innerHTML = process._princessState
	}

	static clearLog(tailorsArr)
	{
		let i, tailor, cell
		document.getElementById('log_table_body').innerHTML = ''

		let thead = document.getElementById('log_table_head');
		thead.innerHTML = ''

		if(tailorsArr)
		{
			let th = document.createElement('th');
			th.innerHTML = "N";
			thead.appendChild(th);

			for(i=0; i < tailorsArr.length; i++)
			{
				//tailor = tailorsArr[i]

				th = document.createElement('th');
				th.innerHTML = (i+1);
				th.className = 'log_head_col'
				thead.appendChild(th);
			}

			th = document.createElement('th');
			th.innerHTML = "P";
			thead.appendChild(th);
		}
		else{
			log('tailorsArr is NULL')
		}

	}

	static selectTik(tik)
	{
		let arr = document.getElementsByClassName('log_row_selected');
		let i, t

		for(i = 0; i < arr.length; i++){
			t = arr[i]
			t.className = 'log_row_tik'
		}

		t = document.getElementById('log_tik_row_' + tik)

		if(t)
		{
			t.className = 'log_row_selected'
			let topPos = t.offsetTop;
			document.getElementById('log_div_table').scrollTop = topPos - 50;
		}
	}

	static closeWindow(){
		document.getElementById('log_div').style.display = 'none'
		document.getElementById('btn_log_show').style.display = 'block'
	}

	static openWindow(){
		document.getElementById('log_div').style.display = 'block'
		document.getElementById('btn_log_show').style.display = 'none'
	}
}

function log(s){
	console.log(s);
}
