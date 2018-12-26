import { Texture } from "../Texture";
import { RenderTexture } from "../RenderTexture";
import { GLContext } from "./GLContext";



export class FrameBuffer{

    private m_rawobj:WebGLFramebuffer;
    private m_texbinding:{[attatch:number]:}
    
    private constructor(){

    }


    public static create(glctx:GLContext):FrameBuffer{
        let gl = glctx.getWebGLRenderingContext();
        let glfb = gl.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        return fb;
    }

    public static createFromTexture(glctx:GLContext,tex:Texture):FrameBuffer{
        const gl = glctx.getWebGLRenderingContext();

        let 

        return null;
    }

    public createFromRenderTex(glctx:GLContext,rtex:RenderTexture):FrameBuffer{

        return null;
    }

    public release(glctx:GLContext){

    }
}
