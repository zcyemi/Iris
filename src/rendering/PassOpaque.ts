import { ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";
import { Scene } from "../core/Scene";
import { GLProgram } from "../gl/GLProgram";
import { RenderPass } from "./RenderPass";
import { MeshRender } from "../core/MeshRender";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { GL } from "../gl/GL";
import { pipeline } from "stream";

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
        if(queue.size == 0) return;

        const model = pipe.model;

        // glctx.enable(GL.POLYGON_OFFSET_FILL);

        const deftags = this.m_tags;
        glctx.pipelineState(deftags);

        glctx.depthMask(true);

        const mainfb = pipe.mainFrameBuffer;
        glctx.viewport(0,0,mainfb.width,mainfb.height);

        glctx.bindGLFramebuffer(mainfb);

        const len = queue.size;
        const queueary = queue.array;
        for(let t=0;t<len;t++){
            const node = queueary[t];
            if(node instanceof MeshRender){
                model.drawMeshRender(node,node.object.transform.objMatrix);
            }
            else{
                node.draw(glctx,model);
            }
        }

        // gl.disable(gl.POLYGON_OFFSET_FILL);
    }
}
