import { vec3, vec4, mat4, mat3 } from "../math/GLMath";

class ShaderBuffer{
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

export class ShaderData{
    protected buffer:ShaderBuffer;
    public get fxbuffer():ShaderBuffer{
        return this.buffer;
    }

    public constructor(bytelength:number){
        this.buffer = new ShaderBuffer(bytelength);
    }

    public submitBuffer(gl:WebGL2RenderingContext,glbuffer:WebGLBuffer):boolean{
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

