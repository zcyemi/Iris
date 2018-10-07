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

    private m_bufferInfo:GraphicsRenderBufferInfo;
    private m_renderFrameBuffer:GLFrameBuffer;


    private m_renderPipeline:RenderPipeline;


    private m_shaderFXlib:ShaderFXLibs;

    public shadowConfig:ShadowConfig = new ShadowConfig();


    public get pipeline():RenderPipeline{
        return this.m_renderPipeline;
    }
    public set pipeline(p:RenderPipeline){
        this.m_renderPipeline = p;
        p.graphicRender = this;
    }

    public get shaderLib():ShaderFXLibs{
        return this.m_shaderFXlib;
    }

    public constructor(glctx:GLContext,bufferInfo?:GraphicsRenderBufferInfo){
        this.glctx = glctx;

        this.m_shaderFXlib = new ShaderFXLibs(glctx);

        if(bufferInfo == null){
            this.m_bufferInfo = new GraphicsRenderBufferInfo();
        }
        else{
            this.m_bufferInfo = bufferInfo;
        }
        this.createBuffer();
    }
    private createBuffer(){
        let bufferinfo = this.m_bufferInfo;
        let fb = this.glctx.createFrameBuffer(true,bufferinfo.colorFormat,bufferinfo.depthFormat);
        this.m_renderFrameBuffer = fb;

        let gl = this.glctx.gl;
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
    }
    public render(scene:Scene,ts:number){
        let gl =this.glctx.gl;

        gl.clearColor(0,0,0,1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let p = this.pipeline;
        if(p == null) return;
        p.exec(scene,this.glctx,this.m_renderFrameBuffer);
    }
    public renderToCanvas(){
        this.glctx.drawTexFullscreen(this.m_renderFrameBuffer.colorTex0,false,false);
    }
}