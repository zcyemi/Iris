import { IRenderPipeline } from "./IRenderPipeline";
import { GraphicsRender, GraphicsRenderCreateInfo } from "../core";
import { GLContext, FrameBuffer, GL } from "../gl";
import { RenderNodeList } from "../core/RenderNodeList";
import { RenderModel } from "./RenderModel";


export class MultiViewPipeline implements IRenderPipeline{
    graphicRender: GraphicsRender;    
    glctx: GLContext;
    nodeList: RenderNodeList;
    model: RenderModel;
    public get mainFrameBuffer(): FrameBuffer{
        return this.m_mainfb;
    }

    private m_mainfb:FrameBuffer;

    exec(data: any) {
    }

    onSetupRender(glctx:GLContext, info: GraphicsRenderCreateInfo) {
        this.m_mainfb = FrameBuffer.create(glctx,glctx.canvasWidth,glctx.canvasHeight,{colFmt:info.colorFormat,depthFmt:info.depthFormat});
        this.glctx = glctx;

    }
    
    onInitGL() {

    }

    resizeFrameBuffer(width: number, height: number) {
        let glctx = this.glctx;
        this.m_mainfb.resize(glctx,width,height);
        glctx.viewport(0,0,width,height);
    }

    onRenderToCanvas(){
        const glctx = this.glctx;
        glctx.bindGLFramebuffer(null);
        const mainfb = this.m_mainfb;

        var halfw = mainfb.width*0.5;
        var halfh = mainfb.height*0.5;
        glctx.viewport(0,halfh,halfw,halfw);
    }


    reload() {

    }
    release() {

    }




}