import { GLProgram } from "../gl/GLProgram";
import { mat4 } from "../math/GLMath";
import { BaseRender } from "../BaseRender";
import { PipelineBase } from "./PipelineBase";
import { ShaderDataBasis, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { FrameBuffer } from "../gl/FrameBuffer";
import { GLContext } from "../gl/GLContext";
import { IGraphicObj, ReleaseGraphicObj } from "../IGraphicObj";
import { IRenderPipeline } from "./IRenderPipeline";
import { ShaderUniformBuffer } from "../shaderfx/ShaderUniformBuffer";


/**
 * @todo add internal res to graphics render
 */
export class RenderModel implements IGraphicObj{

    private m_uniformBasis:ShaderUniformBuffer<ShaderDataBasis>;
    private m_uniformObj:ShaderUniformBuffer<ShaderDataUniformObj>;
    private m_uniformLight:ShaderUniformBuffer<ShaderDataUniformLight>;
    private m_uniformShadowMap:ShaderUniformBuffer<ShaderDataUniformShadowMap>;

    public constructor(pipeline:IRenderPipeline){
        const glctx = pipeline.graphicRender.glctx;

        this.m_uniformObj = new ShaderUniformBuffer(glctx,ShaderDataUniformObj,0);
        this.m_uniformBasis = new ShaderUniformBuffer(glctx,ShaderDataBasis,1);
        this.m_uniformShadowMap = new ShaderUniformBuffer(glctx,ShaderDataUniformShadowMap,2);
        this.m_uniformLight = new ShaderUniformBuffer(glctx,ShaderDataUniformLight,3);
    }


    public bindUniform(program:GLProgram){

    }

    public updateUniformMtx(objmtx?:mat4){

    }

    public updateUniformRender(render?:BaseRender){

    }

    public release(glctx:GLContext){
        this.m_uniformObj = ReleaseGraphicObj(this.m_uniformObj,glctx);
        this.m_uniformBasis = ReleaseGraphicObj(this.m_uniformBasis,glctx);
        this.m_uniformLight = ReleaseGraphicObj(this.m_uniformLight,glctx);
        this.m_uniformShadowMap = ReleaseGraphicObj(this.m_uniformShadowMap,glctx);
    }

}
