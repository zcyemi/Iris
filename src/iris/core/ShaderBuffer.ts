import { mat3, mat4, vec3, vec4 } from "../math/GLMath";
import { PropertyUpdater, Utility } from "./Utility";
import { GLContext, GL } from "../gl";
import { GameContext } from "./GameContext";

export class ShaderBuffer{
    private minoff:number =0;
    private maxoff:number =0;
    private m_isdirty:boolean = false;
    private rawbuffer:ArrayBuffer;
    private byteArray:Uint8Array;
    private dataView:DataView;
    public constructor(bytesize:number){
        this.maxoff= 0;
        this.minoff = bytesize;
        let buffer = new ArrayBuffer(bytesize);
        this.rawbuffer =buffer;
        this.dataView = new DataView(buffer);
        this.byteArray = new Uint8Array(buffer);
    }
    public get isDirty():boolean {return this.m_isdirty;}
    public get offsetMin():number{return this.minoff;}
    public get offsetMax():number{return this.maxoff;}
    public get raw():Uint8Array{
        return this.byteArray;
    }
    public setDirty(d:boolean){
        this.m_isdirty = d;
        if(!d){
            this.minoff = this.rawbuffer.byteLength;
            this.maxoff = 0;
        }

    }
    public set(fxbuffer:ShaderBuffer,off:number){
        this.byteArray.set(fxbuffer.byteArray,off);
    }
    public setOfView(fxview:ShaderBufferView){
        this.set(fxview.buffer,fxview.viewbase);
    }
    public setOfSubData(fxsubdata:ShaderSubData){
        this.set(fxsubdata.bufferView.buffer,fxsubdata.baseOffset);
    }
    private setMinMaxOffset(byteOffset:number,length:number){
        if(byteOffset < this.minoff) this.minoff = byteOffset;
        let max = byteOffset +length;
        if(max > this.maxoff) this.maxoff = max;
        this.m_isdirty = true;
    }
    public setFloat(byteOffset:number,value:number){
        this.setMinMaxOffset(byteOffset,4);
        this.dataView.setFloat32(byteOffset,value,true);
    }
    public setUint32(byteOffset:number,value:number){
        this.setMinMaxOffset(byteOffset,4);
        this.dataView.setUint32(byteOffset,value);
    }
    public setVec3(byteOffset:number,value:vec3){
        this.setMinMaxOffset(byteOffset,12);
        let raw = value.raw;
        let dv = this.dataView;
        let off = byteOffset;
        dv.setFloat32(off, raw[0],true);
        off += 4;
        dv.setFloat32(off, raw[1],true);
        off += 4;
        dv.setFloat32(off, raw[2],true);
    }
    public setVec4(byteOffset:number,value:vec4){
        this.setMinMaxOffset(byteOffset,16);
        let raw = value.raw;
        let dv = this.dataView;
        let off = byteOffset;
        dv.setFloat32(off, raw[0],true);
        off += 4;
        dv.setFloat32(off, raw[1],true);
        off += 4;
        dv.setFloat32(off, raw[2],true);
        off += 4;
        dv.setFloat32(off, raw[3],true);
    }
    public setMat4(byteOffset:number,value:mat4){
        this.setMinMaxOffset(byteOffset,64);
        let raw = value.raw;
        let dv = this.dataView;
        let len = raw.length;
        let off = byteOffset;
        for(let i=0;i<len;i++){
            dv.setFloat32(off,raw[i],true);
            off +=4;
        }
    }
    public setMat3(byteOffset:number,value:mat3){
        this.setMinMaxOffset(byteOffset,36);
        let raw = value.raw;
        let dv = this.dataView;
        let len = raw.length;
        let off = byteOffset;
        for(let i=0;i<len;i++){
            dv.setFloat32(off,raw[i],true);
            off +=4;
        }
    }
}

