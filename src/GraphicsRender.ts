import { GLContext, vec4, GLFrameBuffer } from "wglut";
import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "./Scene";
import { ShaderFXLibs } from "./shaderfx/ShaderFXLibs";
import { ShadowConfig } from "./render/Shadow";
import { DebugEntry } from "./DebugEntry";
import { Delayter } from "./Utility";


export class GraphicsRenderCreateInfo{
    public colorFormat:number = 0x8058;
    public depthFormat:number = 0x81A6;
    public frameBufferResizeDelay:number = 250;
}

export class GraphicsRender{
    private m_glctx:GLContext;
    private canvas:HTMLCanvasElement;
    private m_creationInfo:GraphicsRenderCreateInfo;

    private m_renderPipeline:RenderPipeline;
    private m_shaderFXlib:ShaderFXLibs;
    public shadowConfig:ShadowConfig = new ShadowConfig();

    public get pipeline():RenderPipeline{
        return this.m_renderPipeline;
    }

    public get shaderLib():ShaderFXLibs{
        return this.m_shaderFXlib;
    }

    public get glctx():GLContext{
        return this.m_glctx;
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
        pipeline.graphicRender = this;
        pipeline.onInitGL(glctx);
        pipeline.onSetupRender(creationInfo);
    }

    private m_resizeDelayter: Delayter = new Delayter();
    public resizeCanvas(w:number,h:number){
        let canvas = this.canvas;

        if(canvas.width == w && canvas.width == h) return;
        
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


    public render(scene:Scene,ts:number){
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