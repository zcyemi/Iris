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
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { PipelineUtility } from "./PipelineUtility";
import { PipelineClearInfo } from "./RenderPipeline";

type PassCtor<T> = new(pipeline:IRenderPipeline)=>T;


class StackedPipelineBuildOptions{
    passes: PassCtor<any>[];
    clearinfo?:PipelineClearInfo;
}

export class StackedPipeline implements IRenderPipeline{
    public graphicRender:GraphicsRender;
    public clearInfo?:PipelineClearInfo;
    public get model():RenderModel{ return this.m_model;}
    public get nodeList():RenderNodeList{return this.m_renderNodeList;}
    public get mainFrameBuffer():FrameBuffer{return this.m_mainfb;}

    private m_buildopt:StackedPipelineBuildOptions;
    private m_mainfb:FrameBuffer;
    private m_glctx:GLContext;
    public get glctx():GLContext{ return this.m_glctx;}

    protected m_model:RenderModel;

    protected m_renderNodeList:RenderNodeList;
    protected m_renderPass:RenderPass[];
    

    public constructor (buildopt:StackedPipelineBuildOptions){
        this.m_buildopt = buildopt;
        this.clearInfo = buildopt.clearinfo;
    }

    onSetupRender(glctx:GLContext, info:GraphicsRenderCreateInfo){
        let fb = FrameBuffer.create(glctx,glctx.canvasWidth,glctx.canvasHeight,{colFmt:info.colorFormat,depthFmt:info.depthFormat});
        this.m_mainfb =fb;
        this.m_glctx = glctx;
        this.m_model = new RenderModel(this);
        this.m_renderNodeList = new RenderNodeList();
        this.onInitGL();
    }

    public onInitGL(){
        let renderpasses:RenderPass[] = [];

        let buildInfo = this.m_buildopt;
        const passes = buildInfo.passes;
        const passlen = passes.length;
        for(var t=0;t<passlen;t++){
            let pass = passes[t];
            let rp:RenderPass = new pass(this);
            renderpasses.push(rp);
        }
        this.m_renderPass = renderpasses;
    };

    
    resizeFrameBuffer(width: number, height: number) {
        if(this.m_mainfb.resize(this.m_glctx,width,height)){
            this.m_glctx.viewport(0,0,width,height);
            this.m_model.updateUnifromScreenParam(width,height);
        }
    }

    exec(data: any) {
        if(data == null) return;

        if(!(data instanceof Scene)){
            return;
        }

        const camera = data.mainCamera;
        if(camera == null) return;

        const model = this.m_model;
        model.updateUniformBasis(camera);
        const glctx = this.m_glctx;
        model.uniformBasis.uploadBufferData(glctx);

        const clearinfo =this.clearInfo;
        if(clearinfo != null){
            glctx.bindFramebuffer(this.m_mainfb);
            let ccol = clearinfo.color;
            if(ccol) glctx.clearColorAry(ccol.raw);
            let depth = clearinfo.depth;
            if(depth !=null) glctx.clearDepth(depth);
            glctx.clear(clearinfo.clearMask);;
        }

        let nodeList = this.m_renderNodeList;
        nodeList.reset();
        PipelineUtility.generateDrawList(data,nodeList);

        let passes = this.m_renderPass;
        let passeslen = passes.length;
        for(var t=0;t<passeslen;t++){
            passes[t].render(data);
        }
        
    }
    onRenderToCanvas(){
        //render to canvas;
        const glctx =this.m_glctx;
        glctx.bindFramebuffer(null);
        const mainfb = this.m_mainfb;
        glctx.viewport(0,0,mainfb.width,mainfb.height);
        this.m_model.drawFullScreen(this.m_mainfb.coltex);
    }

    reload() {
        throw new Error("not implemented");
    }
    release() {
        //release passes;
        let passes = this.m_renderPass;
        let passeslen = passes.length;
        for(var t=0;t<passeslen;t++){
            passes[t].release();
        }
        this.m_renderPass = null;

        const glctx =this.m_glctx;
        this.m_model = ReleaseGraphicObj(this.m_model,glctx);
        this.m_mainfb = ReleaseGraphicObj(this.m_mainfb,glctx);
        this.m_glctx =null;
    }

}
