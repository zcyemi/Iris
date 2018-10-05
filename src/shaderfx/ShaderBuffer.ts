import { vec3, vec4, mat4, mat3 } from "wglut";

export abstract class ShaderDataBuffer{
    public dataView:DataView;

    public get rawBuffer():ArrayBuffer{
        return this.dataView.buffer;
    }

    public setVec3(byteOffset:number,value:vec3){
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
        let raw = value.raw;
        let dv = this.dataView;
        let len = raw.length;
        let off = byteOffset;
        for(let i=0;i<len;i++){
            dv.setFloat32(off,raw[i],true);
            off +=4;
        }
    }

    public setFloat(byteOffset:number,value:number){
        this.dataView.setFloat32(byteOffset,value,true);
    }

    public setUint32(byteOffset:number,value:number){
        this.dataView.setUint32(byteOffset,value);
    }
}

export class ShaderDataFloat32Buffer extends ShaderDataBuffer{
    public m_buffer:Float32Array;
    public constructor(length:number){
        super();
        this.m_buffer = new Float32Array(length);
        this.dataView = new DataView(this.m_buffer.buffer,0,length *4);
    }

    public get float32Buffer():Float32Array{
        return this.m_buffer;
    }

    public setFloat(offset:number,value:number){
        this.m_buffer[offset] = value;
    }

    public setFloatArray(offset:number,value:ArrayLike<number>){
        this.m_buffer.set(value,offset);
    }

    public fill(offset:number,value:number,len:number){
        this.m_buffer.fill(value,offset,offset + len);
    }

    public setVec3(offset:number,value:vec3){
        this.m_buffer.set(value.raw,offset);
    }

    public setVec4(offset:number,value:vec4){
        this.m_buffer.set(value.raw,offset);
    }

    public setMat4(offset:number,value:mat4){
        let raw = value.raw;
        this.setFloatArray(offset,raw);
    }

    public setMat3(offset:number,value:mat3){
        let raw = value.raw;
        this.setFloatArray(offset,raw);
    }
}

export class ShaderDataArrayBuffer extends ShaderDataBuffer{
    public m_buffer:ArrayBuffer;
    public constructor(sizeInByte:number){
        super();
        this.m_buffer = new ArrayBuffer(sizeInByte);
        this.dataView = new DataView(this.m_buffer,0,sizeInByte);
    }

}