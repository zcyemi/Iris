import { GraphicsRender } from "./GraphicsRender";
import { GLContext } from "../gl";

export class GraphicsContext{

    private static m_currentRender:GraphicsRender;

    public static m_glctx:GLContext;
    public static get currentRender(){ return GraphicsContext.m_currentRender;}
    public static get glctx():GLContext{return GraphicsContext.m_glctx;}

    public static activeRender(g:GraphicsRender){
        GraphicsContext.m_currentRender =g;
        GraphicsContext.m_glctx = g.glctx;
    }
}