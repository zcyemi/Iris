import { GraphicsRender, GraphicsRenderCreateInfo } from "../core/GraphicsRender";
import { GLContext } from "../gl/GLContext";
import { RenderNodeList } from "../core/RenderNodeList";
import { RenderModel } from "./RenderModel";
import { FrameBuffer } from "../gl/FrameBuffer";

export interface IRenderPipeline{
    graphicRender:GraphicsRender;
    glctx:GLContext;
    nodeList:RenderNodeList;
    model:RenderModel;
    mainFrameBuffer:FrameBuffer;

    resizeFrameBuffer(width:number,height:number);
    
    exec(data:any);
    onRenderToCanvas();
    
    onSetupRender(glctx:GLContext,info:GraphicsRenderCreateInfo);
    onInitGL();
    reload();
    release();
}


