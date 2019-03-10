export class Helper
{
    static dicLen(dic)
    {
        return Object.keys(dic).length;
    }

    static getParamIntDef(strValue, defValue)
    {
        var n = parseInt(strValue);

        if(n > 0)
        {
            return  n;
        }
        else
        {
            if(strValue !== undefined)
            {
                console.log('Param Error! strValue=' + strValue)
            }

            return defValue;
        }
    }

    static getParamIntDefStr(strValue, defValue)
    {
        if(strValue !== undefined)
        {
            return  strValue;
        }
        else
        {
            return defValue;
        }
    }
}
