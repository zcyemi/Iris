import { RenderPass } from "./RenderPass";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { Scene } from "../core/Scene";
import { FrameBuffer } from "../gl/FrameBuffer";
import { GL } from "../gl/GL";
import { Texture2D } from "../core/Texture2D";
import { mat4, glmath, vec3 } from "../math/GLMath";
import { Material, MaterialProperty } from "../core/Material";
import { MeshRender } from "../core/MeshRender";
import { BufferDebugInfo } from "./BufferDebugInfo";
import { ShaderFX } from "../core/ShaderFX";


const SM_SIZE = 1024;

export class PassShadow extends RenderPass{

    private m_fbShadow:FrameBuffer;
    private m_matShadowGather:Material;
    private m_uniformLightVP:MaterialProperty;

    public constructor(pipeline:IRenderPipeline){
        super(pipeline);

        const glctx = pipeline.glctx;
        let tex = Texture2D.createTexture2D(SM_SIZE,SM_SIZE,{
          internalformat:GL.DEPTH_COMPONENT24,
          min_filter: GL.NEAREST,
          mag_filter: GL.NEAREST,
          wrap_s: GL.REPEAT,
          wrap_t: GL.REPEAT,
          compare_mode: GL.COMPARE_REF_TO_TEXTURE
        },glctx);

        this.m_fbShadow = FrameBuffer.createFromTexture(glctx,{
            depthTex: tex
        });

        let shader = ShaderFX.findShader("iris","@sfx/shadowmap");

        let matSMgather= new Material(shader);
        this.m_uniformLightVP = matSMgather.propertyBlock.getUniform("uLightVP");
        this.m_matShadowGather = matSMgather;

        const model =this.pipeline.model;
        //model.addBufferDebugInfo(new BufferDebugInfo(this.m_fbShadow.depthtex,glmath.vec4(0,0,128,128)));


        model.setShadowMapTex(tex,0);
    }

    public render(scene:Scene){
        if(scene == null) return;
        
        let lightPrim = scene.lightPrime;

        const pipeline =this.pipeline;
        const glctx  = pipeline.glctx;

        const matShadowGather = this.m_matShadowGather;
        const uniformLightVP = this.m_uniformLightVP;

        const queue = pipeline.nodeList.nodeOpaque;
        if(queue == null || queue.size ==0) return;

        const model = pipeline.model;

        if(lightPrim != null && lightPrim.castShadow){
            glctx.viewport(0,0,SM_SIZE,SM_SIZE);
            glctx.bindGLFramebuffer(this.m_fbShadow);

            //draw sm

            glctx.clearDepth(1000);
            glctx.clear(GL.DEPTH_BUFFER_BIT);
            glctx.enable(GL.DEPTH_TEST);
            glctx.depthMask(true);

            //config light mtx;

            let lightProj:mat4 = mat4.orthographic(10,10,0.1,20) ;//mat4.orthographic(10,10,0.01,100);
            let lightView:mat4 = mat4.coordCvt(lightPrim.transform.position,lightPrim.lightPosData,lightPrim.transform.worldUp);
            if(!lightView.isValid){
                throw new Error("invalid lightMtx");
            }
            

            let lightmtx:mat4 = lightProj.mul(lightView);

            uniformLightVP.value = lightmtx;

            //TODO
            const uniformSM = null;// model.uniformShadowMap;
            uniformSM.data.setLightMtx(lightmtx,0);
            //model.updateUniformShadowMap();

            const queuelen = queue.size;
            const queueary = queue.array;
            for(let t=0;t< queuelen;t++){
                const node = queueary[t];
                if(node instanceof MeshRender && node.castShadow){
                    model.drawMeshRender(node,node.object.transform.objMatrix,matShadowGather);
                }
            }
            
            glctx.bindGLFramebuffer(null);
        }
    }
}