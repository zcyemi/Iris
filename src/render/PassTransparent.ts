import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { GLProgram } from "wglut";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { RenderPass } from "./RenderPass";


export class PassTransparent extends RenderPass{


    private m_tags:ShaderTags;

    public constructor(pipeline:PipelineBase){
        super(pipeline);

        let deftags = new ShaderTags();
        deftags.blendOp = BlendOperator.ADD;
        deftags.blend = true;
        deftags.zwrite = false;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = CullingMode.Back;
        deftags.fillDefaultVal();
        this.m_tags =deftags;
    }

    public render(scene?:Scene){
        const CLASS = PipelineBase;

        const pipe = this.pipeline;
        const gl = pipe.GL;
        const glctx = pipe.GLCtx;
        const deftags = this.m_tags;

        const NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
        const NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
        const NAME_LIGHT = ShaderDataUniformLight.UNIFORM_LIGHT;

        let cam = scene.camera;

        let queue = pipe.nodeList.nodeTransparent;
        if(queue.length == 0) return;

        //cam
        let datacam = pipe.shaderDataCam;
        datacam.setMtxProj(cam.ProjMatrix);
        datacam.setMtxView(cam.WorldMatrix);
        datacam.setCameraPos(cam.transform.position);
        pipe.updateUniformBufferCamera(datacam);

        //sm
        let state =pipe.stateCache;
        state.reset(deftags);

        pipe.activeDefaultTexture();


        //do draw

        let len = queue.length;
        let curprogram:GLProgram = null;

        const dataobj = pipe.shaderDataObj;

        for(let i=0;i<len;i++){
            let node = queue[i];
            let mat = node.material;
            let mesh = node.mesh;

            let program = mat.program;
            node.refershVertexArray(glctx);

            if(program != curprogram){
                let glp = program.Program;
                gl.useProgram(glp);
                pipe.uniformBindDefault(program);
                curprogram = program;
            }

            //state.apply(mat.shaderTags);
            mat.apply(gl);

            dataobj.setMtxModel(node.object.transform.objMatrix);
            pipe.updateUniformBufferObject(dataobj);

            gl.bindVertexArray(node.vertexArrayObj);
            let indicedesc = mesh.indiceDesc;
            gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.indices.type, 0);
            gl.bindVertexArray(null);

            mat.clean(gl);
        }
    }

}