import { IRenderPipeline } from "./IRenderPipeline";
import { RenderModel } from "./RenderModel";
import { GLContext, FrameBuffer, FrameBufferTexDesc } from "../gl";
import { GraphicsRender, RenderNodeList, GraphicsRenderCreateInfo } from "../core";
import { IRenderModel } from "./IRenderModel";



export abstract class RenderPipelineBase<T extends IRenderModel> implements IRenderPipeline{
    public graphicRender:GraphicsRender;   
    public glctx: GLContext;
    public nodeList: RenderNodeList;
    public model: IRenderModel;
    public mainFrameBuffer:FrameBuffer;

    abstract exec();

    abstract reload();
    abstract release();

    onSetupRender(glctx: GLContext, info: GraphicsRenderCreateInfo){

        let desc:FrameBufferTexDesc = {
            colFmt: info.colorFormat,
            depthFmt: info.depthFormat,
        };
        this.mainFrameBuffer = FrameBuffer.create(glctx,glctx.canvasWidth,glctx.canvasHeight,desc);
        this.glctx= glctx;
    }

    onRenderToCanvas() {
        this.glctx.bindGLFramebuffer(null);
        const mainfb = this.mainFrameBuffer;
        if(mainfb == null) return;

        this.glctx.viewport(0,0,mainfb.width,mainfb.height);
        this.model.drawFullScreen(mainfb.coltex);
    }

    resizeFrameBuffer(width: number, height: number){
        let glctx= this.glctx;
        let mainfb = this.mainFrameBuffer;
        if(mainfb== null) return;
        mainfb.resize(glctx,width,height);
        glctx.viewport(0,0,width,height);

        console.log('resize',width,height);
    }

    

}