import { Texture2D } from "../Texture2D";
import { RenderTexture } from "../RenderTexture";
import { GLContext } from "./GLContext";




export class FrameBuffer{

    private m_rawobj:WebGLFramebuffer;
    private m_texbinding:{[attatch:number]:Texture2D} = {};
    
    private constructor(){

    }


    public static create(glctx:GLContext):FrameBuffer{
        let gl = glctx.getWebGLRenderingContext();
        let glfb = gl.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        return fb;
    }

    public static createFromTexture(glctx:GLContext,tex:Texture2D):FrameBuffer{
        const gl = glctx.getWebGLRenderingContext();

        let glfb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER,glfb);
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        return null;
    }

    public createFromRenderTex(glctx:GLContext,rtex:RenderTexture):FrameBuffer{

        return null;
    }

    public release(glctx:GLContext){

    }
}
