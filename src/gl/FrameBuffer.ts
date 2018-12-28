import { Texture2D } from "../Texture2D";
import { RenderTexture } from "../RenderTexture";
import { GLContext } from "./GLContext";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { IGraphicObj } from "../IGraphicObj";


interface FrameBufferCreateDesc{
    depthTex?:Texture2D,
    depthStencil?:Texture2D,
    colorTex0?:Texture2D,
    colorTex1?:Texture2D,
    colorTex2?:Texture2D,
    colorTex3?:Texture2D,
}

export class FrameBuffer implements IGraphicObj{

    private m_rawobj:WebGLFramebuffer;
    private m_texbinding:{[attatch:number]:Texture2D} = {};
    private m_coltex:Texture2D;
    private m_depthtex:Texture2D;
    private m_width:number;
    private m_height:number;

    public get width():number{return this.m_width;}
    public get height():number{ return this.m_height;}

    public get coltex():Texture2D{ return this.m_coltex;}
    public get depthtex():Texture2D{ return this.m_depthtex;}

    public get attachments():{[attatch:number]:Texture2D}{
        return this.m_texbinding;
    }

    
    public get rawobj():WebGLFramebuffer{
        return this.m_rawobj;
    }
    
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
            let coltex = Texture2D.createTexture2D(width,height,{
                internalformat: texdesc.colFmt,
            },glctx);
            fb.bindTexutre(glctx,coltex,gl.COLOR_ATTACHMENT0);
        }
        if(texdesc.depthFmt != undefined){
            let deptex = Texture2D.createTexture2D(width,height,{
                internalformat: texdesc.depthFmt
            },glctx);
            fb.bindTexutre(glctx,deptex,gl.DEPTH_ATTACHMENT)
        }
        else if(texdesc.depthstencilFmt != undefined){
            let dstex = Texture2D.createTexture2D(width,height,{
                internalformat:texdesc.depthstencilFmt
            },glctx);
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

    public resize(glctx:GLContext,width:number,height:number):boolean{
        if(width == null || height == null){
            throw new Error("resize framebuffer invalid param!");
        }
        if(this.m_width == width && this.m_height == height) return false;

        const gl = glctx.gl;
        let fbtex = this.m_texbinding;

        const fb = this.m_rawobj;

        let curfb = glctx.bindingFBO;
        glctx.bindFramebuffer(this);
        for (const key in fbtex) {
            if (fbtex.hasOwnProperty(key)) {
                const tex = fbtex[key];
                if(tex != null){
                    tex.resize(width,height,glctx);
                    gl.framebufferTexture2D(gl.FRAMEBUFFER,Number.parseInt(key),gl.TEXTURE_2D,tex.getRawTexture(),0);
                }
            }
        }
        glctx.bindFramebuffer(curfb);
    
        this.m_width = width;
        this.m_height = height;
        return true;
    }


    public bindTexutre(glctx:GLContext,tex:Texture2D,attatch:number){
        if(tex ==null) return;
        const gl = glctx.gl;
        gl.framebufferTexture2D(gl.FRAMEBUFFER,attatch,gl.TEXTURE_2D,tex.getRawTexture(),0);
        this.m_texbinding[attatch] = tex
        if(attatch == gl.COLOR_ATTACHMENT0){
            this.m_coltex = tex;
        }
        else if(attatch == gl.DEPTH_ATTACHMENT){
            this.m_depthtex = tex;
        }
        else if(attatch == gl.DEPTH_STENCIL_ATTACHMENT){
            this.m_depthtex = tex;
        }

        this.m_width = tex.width;
        this.m_height = tex.height;
    }

    public release(glctx:GLContext){
        const gl = glctx.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.deleteFramebuffer(this.m_rawobj);
        this.m_rawobj = null;

        let fbtex = this.m_texbinding;
        for (const key in fbtex) {
            if (fbtex.hasOwnProperty(key)) {
                let tex = fbtex[key];
                if(tex != null) tex.release(glctx);
                fbtex[key] = null;
            }
        }

        this.m_texbinding = {};
        this.m_coltex = null;
        this.m_width = null;
        this.m_height = null;
    }
}
