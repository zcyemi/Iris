import { GLProgram } from "../gl/GLProgram";
import { mat4 } from "../math/GLMath";
import { BaseRender } from "../BaseRender";
import { PipelineBase } from "./PipelineBase";
import { ShaderDataBasis, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { FrameBuffer } from "../gl/FrameBuffer";
import { GLContext } from "../gl/GLContext";
import { IGraphicObj } from "../IGraphicObj";


/**
 * @todo add internal res to graphics render
 */
export class RenderModel implements IGraphicObj{
    
    public static readonly UNIFORMINDEX_OBJ: number = 0;
    public static readonly UNIFORMINDEX_BASIS: number = 1;
    public static readonly UNIFORMINDEX_SHADOWMAP: number = 2;
    public static readonly UNIFORMINDEX_LIGHT: number = 3;
    public static readonly UNIFORMINDEX_SHADER:number = 4;

    private m_uniformBufferObj: WebGLBuffer;
    private m_uniformBufferShadowMap: WebGLBuffer;
    private m_uniformBufferLight: WebGLBuffer;

    private m_shaderDataBasis: ShaderDataBasis;
    private m_shaderDataObj: ShaderDataUniformObj;
    private m_shaderDataShadowMap: ShaderDataUniformShadowMap;
    private m_shaderDataLight: ShaderDataUniformLight;

    private m_mainFramebuffer:FrameBuffer;


    public constructor(pipeline:PipelineBase){

    }


    public bindUniform(program:GLProgram){

    }

    public updateUniformMtx(objmtx?:mat4){

    }

    public updateUniformRender(render?:BaseRender){

    }

    public release(glctx:GLContext){
    }

}
