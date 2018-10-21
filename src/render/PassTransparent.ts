import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";
import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { GLProgram } from "wglut";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";


export class PassTransparent{


    private pipeline:PipelineForwardZPrepass;
    private m_tags:ShaderTags;

    public constructor(pipeline:PipelineForwardZPrepass,deftags?:ShaderTags){
        this.pipeline = pipeline;

        if(deftags == null){
            deftags = new ShaderTags();
            deftags.blendOp = BlendOperator.ADD;
            deftags.blend = true;
            deftags.zwrite = false;
            deftags.ztest = Comparison.LEQUAL;
            deftags.culling = CullingMode.Back;
            deftags.fillDefaultVal();
        }
        this.m_tags =deftags;
    }

    public render(scene:Scene,queue:MeshRender[]){
        const CLASS = PipelineForwardZPrepass;

        const pipe = this.pipeline;
        const gl = pipe.GL;
        const glctx = pipe.GLCtx;
        const deftags = this.m_tags;

        const NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
        const NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
        const NAME_LIGHT = ShaderDataUniformLight.UNIFORM_LIGHT;

        let cam = scene.camera;
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

                let ublock = program.UniformBlock;
                //cam uniform buffer
                let indexCam = ublock[NAME_CAM];
                if (indexCam != null) gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
                //obj uniform buffer
                let indexObj = ublock[NAME_OBJ];
                if (indexObj != null) gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
                //light uniform buffer
                let indexLight = ublock[NAME_LIGHT];
                if (indexLight != null) gl.uniformBlockBinding(glp, indexLight, CLASS.UNIFORMINDEX_LIGHT);
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