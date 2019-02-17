import { vec4, glmath } from "../math/GLMath";
import { isNull } from "util";


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

	public static byteDataToImageData(width:number,height:number,data:Uint8Array):string{
		let tempcanvas = document.createElement('canvas');
        tempcanvas.width = width;
        tempcanvas.height = height;
		var ctx2d = <CanvasRenderingContext2D>tempcanvas.getContext('2d');
        var imgdata = ctx2d.createImageData(width,height);
		imgdata.data.set(data);
		ctx2d.putImageData(imgdata, 0, 0);
		return tempcanvas.toDataURL();
	}

	public static byteDataToImage(width:number,height:number,data:Uint8Array,cb:(img:HTMLImageElement)=>void){
		let src = Utility.byteDataToImageData(width,height,data);
		var img =new Image();
		img.onload = ()=>{
			cb(img);
		}
		img.onerror = ()=>{
			cb(null);
		};
		img.src = src;
	}

	public static async loadImage(url:string):Promise<HTMLImageElement>{
        if(url == null) return null;
        return new Promise<HTMLImageElement>((res,rej)=>{
            var img =new Image();
            img.onload = ()=>{
                res(img);
            }
            img.onerror = ()=>{
                rej('image load failed');
            };
            img.src = url;
        });
	}
	
	public static StrAddLineNum(str:string):string{
        return str.split('\n').map((line, index) => `${index + 1}. ${line}`).join('\n');
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


export function undefinedOr(x:any,y:any){
	return x == undefined ? y: x;
}