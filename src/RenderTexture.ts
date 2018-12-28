import { GLContext } from "./gl/GLContext";
import { ITexture, TextureCreationDesc, TextureType, TextureDescUtility } from "./Texture";
import { Texture2D } from "./Texture2D";
import { FrameBuffer } from "./gl/FrameBuffer";




export class RenderTexture implements ITexture{

    private m_valid:boolean;
    private m_fb:FrameBuffer;
    private m_desc:TextureCreationDesc;
    private m_rawtex:Texture2D;

    public getDesc():TextureCreationDesc{
        return this.m_desc;
    }

    public getRawTexture():WebGLTexture{
        return this.m_rawtex;;
    }

    public get internalFB():FrameBuffer{
        return this.m_fb;
    }

    private constructor(){
        
    }

    /**
     * @TODO this may need trefactoring
     * @param glctx 
     * @param width 
     * @param height 
     */
    public resize(glctx:GLContext,width:number,height:number){
        if(this.m_fb.resize(glctx,width,height)){
            this.m_rawtex = this.internalGetFBtex(TextureDescUtility.getTexFmtType(this.m_desc.internalformat));
        }
    }

    private internalGetFBtex(type:TextureType){
        let fb = this.m_fb;
        if(type == TextureType.Color){
            return fb.coltex;
        }
        return fb.depthtex;
    }

    public static create(glctx:GLContext,width:number,height:number,desc:TextureCreationDesc):RenderTexture{
        let fb = FrameBuffer.create(glctx,width,height,{colFmt: desc.internalformat});
        let rt =new RenderTexture();
        rt.m_fb = fb;
        rt.m_desc = desc;
        rt.m_valid = true;
        rt.m_rawtex = rt.internalGetFBtex(TextureDescUtility.getTexFmtType(desc.internalformat));
        return rt;
    }

    public release(glctx:GLContext){
        this.m_rawtex = null;
        this.m_fb.release(glctx);
        this.m_fb= null;
        this.m_valid = false;
    }
}
