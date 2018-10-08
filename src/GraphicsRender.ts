import { GLContext, vec4, GLFrameBuffer } from "wglut";
import { RenderPipeline } from "./RenderPipeline";
import { Scene } from "./Scene";
import { ShaderFXLibs } from "./shaderfx/ShaderFXLibs";
import { ShadowConfig } from "./render/Shadow";


export class GraphicsRenderBufferInfo{
    public colorFormat:number = 0x8058;
    public depthFormat:number = 0x81A6;
}


export class GraphicsRender{

    private glctx:GLContext;

    private m_renderFrameBuffer:GLFrameBuffer;

    private m_renderPipeline:RenderPipeline;


    private m_shaderFXlib:ShaderFXLibs;

    public shadowConfig:ShadowConfig = new ShadowConfig();


    public get pipeline():RenderPipeline{
        return this.m_renderPipeline;
    }

    public get shaderLib():ShaderFXLibs{
        return this.m_shaderFXlib;
    }

    public constructor(glctx:GLContext,pipeline:RenderPipeline,bufferInfo?:GraphicsRenderBufferInfo){
        this.glctx = glctx;
        this.m_renderPipeline = pipeline;
        this.m_shaderFXlib = new ShaderFXLibs(glctx);
        pipeline.graphicRender = this;
        pipeline.onInitGL(glctx);
        pipeline.onSetupRender(bufferInfo);
    }

    public render(scene:Scene,ts:number){
        let gl =this.glctx.gl;

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