import { Scene } from "../Scene";
import { DoubleBuffered } from "../collection/DoubleBuffered";
import { RenderNodeList } from "../RenderNodeList";
import { PipelineUtility } from "./PipelineUtility";
import { type } from "os";
import { Mesh } from "../Mesh";
import { Material } from "../Material";
import { mat4 } from "../math/GLMath";
import { RenderModel } from "./RenderModel";
import { MeshRender } from "../MeshRender";
import { IRenderPipeline } from "./IRenderPipeline";
import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "../gl/GLContext";


/**
 * @todo
 * dependencies
 * @class <GLFramebuffer>
 * @class <RenderTexture>
 * 
 */
export class RenderPipeline implements IRenderPipeline{

    protected m_nodelist:DoubleBuffered<RenderNodeList>;
    protected m_model:RenderModel;

    public get graphicRender():GraphicsRender{
        return null;
    }
    public set graphicRender(val:GraphicsRender){

    }

    private m_glctx:GLContext;

    public onSetupRender(glctx:GLContext,info:GraphicsRenderCreateInfo){
        this.m_nodelist = new DoubleBuffered(new RenderNodeList(),new RenderNodeList());
        this.m_glctx = glctx;
    }

    public onInitGL(){};

    public resizeFrameBuffer(){

    }

    public exec(data:any){
        if(data == null) return;
    }

    public onRenderToCanvas(){

    }

    public reload(){

    }

    public release(){

    }

}
