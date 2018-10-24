import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "wglut";


export interface IRenderPipeline{
    graphicRender:GraphicsRender;
    reload();
    resizeFrameBuffer(width:number,height:number);
    release();
    exec(data:any);
    onRenderToCanvas();
    onInitGL(gl:GLContext);
    onSetupRender(info:GraphicsRenderCreateInfo);
}