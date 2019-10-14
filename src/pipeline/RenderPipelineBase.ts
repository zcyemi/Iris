import { IRenderPipeline } from "./IRenderPipeline";
import { RenderModel } from "./RenderModel";
import { GLContext, FrameBuffer } from "../gl";
import { GraphicsRender, RenderNodeList, GraphicsRenderCreateInfo } from "../core";
import { IRenderModel } from "./IRenderModel";



export abstract class RenderPipelineBase<T extends IRenderModel> implements IRenderPipeline{
    public graphicRender:GraphicsRender;   
    public glctx: GLContext;
    public nodeList: RenderNodeList;
    public model: IRenderModel;
    public mainFrameBuffer:FrameBuffer;
    resizeFrameBuffer(width: number, height: number) {
        throw new Error("Method not implemented.");
    }
    exec(data: any) {
        throw new Error("Method not implemented.");
    }
    onRenderToCanvas() {
        throw new Error("Method not implemented.");
    }
    onSetupRender(glctx: GLContext, info: GraphicsRenderCreateInfo) {
        throw new Error("Method not implemented.");
    }
    onInitGL() {
        throw new Error("Method not implemented.");
    }
    reload() {
        throw new Error("Method not implemented.");
    }
    release() {
        throw new Error("Method not implemented.");
    }


}