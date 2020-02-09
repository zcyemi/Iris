import { GLContext } from "./GLContext";
import { vec4 } from "../math/GLMath";
import { GLDataType, GL } from "./GL";
import { read } from "fs";
import { GLFenceSync } from "./GLFenceSync";


export class GLPixelPack{
    private m_pb:WebGLBuffer;
    private m_sync: GLFenceSync;
    private glctx:GLContext;
    public constructor(glctx:GLContext,buffersize:number,dynamic:boolean = true){
        let pb = glctx.createBuffer();
        glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,pb);
        glctx.bufferData(GL.PIXEL_PACK_BUFFER,buffersize,dynamic? GL.DYNAMIC_READ: GL.STATIC_READ);
        glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,null);
        this.m_pb= pb;

        this.glctx= glctx;
    }

    public release(){
        const glctx = this.glctx;
        if(glctx == null) return;

        if(this.m_pb != null){
            glctx.deleteBuffer(this.m_pb);
            this.m_pb = null;
        }

        this.glctx = null;
    }

    public readPixelsSync(rect:vec4,format:number,type:GLDataType,dstbuffer:ArrayBufferView,dstoffset:number =0,length?:number){
        const pb = this.m_pb;

        const glctx = this.glctx;
        glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,pb);
        glctx.readPixels(rect.x,rect.y,rect.z,rect.w,format,type,0);

        glctx.getBufferSubData(GL.PIXEL_PACK_BUFFER,0,dstbuffer,dstoffset,length);
        glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,null);
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
        const glctx = this.glctx;
        glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,pb);
        glctx.readPixels(rect.x,rect.y,rect.z,rect.w,format,type,0);
        
        sync.emit(()=>{
            glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,pb);
            glctx.getBufferSubData(GL.PIXEL_PACK_BUFFER,0,dstbuffer,dstoffset,length);
            glctx.bindBuffer(GL.PIXEL_PACK_BUFFER,null);
            cb(dstbuffer);
        });
    }

}
