import { GLContext } from "./GLContext";
import { vec4 } from "../math/GLMath";
import { GLDataType } from "./GL";
import { read } from "fs";
import { GLFenceSync } from "./GLFenceSync";


export class GLPixelPack{
    private m_pb:WebGLBuffer;
    private m_sync: GLFenceSync;
    private glctx:GLContext;
    public constructor(glctx:GLContext,buffersize:number,dynamic:boolean = true){
        const gl = glctx.gl;
        let pb = gl.createBuffer();
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER,pb);
        gl.bufferData(gl.PIXEL_PACK_BUFFER,buffersize,dynamic? gl.DYNAMIC_READ: gl.STATIC_READ);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER,null);
        this.m_pb= pb;

        this.glctx= glctx;
    }

    public release(){
        if(this.glctx == null) return;

        const gl =this.glctx.gl;
        if(this.m_pb != null){
            gl.deleteBuffer(this.m_pb);
            this.m_pb = null;
        }

        this.glctx = null;
    }

    public readPixelsSync(rect:vec4,format:number,type:GLDataType,dstbuffer:ArrayBufferView,dstoffset:number =0,length?:number){
        const pb = this.m_pb;
        const gl = this.glctx.gl;
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER,pb);
        gl.readPixels(rect.x,rect.y,rect.z,rect.w,format,type,0);

        gl.getBufferSubData(gl.PIXEL_PACK_BUFFER,0,dstbuffer,dstoffset,length);
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER,null);
    }

    public readPixelsAsync(rect:vec4,format:number,type:GLDataType,dstbuffer:ArrayBufferView,cb:(ArrayBufferView)=>void,dstoffset:number =0,length?:number){
        let sync = this.m_sync;
        if(this.m_sync == null){
            sync = new GLFenceSync(this.glctx,true);
            this.m_sync = sync;
        }
        else{
            if(sync.pending){
                console.error("previous async readPixels operation is not finished, skip new operations");
                return;
            }
        }
        var pb = this.m_pb;
        var gl = this.glctx.gl;
        gl.bindBuffer(gl.PIXEL_PACK_BUFFER,pb);
        gl.readPixels(rect.x,rect.y,rect.z,rect.w,format,type,0);
        
        sync.emit(()=>{
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER,pb);
            gl.getBufferSubData(gl.PIXEL_PACK_BUFFER,0,dstbuffer,dstoffset,length);
            gl.bindBuffer(gl.PIXEL_PACK_BUFFER,null);
            cb(dstbuffer);
        });
    }

}
