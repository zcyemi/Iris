import { RenderPass } from "./RenderPass";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { Scene } from "../core/Scene";
import { StackedPipeline } from "../pipeline/StackedPipeline";
import { GL } from "../gl/GL";
import { MeshRender } from "../core/MeshRender";
import { Mesh } from "../core/index";
import { Material } from "../core/Material";
import { mat4 } from "../math/GLMath";
import { ShaderFX } from "../core/ShaderFX";


export class PassTest extends RenderPass{
    
    private m_render:MeshRender;

    public constructor(pipeline:IRenderPipeline){
        super(pipeline);


        let shader= ShaderFX.findShader("iris","@shaderfx/unlit_color");
        this.m_render = new MeshRender(Mesh.Cube,new Material(shader),false);
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