class ShaderBufferView{
    private fxbuffer:ShaderBuffer;
    private base:number = 0;
    public get buffer():ShaderBuffer{
        return this.fxbuffer;
    }
    public get viewbase():number{
        return this.base;
    }
    public constructor(buffer:ShaderBuffer,byteoffset:number,bytelength?:number){
        this.fxbuffer = buffer;
        this.base = byteoffset;
    }
    public setFloat(byteoffset:number,val:number){
        const base = this.base;
        this.fxbuffer.setFloat(base + byteoffset,val);
    }
    public setUint32(byteoffset:number,val:number){
        const base = this.base;
        this.fxbuffer.setUint32(base + byteoffset,val);
    }
    public setVec3(byteoffset:number,val:vec3){
        const base = this.base;
        this.fxbuffer.setVec3(base + byteoffset,val);
    }
    public setVec4(byteoffset:number,val:vec4){
        const base = this.base;
        this.fxbuffer.setVec4(base + byteoffset,val);
    }
    public setMat4(byteoffset:number,val:mat4){
        const base = this.base;
        this.fxbuffer.setMat4(base + byteoffset,val);
    }
    public setMat3(byteoffset:number,val:mat3){
        const base = this.base;
        this.fxbuffer.setMat3(base + byteoffset,val);
    }
}

export class ShaderSubData{
    protected view:ShaderBufferView;
    protected m_seperated:boolean = false;
    public readonly baseOffset:number;
    public readonly byteLength:number;
    public constructor(data:ShaderData,length:number,offset:number){
        this.byteLength = length;
        if(data == null){
            let buffer= new ShaderBuffer(length);
            this.view =new ShaderBufferView(buffer,0,length);
            this.m_seperated = true;
        }
        else{
            this.view = new ShaderBufferView(data.fxbuffer,offset,length);
        }
        this.baseOffset = offset;
    }
    public get isSeperated():boolean{ return this.m_seperated;}
    public get bufferView():ShaderBufferView{
        return this.view;
    }
    public get isDirty():boolean{
        return this.view.buffer.isDirty;
    }
    public set setDirty(v:boolean){
        this.view.buffer.setDirty(v);
    }
}



export class ShaderProperty<T>{
    private val:T;
    private updater:PropertyUpdater;
    private dataSize:number = 0;
    private datapos:number = 0;
    public buffer: ShaderBuffer;

    private m_type:{new():T};
    private m_setFunc:Function;

    public get value():T{
        return this.val;
    }

    constructor(size:number,type:{new ():T},uniform:string,val?:T,) {
        this.val = val;
        this.dataSize =size;
        this.m_type = type;

        let fname = type.prototype.constructor.name;
        fname =`set${ Utility.nameCapitalized(fname)}`;
        this.m_setFunc = ShaderBuffer.prototype[fname];
        if(!this.m_setFunc){
            throw new Error(`can not find setprop func: ${fname}`);
        }
    }

    public setValue(val:T){
        this.val =val;
        this.m_setFunc.call(this.buffer,this.datapos,val);
        this.updater.setDirty();
    }

    public initProp(data:ShaderData,bytepos:number):number{
        this.updater =data.m_updater;
        this.datapos = bytepos;
        return bytepos + this.dataSize;
    }
}

export function InitProp<T>(size:number,type:{new ():T},uniform:string,val?:T):ShaderProperty<T>{
    return new ShaderProperty(size,type,uniform,val);
}

export class ShaderData{

    public m_updater:PropertyUpdater = PropertyUpdater.create(this,null,true);


    public buffer:ShaderBuffer;
    private m_byteLenth:number = 0;
    public get fxbuffer():ShaderBuffer{
        return this.buffer;
    }

    public get totalBytes():number{
        return this.m_byteLenth;
    }

    public constructor(){
    }

    protected setupProp(){
        let pos = 0;

        this.foreachProp(p=>{
            pos = p.initProp(this,pos);
        })

        let byteLength =pos;
        this.m_byteLenth = byteLength;
        let buffer = new ShaderBuffer(byteLength);
        this.buffer = buffer;
        this.foreachProp(p=>{
            p.buffer = buffer;
        })
    }

    public foreachProp(fn:(p:ShaderProperty<any>)=>void){
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const element = this[key];
                if(element instanceof ShaderProperty){
                    fn(element);
                }
            }
        }
    }



    public submitBuffer(gl:WebGL2RenderingContext,glbuffer:WebGLBuffer):boolean{
        if(!this.m_updater.update()){
            return false;
        }
        
        const fxbuffer = this.buffer;
        if(!fxbuffer.isDirty) return false;
        let minoff = fxbuffer.offsetMin;
        let maxoff = fxbuffer.offsetMax;

        if(minoff>= maxoff){
            fxbuffer.setDirty(false);
            return false;
        }
        gl.bindBuffer(gl.UNIFORM_BUFFER,glbuffer);
        gl.bufferSubData(gl.UNIFORM_BUFFER,minoff,fxbuffer.raw,minoff,maxoff - minoff);
        gl.bindBuffer(gl.UNIFORM_BUFFER,null);
        fxbuffer.setDirty(false);
        return true;
    }

}


