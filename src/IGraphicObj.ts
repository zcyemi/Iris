import { GLContext } from "./gl/GLContext";


export interface IGraphicObj{
    release(glctx?:GLContext);
}

export function ReleaseGraphicObj(gobj:IGraphicObj,glctx:GLContext){
    if(gobj == null) return;
    gobj.release(glctx);
    return null;
}