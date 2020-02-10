export class Helper{
	static hasKey(dic, key)
	{
		if(dic.hasOwnProperty(key)){
			return true
		}
		else{
			return false
		}
	}

	static dicLen(dic){
		return Object.keys(dic).length
	}
}