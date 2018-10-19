import { GLContext, vec4, GLFrameBuffer } from "wglut";
import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "./Scene";
import { ShaderFXLibs } from "./shaderfx/ShaderFXLibs";
import { ShadowConfig } from "./render/Shadow";
import { DebugEntry } from "./DebugEntry";
import { Delayter } from "./Utility";
import { Texture } from "./Texture";
import { Material } from "./Material";


export class GraphicsRenderCreateInfo{
    public colorFormat:number = 0x8058;
    public depthFormat:number = 0x81A6;
    public frameBufferResizeDelay:number = 250;
}

export class GraphicsRender{
    private m_glctx:GLContext;
    private canvas:HTMLCanvasElement;
    private m_creationInfo:GraphicsRenderCreateInfo;

    private m_defaultTexture:Texture;

    public static readonly TEXID_FB:number = 0;
    public static readonly TEXID_TEMP:number = 2;
    public static readonly TEXID_DEFAULT_TEX:number = 3;
    public static readonly TEXID_SHADER_TEX:number[] = [4,5,6,7,8,9,10,11];
    public static readonly TEXID_SHADOW_MAP:number[] = [15,16,17,18];


    private m_renderPipeline:RenderPipeline;
    private m_shaderFXlib:ShaderFXLibs;
    public shadowConfig:ShadowConfig = new ShadowConfig();

    public pause:boolean = false;
    private m_frameBufferInvalid:boolean = false;

    public get pipeline():RenderPipeline{
        return this.m_renderPipeline;
    }

    public get shaderLib():ShaderFXLibs{
        return this.m_shaderFXlib;
    }

    public get glctx():GLContext{
        return this.m_glctx;
    }

    public get defaultTexture():Texture{
        return this.m_defaultTexture;
    }


    public constructor(canvas:HTMLCanvasElement,pipeline:RenderPipeline,creationInfo?:GraphicsRenderCreateInfo){
        this.canvas = canvas;



        if(creationInfo == null){
            creationInfo = new GraphicsRenderCreateInfo();
            this.m_creationInfo = creationInfo;
        }


        var glctx = <GLContext>GLContext.createFromCanvas(canvas, {
            antialias: true,
            alpha: false,
            depth: false,
            stencil:false
        });
        this.m_glctx = glctx;

        this.m_renderPipeline = pipeline;
        this.m_shaderFXlib = new ShaderFXLibs(glctx);
        

        //default texture
        let gl = glctx.gl;

        Material.DEF_TEXID_NUM = GraphicsRender.TEXID_DEFAULT_TEX;
        Texture.TEMP_TEXID = gl.TEXTURE2;

        
        this.m_defaultTexture = Texture.crateEmptyTexture(2,2,glctx);
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D,this.m_defaultTexture.rawtexture);
        
        gl.frontFace(gl.CCW);

        pipeline.graphicRender = this;
        pipeline.onInitGL(glctx);
        pipeline.onSetupRender(creationInfo);
    }

    public reload(){
        //TODO
        //this.m_shaderFXlib.reload();
        this.m_renderPipeline.reload();
    }

    private m_resizeDelayter: Delayter = new Delayter();
    public resizeCanvas(w:number,h:number){

        let canvas = this.canvas;

        if(canvas.width == w && canvas.width == h) return;

        
        if(w <=0 || h <=0){
            this.m_frameBufferInvalid = true
            return;
        }
        else{
            this.m_frameBufferInvalid = false;
        }
        
        let delay = this.m_creationInfo.frameBufferResizeDelay;
        if(delay == 0){
            canvas.width = w;
            canvas.height = h;
            this.m_renderPipeline.resizeFrameBuffer(w,h);
            return;
        }
        else{
            let delayter=  this.m_resizeDelayter;
            delayter.delaytime = delay;
            delayter.emit(()=>{
                canvas.width = w;
                canvas.height = h;
                this.m_renderPipeline.resizeFrameBuffer(w,h);
            })
        }
    }


    public render(scene:Scene){
        if(this.pause || this.m_frameBufferInvalid) return;
        let gl =this.m_glctx.gl;

        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let p = this.pipeline;
        if(p == null) return;
        p.exec(scene);
    }

    public renderToCanvas(){
        this.pipeline.onRenderToCanvas();
    }
}