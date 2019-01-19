import { RenderPass } from "./RenderPass";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { Scene } from "../Scene";
import { FrameBuffer } from "../gl/FrameBuffer";
import { GL } from "../gl/GL";
import { Texture2D } from "../Texture2D";
import { mat4, glmath, vec3 } from "../math/GLMath";
import { Material, MaterialProperty } from "../Material";
import { MeshRender } from "../MeshRender";
import { BufferDebugInfo } from "./BufferDebugInfo";


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
        },glctx);

        this.m_fbShadow = FrameBuffer.createFromTexture(glctx,{
            depthTex: tex
        });

        let matSMgather= new Material(pipeline.graphicRender.shaderLib.shaderShadowMap);
        this.m_uniformLightVP = matSMgather.propertyBlock.getUniform("uLightVP");
        this.m_matShadowGather = matSMgather;

        const model =this.pipeline.model;
        model.addBufferDebugInfo(new BufferDebugInfo(this.m_fbShadow.depthtex,glmath.vec4(0,0,128,128)));


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
        if(queue == null || queue.length ==0) return;

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

            const uniformSM = model.uniformShadowMap;
            uniformSM.data.setLightMtx(lightmtx,0);
            model.updateUniformShadowMap();

            const queuelen = queue.length;
            for(let t=0;t< queuelen;t++){
                const node = queue[t];
                if(node instanceof MeshRender && node.castShadow){
                    model.drawMeshRender(node,node.object.transform.objMatrix,matShadowGather);
                }
            }
            
            glctx.bindGLFramebuffer(null);
        }
    }
}