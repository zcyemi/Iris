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
        deftags.zwrite = false;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = CullingMode.Back;
        deftags.fillDefaultVal();
        this.m_tags =deftags;

        pipeline.glctx.polygonOffset(-1,-1);

    }

    public render(scene:Scene){
        let queue = this.pipeline.nodeList.nodeOpaque;

        const pipe = this.pipeline;
        const glctx = pipe.glctx;
        const deftags = this.m_tags;

        let cam = scene.mainCamera;
        if(queue.length == 0) return;
        glctx.enable(GL.POLYGON_OFFSET_FILL);

        const model = pipe.model;

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


        //pipe.activeDefaultTexture();

        //do draw


        const len = queue.length;
        for(let t=0;t<len;t++){
            const node = queue[t];
            if(node instanceof MeshRender){
                model.drawMeshRender(node,node.object.transform.objMatrix);
            }
        }


        // let len = queue.length;
        // let curprogram:GLProgram = null;
        // const dataobj = pipe.shaderDataObj;
        // for(let i=0;i<len;i++){
        //     let node = queue[i];
        //     if(node instanceof MeshRender){
        //         let mat = node.material;
        //         let mesh = node.mesh;
    
        //         let program = mat.program;
        //         node.refreshData(glctx);
    
        //         if(program != curprogram){
        //             let glp = program.Program;
        //             gl.useProgram(glp);
        //             pipe.uniformBindDefault(program);
    
        //             curprogram = program;
        //         }
        //         state.apply(mat.shaderTags);
        //         mat.apply(gl);
    
        //         dataobj.setMtxModel(node.object.transform.objMatrix);
        //         pipe.updateUniformBufferObject(dataobj);
    
        //         node.bindVertexArray(glctx);
        //         let indicedesc = mesh.indiceDesc;
        //         gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.type, indicedesc.offset);
        //         node.unbindVertexArray(glctx);
    
        //         mat.clean(gl);
        //     }
        // }

        // gl.disable(gl.POLYGON_OFFSET_FILL);
    }
}
