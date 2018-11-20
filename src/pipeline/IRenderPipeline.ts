import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "../gl/GLContext";


export interface IRenderPipeline{
    graphicRender:GraphicsRender;

    resizeFrameBuffer(width:number,height:number);
    
    exec(data:any);
    onRenderToCanvas();
    
    onSetupRender(glctx:GLContext,info:GraphicsRenderCreateInfo);

    init();
    reload();
    release();
}
