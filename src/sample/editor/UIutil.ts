

export class UIUtility{

    public static getEnumSelector(t:any){

        let ret = {};
        for (const key in t) {
            if (t.hasOwnProperty(key)) {
                const element = t[key];
                if(typeof element === 'number'){
                    ret[key] = key;
                }
            }
        }
        return ret;
    }
}