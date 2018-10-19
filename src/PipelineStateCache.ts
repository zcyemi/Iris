import { ShaderTags, BlendFactor, BlendOperator } from "./shaderfx/Shader";
import { GLContext } from "wglut";

export class PipelineStateCache{

    private m_curtags:ShaderTags;

    private m_deftags:ShaderTags;
    private m_lastTags:ShaderTags;

    private gl:WebGL2RenderingContext;

    public constructor(glctx:GLContext){
        this.gl = glctx.gl;
        this.m_curtags = new ShaderTags();
    }

    public reset(tags:ShaderTags){
        this.m_lastTags = null;

        let curtags = this.m_curtags;
        let gl = this.gl;
        if(tags.ztest!= null){
            let ztest = tags.ztest;
            if(curtags.ztest != ztest){
                curtags.ztest = ztest;
                gl.depthFunc(ztest);
            }
        }

        if(tags.culling != null){
            let culling = tags.culling;
            if(curtags.culling != culling){
                curtags.culling = culling;
                gl.cullFace(culling);
            }
        }

        if(tags.zwrite != null){
            let zwrite = tags.zwrite;
            if(curtags.zwrite != zwrite){
                curtags.zwrite =zwrite;
                gl.depthMask(zwrite);
            }
        }

        // if(tags.blendOp != null){
        //     let blendop = tags.blendOp;
        //     if(curtags.blendOp != blendop){
        //         curtags.blendOp = blendop;
        //         if(blendop == null){
        //             gl.disable(gl.BLEND);
        //         }
        //         else{
        //             gl.enable(gl.BLEND);

        //             let op = tags.blendOp;
        //             let srcf = tags.blendFactorSrc;
        //             let dstf = tags.blendFactorDst;

        //             if(op == null) op = BlendOperator.ADD;
        //             if(srcf == null) srcf = BlendFactor.SRC_ALPHA;
        //             if(dstf == null) dstf = BlendFactor.ONE_MINUS_SRC_ALPHA;

        //             if(curtags.blendOp != op){
        //                 curtags.blendOp = op;
        //                 gl.blendEquation(op);
        //             }

        //             let factorDirty = false;
        //             if(curtags.blendFactorSrc != srcf){
        //                 curtags.blendFactorSrc = srcf;
        //                 factorDirty = true;
        //             }
        //             if(curtags.blendFactorDst != dstf){
        //                 curtags.blendFactorDst = dstf;
        //                 factorDirty = true;
        //             }
        //             if(factorDirty) gl.blendFunc(srcf,dstf);
        //         }
        //     }
        // }

        this.m_deftags= tags;
    }

    public apply(tags:ShaderTags){
        if(this.m_lastTags == tags) return;

        let deftags = this.m_deftags;
        let curtags = this.m_curtags;
        let gl = this.gl;

        let ztest = tags.ztest;
        if(ztest == null) ztest = deftags.ztest;
        if(ztest != curtags.ztest){
            curtags.ztest= ztest;
            gl.depthFunc(ztest);
        }

        let culling = tags.culling;
        if(culling == null) culling = deftags.culling;
        if(culling != curtags.culling){
            curtags.culling= culling;
            gl.cullFace(culling);
        }

        let zwrite = tags.zwrite;
        if(zwrite == null) zwrite = deftags.zwrite;
        if(zwrite != curtags.zwrite){
            curtags.zwrite = zwrite;
            gl.depthMask(zwrite);
        }



        this.m_lastTags = tags;
    }

}