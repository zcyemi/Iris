import { GameObject } from "./GameObject";
import { Material } from "./Material";
import { GLContext } from "../gl/GLContext";

export abstract class BaseRender{

    public material:Material;
    protected m_object:GameObject;
    public get object():GameObject{return this.m_object;}
    public castShadow:boolean = false;

    public constructor(){
    }
    
    public abstract refreshData(glctx:GLContext)
    public abstract release(glctx:GLContext);
    public abstract draw(gl:WebGL2RenderingContext);

}
