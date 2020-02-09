import { GLContext } from "../gl/GLContext";
import { GraphicsContext } from "./GraphicsContext";


export interface IGraphicObj{
    release(glctx?:GLContext);
}

export function ReleaseGraphicObj(gobj:IGraphicObj,glctx:GLContext){
    if(gobj == null) return;
    gobj.release(glctx);
    return null;
}

export class GraphicsObj implements IGraphicObj {


    protected glctx:GLContext;
    constructor() {
        this.glctx = GraphicsContext.glctx;
    }

    release(glctx?: GLContext) {
    }
}