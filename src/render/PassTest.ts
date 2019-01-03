import { RenderPass } from "./RenderPass";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { Scene } from "../Scene";
import { StackedPipeline } from "../pipeline/StackedPipeline";
import { GL } from "../gl/GL";
import { MeshRender } from "../MeshRender";
import { Mesh } from "../Mesh";
import { Material } from "../Material";
import { mat4 } from "../math/GLMath";


export class PassTest extends RenderPass{
    
    private m_render:MeshRender;

    public constructor(pipeline:IRenderPipeline){
        super(pipeline);

        this.m_render = new MeshRender(Mesh.Cube,new Material(pipeline.graphicRender.shaderLib.shaderUnlitColor),false);
    }

    public render(scene:Scene){
        const pipe:StackedPipeline = <StackedPipeline>this.pipeline;
        const glctx = pipe.glctx;

        
        glctx.enable(GL.DEPTH_TEST);
        glctx.depthFunc(GL.LEQUAL);

        glctx.bindGLFramebuffer(pipe.mainFrameBuffer);

        const model = pipe.model;
        model.drawMeshRender(this.m_render,mat4.Identity);
    }
}