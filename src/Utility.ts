

export type MapStr<T> = {[key:string]:T};
export type MapNum<T> = {[key:number]:T};

export class Utility {

	/**
	 * Simple hash function
	 * @param str 
	 */
	public static Hashfnv32a(str: string): number {
		var FNV1_32A_INIT = 0x811c9dc5;
		var hval = FNV1_32A_INIT;
		for (var i = 0; i < str.length; ++i) {
			hval ^= str.charCodeAt(i);
			hval += (hval << 1) + (hval << 4) + (hval << 7) + (hval << 8) + (hval << 24);
		}
		return hval >>> 0;
	}

	/**
	 * Deep clone map object
	 * @param map 
	 */
	public static cloneMap<T,U extends MapStr<T> | MapNum<T>>(map:U,itemclone?:(t:any)=>any):U{
		if(map == null) return null;
		let ret:any = {};
		if(itemclone){
			for(var key in map){
				let val:any = map[key];
				ret[key] =itemclone(val);
			}
		}
		else{
			for(var key in map){
				ret[key] = map[key];
			}
		}
		return ret;
	}
}


