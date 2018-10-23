import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";
import { ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { GLProgram } from "wglut";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { ShaderFX } from "../shaderfx/ShaderFX";


export class PassOpaque{

    private pipeline:PipelineForwardZPrepass;
    private m_tags:ShaderTags;

    public constructor(pipeline:PipelineForwardZPrepass,deftags?:ShaderTags){
        this.pipeline = pipeline;

        if(deftags == null){
            deftags = new ShaderTags();
            deftags.blendOp = null;
            deftags.blend = false;
            deftags.zwrite = false;
            deftags.ztest = Comparison.LEQUAL;
            deftags.culling = CullingMode.Back;
            deftags.fillDefaultVal();
        }
        this.m_tags =deftags;

        let gl = pipeline.GL;

        gl.polygonOffset(-1,-1);

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
        const NAME_SM = ShaderFX.UNIFORM_SHADOWMAP;

        let cam = scene.camera;
        if(queue.length == 0) return;

        gl.enable(gl.POLYGON_OFFSET_FILL);
       

        //cam
        let datacam = pipe.shaderDataCam;
        datacam.setMtxProj(cam.ProjMatrix);
        datacam.setMtxView(cam.WorldMatrix);
        datacam.setCameraPos(cam.transform.position);
        datacam.setScreenSize(pipe.mainFrameBufferWidth,pipe.mainFrameBufferHeight);
        datacam.setClipPlane(cam.near,cam.far);
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

                let indexSM = ublock[NAME_SM];
                if(indexSM != null){
                    gl.uniformBlockBinding(glp, indexSM, CLASS.UNIFORMINDEX_SHADOWMAP);
                    let loc = program.Uniforms['uShadowMap'];
                    if (loc != null){
                        gl.uniform1i(loc,12);
                    }
                }
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

        gl.disable(gl.POLYGON_OFFSET_FILL);

    }
}