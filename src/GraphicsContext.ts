import { GraphicsRender } from "./GraphicsRender";

export class GraphicsContext{

    private static m_currentRender:GraphicsRender;
    public static get currentRender(){ return GraphicsContext.m_currentRender;}

    public static activeRender(g:GraphicsRender){
        GraphicsContext.m_currentRender =g;
    }
}