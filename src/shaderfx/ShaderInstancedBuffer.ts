import { ShaderData, TypedArray, ShaderBuffer } from "./ShaderBuffer";
import { GLContext } from "wglut";
import { GLDrawType } from "../GL";


export class ShaderInstancedBuffer{

    private m_instanceCount:number = 0;
    private m_drawType:GLDrawType;

    private m_buffer:ShaderBuffer;
    private m_glbuffer:WebGLBuffer;

    public get instanceCount():number{
        return this.m_instanceCount;
    }

    public set instanceCount(c:number){this.m_instanceCount = c;}



    public constructor(gl:WebGL2RenderingContext,bytesize:number,drawType:GLDrawType,instanceCount:number){
        this.m_instanceCount = instanceCount;
        this.m_drawType = drawType;
        
        this.m_buffer = new ShaderBuffer(bytesize);
    }
    
    public updateBuffer(array:TypedArray,offset?:number){
        this.m_buffer.setWithTypedArray(array,offset);
    }

    public submit(gl:WebGL2RenderingContext){
        let glbuffer = this.m_glbuffer;
        const buffer = this.m_buffer;
        let dirty = buffer.isDirty;
        let bufferNull = glbuffer == null;
        if(!bufferNull && !dirty) return;
        if(bufferNull){
            glbuffer = gl.createBuffer();
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,glbuffer);

        let minoff = buffer.offsetMin;
        let maxoff = buffer.offsetMax;
        if(bufferNull){
            gl.bufferData(gl.ARRAY_BUFFER,buffer.raw,this.m_drawType);
        }
        else if(minoff < maxoff){
            gl.bufferSubData(gl.ARRAY_BUFFER,minoff,buffer.raw,minoff,maxoff- minoff);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
        buffer.setDirty(false);
    }

    public release(gl:WebGL2RenderingContext){
        gl.deleteBuffer(this.m_buffer);
    }

    
    
}
