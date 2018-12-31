import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "../gl/GLContext";
import { RenderNodeList } from "../RenderNodeList";
import { RenderModel } from "./RenderModel";
import { GLPipelineState } from "../gl/GLPipelineState";
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


