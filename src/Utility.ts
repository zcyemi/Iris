import { vec4, glmath } from "wglut";


export type MapStr<T> = {[key:string]:T};
export type MapNum<T> = {[key:number]:T};

export class Delayter{
	
	private m_newEmit:boolean = false;
	private m_ondelay:boolean = false;

	private m_f:()=>void;
	private m_time:number = 300;

	public constructor(time:number = 300){
		this.m_time;
	}

	public set delaytime(t:number){
		this.m_time= t;
	}

	public emit(f:()=>void){
		if(f == null) return;
		this.m_f = f;

		if(this.m_ondelay == true){
			this.m_newEmit = true;
		}
		else{
			this.m_newEmit = false;
			this.m_ondelay = true;
			this.delayExec();
		}
	}

	private delayExec(){
		var self =this;
		setTimeout(() => {
			if(self.m_newEmit){
				self.m_newEmit = false;
				self.delayExec();
			}
			else{
				self.m_f();
				self.m_ondelay = false;
			}
		},this.m_time);
	}
}

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

	public static randomColor():vec4{
		return glmath.vec4(Math.random(),Math.random(),Math.random(),1);
	}

	public static colorRGBA(r:number,g:number,b:number,a:number):vec4{
		return glmath.vec4(r,g,b,a).div(255.0);
	}
}


export class WindowUtility{

	private static onResizeFunc:()=>void;
	private static s_windowResizeRegisted:boolean = false;

	public static setOnResizeFunc(callback:()=>void){

		WindowUtility.onResizeFunc= callback;
		if(this.s_windowResizeRegisted){
			return;
		}
		WindowUtility.s_windowResizeRegisted = true;
		window.addEventListener('resize',WindowUtility.onWindowResize);
	}

	private static onWindowResize(){
		let cb = WindowUtility.onResizeFunc;
		if(cb != null){
			cb();
		}
	}
}


