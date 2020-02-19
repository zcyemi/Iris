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

export abstract class GraphicsObj implements IGraphicObj {

    private static s_objId:number = 1;

    public objId:number;

    protected glctx:GLContext;
    constructor() {

        this.objId= GraphicsObj.s_objId;
        GraphicsObj.s_objId++;

        this.glctx = GraphicsContext.glctx;
    }

    public abstract release(glctx?: GLContext);
}