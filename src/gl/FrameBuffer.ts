import { Texture2D } from "../Texture2D";
import { RenderTexture } from "../RenderTexture";
import { GLContext } from "./GLContext";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { IGraphicObj } from "../IGraphicObj";
import { GL } from "./GL";


interface FrameBufferCreateDesc{
    depthTex?:Texture2D,
    depthStencil?:Texture2D,
    colorTex0?:Texture2D,
    colorTex1?:Texture2D,
    colorTex2?:Texture2D,
    colorTex3?:Texture2D,
}

export interface FrameBufferTexDesc {colFmt?:number,depthFmt?:number,depthstencilFmt?:number};

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
        let glfb = glctx.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        return fb;
    }

    public static create(glctx:GLContext,width:number,height:number,texdesc: FrameBufferTexDesc){
        let glfb = glctx.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        glctx.bindFramebuffer(GL.FRAMEBUFFER,glfb);

        glctx.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
        if(texdesc.colFmt != undefined){
            let coltex = Texture2D.createTexture2D(width,height,{
                internalformat: texdesc.colFmt,
            },glctx);
            fb.bindTexutre(glctx,coltex,GL.COLOR_ATTACHMENT0);
        }
        if(texdesc.depthFmt != undefined){
            let deptex = Texture2D.createTexture2D(width,height,{
                internalformat: texdesc.depthFmt
            },glctx);
            fb.bindTexutre(glctx,deptex,GL.DEPTH_ATTACHMENT)
        }
        else if(texdesc.depthstencilFmt != undefined){
            let dstex = Texture2D.createTexture2D(width,height,{
                internalformat:texdesc.depthstencilFmt
            },glctx);
            fb.bindTexutre(glctx,dstex,GL.DEPTH_STENCIL_ATTACHMENT)
        }
        glctx.bindFramebuffer(GL.FRAMEBUFFER,null);

        return fb;
    }

    public static createFromTexture(glctx:GLContext,desc:FrameBufferCreateDesc):FrameBuffer{
        let glfb = glctx.createFramebuffer();
        let fb = new FrameBuffer();
        fb.m_rawobj = glfb;
        glctx.bindFramebuffer(GL.FRAMEBUFFER,glfb);
        
        fb.bindTexutre(glctx,desc.depthTex,GL.DEPTH_ATTACHMENT);
        fb.bindTexutre(glctx,desc.depthStencil,GL.DEPTH_STENCIL_ATTACHMENT);
        fb.bindTexutre(glctx,desc.colorTex0,GL.COLOR_ATTACHMENT0);
        fb.bindTexutre(glctx,desc.colorTex1,GL.COLOR_ATTACHMENT1);
        fb.bindTexutre(glctx,desc.colorTex2,GL.COLOR_ATTACHMENT2);
        fb.bindTexutre(glctx,desc.colorTex3,GL.COLOR_ATTACHMENT3);

        glctx.bindFramebuffer(GL.FRAMEBUFFER,null);

        return fb;
    }

    public resize(glctx:GLContext,width:number,height:number):boolean{
        if(width == null || height == null){
            throw new Error("resize framebuffer invalid param!");
        }
        if(this.m_width == width && this.m_height == height) return false;

        let fbtex = this.m_texbinding;

        let curfb = glctx.bindingFBO;
        glctx.bindGLFramebuffer(this);
        for (const key in fbtex) {
            if (fbtex.hasOwnProperty(key)) {
                const tex = fbtex[key];
                if(tex != null){
                    tex.resize(width,height,glctx);
                    glctx.framebufferTexture2D(GL.FRAMEBUFFER,Number.parseInt(key),GL.TEXTURE_2D,tex.getRawTexture(),0);
                }
            }
        }
        glctx.bindGLFramebuffer(curfb);

        this.m_width = width;
        this.m_height = height;
        return true;
    }


    private bindTexutre(glctx:GLContext,tex:Texture2D,attatch:number){
        if(tex ==null) return;
        glctx.framebufferTexture2D(GL.FRAMEBUFFER,attatch,GL.TEXTURE_2D,tex.getRawTexture(),0);
        this.m_texbinding[attatch] = tex;
        if(attatch == GL.COLOR_ATTACHMENT0){
            this.m_coltex = tex;
        }
        else if(attatch == GL.DEPTH_ATTACHMENT){
            this.m_depthtex = tex;
        }
        else if(attatch == GL.DEPTH_STENCIL_ATTACHMENT){
            this.m_depthtex = tex;
        }
    }

    public release(glctx:GLContext){
        glctx.bindFramebuffer(GL.FRAMEBUFFER,null);
        glctx.deleteFramebuffer(this.m_rawobj);
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
