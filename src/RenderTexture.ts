import { GLContext } from "./gl/GLContext";
import { ITexture, TextureCreationDesc } from "./Texture";
import { Texture2D } from "./Texture2D";
import { FrameBuffer } from "./gl/FrameBuffer";





export class RenderTexture implements ITexture{

    private m_valid:boolean;
    private m_fb:FrameBuffer;
    private m_desc:TextureCreationDesc;

    public getDesc():TextureCreationDesc{
        return this.m_desc;
    }

    public getRawTexture():WebGLTexture{
        return this.m_fb.coltex;
    }

    private constructor(){
        
    }

    public static create(glctx:GLContext,width:number,height:number,desc:TextureCreationDesc):RenderTexture{
        let fb = FrameBuffer.create(glctx,width,height,{colFmt: desc.internalformat});
        let rt =new RenderTexture();
        rt.m_fb = fb;
        rt.m_desc = desc;
        rt.m_valid = true;
        return null;
    }

    public release(glctx:GLContext){
        this.m_fb.release(glctx);
        this.m_fb= null;
        this.m_valid = false;
    }
}
