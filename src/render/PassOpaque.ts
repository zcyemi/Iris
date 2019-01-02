import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { GLProgram } from "../gl/GLProgram";
import { RenderPass } from "./RenderPass";
import { MeshRender } from "../MeshRender";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { GL } from "../gl/GL";

export class PassOpaque extends RenderPass{

    private m_tags:ShaderTags;

    public constructor(pipeline:IRenderPipeline){
        super(pipeline);

        let deftags = new ShaderTags();
        deftags.blendOp = null;
        deftags.blend = false;
        deftags.zwrite = true;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = null;
        this.m_tags =deftags;

        pipeline.glctx.enable(GL.DEPTH_TEST);

        //pipeline.glctx.polygonOffset(-1,-1);
    }

    public render(scene:Scene){
        let queue = this.pipeline.nodeList.nodeOpaque;

        const pipe = this.pipeline;
        const glctx = pipe.glctx;

        let cam = scene.mainCamera;
        if(queue.length == 0) return;

        const model = pipe.model;

        // glctx.enable(GL.POLYGON_OFFSET_FILL);

        const deftags = this.m_tags;
        glctx.pipelineState(deftags);

        glctx.depthMask(true);

        glctx.bindFramebuffer(pipe.mainFrameBuffer);

        //light
        let light = scene.lights[0];
        if(light !=null && light.isDirty){
            let bufferLight = model.uniformLight;
            let datalight = bufferLight.data;
            datalight.setLightData(light.lightPosData,light.lightType,0);
            datalight.setLightColorIntensity(light.lightColor,light.intensity,0);
            datalight.setAmbientColor(cam.ambientColor);
            bufferLight.uploadBufferData(glctx);
        }

        const len = queue.length;
        for(let t=0;t<len;t++){
            const node = queue[t];
            if(node instanceof MeshRender){
                model.drawMeshRender(node,node.object.transform.objMatrix);
            }
        }

        // gl.disable(gl.POLYGON_OFFSET_FILL);
    }
}
