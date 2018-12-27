import { Texture2D } from "../Texture2D";
import { RenderTexture } from "../RenderTexture";
import { GLContext } from "./GLContext";
import { ShaderFX } from "../shaderfx/ShaderFX";


export type FrameBufferTex = Texture2D | RenderTexture;


interface FrameBufferCreateDesc{
    depthTex?:FrameBufferTex,
    depthStencil?:FrameBufferTex,
    colorTex0?:FrameBufferTex,
    colorTex1?:FrameBufferTex,
    colorTex2?:FrameBufferTex,
    colorTex3?:FrameBufferTex,
}




export class FrameBuffer{

    private m_rawobj:WebGLFramebuffer;
    private m_texbinding:{[attatch:number]:FrameBufferTex} = {};
    
    private constructor(){

    }

    public static createEmpty(glctx:GLContext):FrameBuffer{
        let gl = glctx.getWebGLRenderingContext();
        let glfb = gl.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        return fb;
    }
    

    public static create(glctx:GLContext,width:number,height:number,texdesc: {colFmt?:number,depthFmt?:number,depthstencilFmt?:number}){
        const gl = glctx.getWebGLRenderingContext();
        let glfb = gl.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        gl.bindFramebuffer(gl.FRAMEBUFFER,glfb);

        gl.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
        if(texdesc.colFmt != undefined){
            let coltex = Texture2D.createTexture2D(width,height,null,glctx);
            fb.bindTexutre(glctx,coltex,gl.COLOR_ATTACHMENT0);
        }
        if(texdesc.depthFmt != undefined){
            let deptex = Texture2D.createTexture2D(width,height,null,glctx);
            fb.bindTexutre(glctx,deptex,gl.DEPTH_ATTACHMENT)
        }
        else if(texdesc.depthstencilFmt != undefined){
            let dstex = Texture2D.createTexture2D(width,height,null,glctx);
            fb.bindTexutre(glctx,dstex,gl.DEPTH_STENCIL_ATTACHMENT)
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);


        return fb;
    }

    public static createFromTexture(glctx:GLContext,desc:FrameBufferCreateDesc):FrameBuffer{
        const gl = glctx.getWebGLRenderingContext();
        let glfb = gl.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        gl.bindFramebuffer(gl.FRAMEBUFFER,glfb);
        
        fb.bindTexutre(glctx,desc.depthTex,gl.DEPTH_ATTACHMENT);
        fb.bindTexutre(glctx,desc.depthStencil,gl.DEPTH_STENCIL_ATTACHMENT);
        fb.bindTexutre(glctx,desc.colorTex0,gl.COLOR_ATTACHMENT0);
        fb.bindTexutre(glctx,desc.colorTex1,gl.COLOR_ATTACHMENT1);
        fb.bindTexutre(glctx,desc.colorTex2,gl.COLOR_ATTACHMENT2);
        fb.bindTexutre(glctx,desc.colorTex3,gl.COLOR_ATTACHMENT3);

        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        return fb;
    }


    public bindTexutre(glctx:GLContext,tex:FrameBufferTex,attatch:number){
        if(tex ==null) return;
        const gl = glctx.gl;
        gl.framebufferTexture2D(gl.FRAMEBUFFER,attatch,gl.TEXTURE_2D,tex,0);
        this.m_texbinding[attatch] = tex;
    }
    



    public createFromRenderTex(glctx:GLContext,rtex:RenderTexture):FrameBuffer{

        return null;
    }

    public release(glctx:GLContext){

    }
}