const TYPE_SIZE:{[key:string]:number}={
    mat4: 64,
    mat3: 36,
    mat2: 16,
    vec2: 8,
    vec3: 12,
    vec4: 16,
}

export class SimpleUniformBuffer{

    public uniformName:string;
    public uniformIndex:number;

    public glbuffer:WebGLBuffer;
    public isDirty:boolean = true;
    public data:ArrayBuffer;

    public dataView:DataView;

    private minoff:number =0;
    private maxoff:number =0;

    public constructor(unifomr_name:string,uniform_index:number,bytesize?:number){
        this.uniformIndex = uniform_index;
        this.uniformName = unifomr_name;
       
        if(bytesize!=null){
            this.initBufferSize(bytesize);
        }

        this.isDirty = false;
    }

    public initBufferSize(bytesize:number){
        this.data = new ArrayBuffer(bytesize);
        this.dataView = new DataView(this.data);

        const glctx = GameContext.current.graphicsRender.glctx;
        let buffer =glctx.createBufferAndBind(GL.UNIFORM_BUFFER);
        glctx.bufferData(GL.UNIFORM_BUFFER,this.data,GL.DYNAMIC_DRAW);
        glctx.bindBufferBase(GL.UNIFORM_BUFFER,this.uniformIndex,buffer);
        this.glbuffer = buffer;
    }

    public setFloat32(offset:number,val:number){
        this.dataView.setFloat32(offset,val,true);
        this.isDirty = true;
    }

    public dirtyOffset(offset:number,size:number){
        this.minoff = Math.min(offset,this.minoff);
        this.maxoff = Math.max(this.maxoff,offset+size);
    }

    public setmat4(offset:number,val:mat4){
        let raw = val.raw;
        const dv = this.dataView;
        
        let off = offset;
        this.dirtyOffset(off,64);
        for(let t=0;t<16;t++){

            dv.setFloat32(off,raw[t],true);
            off+=4;
        }
        this.isDirty = true;
    }

    public setvec4(offset:number,val:vec4){

        const raw = val.raw;
        const dv =this.dataView;

        let off = offset;
        this.dirtyOffset(off,16);
        for(let t=0;t<4;t++){
            dv.setFloat32(off,raw[t],true);
            off+=4;
        }
        this.isDirty=  true;
    }

    public submitData(gl:GLContext){
        if(!this.isDirty) return;

        gl.bindBuffer(GL.UNIFORM_BUFFER,this.glbuffer);
        let minoff = this.minoff;

        gl.bufferSubData(GL.UNIFORM_BUFFER,minoff,this.dataView,minoff,this.maxoff - minoff);
        gl.bindBuffer(GL.UNIFORM_BUFFER,null);

        this.minoff = this.data.byteLength;
        this.maxoff = 0;

        this.isDirty = false;

    }

}

export abstract class ShaderUniformData extends SimpleUniformBuffer{

    public constructor(unifomr_name:string,uniform_index:number,bytesize?:number){
        super(unifomr_name,uniform_index,bytesize);
    }

    public init(){
        this.initBufferSize(this.m_autoIncOffset);
        return this;
    }

    private m_autoIncOffset:number = 0;
    protected initProperty<T>(name:string,type:new ()=>T,defval?:T,byteoff?:number):T{
        var self = this;

        const typename = type.prototype.constructor.name;
        const internalName:string = `__${name}`;
        const setFuncName= `set${typename}`;

        var setFunc:(offset:number,val:T)=>void  = this[setFuncName].bind(self);
        var offset = byteoff;

        const size = TYPE_SIZE[typename];
        if(byteoff == null){
            offset = this.m_autoIncOffset;
            this.m_autoIncOffset += size;
        }

        this[internalName] = defval;
        this.dirtyOffset(offset,size);

        Object.defineProperty(this,name,{
            configurable:false,
            enumerable:false,
            get: function(){
                return self[internalName];
            },
            set:function(newval:T){
                if(newval == undefined){
                    return;
                }
                self[internalName] = newval;
                setFunc(offset,newval);
            }
        });
        return undefined;
    }
}