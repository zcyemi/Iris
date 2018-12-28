import { IRenderPipeline } from "./IRenderPipeline";
import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "../gl/GLContext";
import { RenderPass } from "../render/RenderPass";
import { PassDebug } from "../render/PassDebug";
import { PassDepth } from "../render/PassDepth";
import { type } from "os";
import { PassShadowMap } from "../render/PassShadowMap";
import { PassSkybox } from "../render/PassSkybox";
import { FrameBuffer } from "../gl/FrameBuffer";
import { RenderModel } from "./RenderModel";
import { ReleaseGraphicObj } from "../IGraphicObj";

type PassCtor<T> = new(pipeline:IRenderPipeline)=>T;


class StackedPipelineBuildOptions{
    passes: PassCtor<any>[];
}

export class StackedPipeline implements IRenderPipeline{
    public graphicRender:GraphicsRender;

    private m_buildopt:StackedPipelineBuildOptions;
    private m_mainfb:FrameBuffer;
    private m_glctx:GLContext;

    private m_model:RenderModel;

    public constructor (buildopt:StackedPipelineBuildOptions){
        this.m_buildopt = buildopt;
    }

    onSetupRender(glctx:GLContext, info:GraphicsRenderCreateInfo){
        let fb = FrameBuffer.create(glctx,glctx.canvasWidth,glctx.canvasHeight,{colFmt:info.colorFormat,depthFmt:info.depthFormat});
        this.m_mainfb =fb;
        this.m_glctx = glctx;
    }

    public onInitGL(){};

    
    resizeFrameBuffer(width: number, height: number) {
        if(this.m_mainfb.resize(this.m_glctx,width,height)){
            this.m_glctx.viewport(0,0,width,height);
        }

    }

    exec(data: any) {
        
    }
    onRenderToCanvas(){
        //render to canvas;
    }

    reload() {
    
    }
    release() {
        const glctx =this.m_glctx;
        this.m_model = ReleaseGraphicObj(this.m_model,glctx);
        this.m_mainfb = ReleaseGraphicObj(this.m_mainfb,glctx);
        this.m_glctx =null;
    }

}
