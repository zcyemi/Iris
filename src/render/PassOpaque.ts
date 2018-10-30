import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { GLProgram } from "wglut";
import { ShaderDataUniformObj, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { RenderPass } from "./RenderPass";


export class PassOpaque extends RenderPass{

    private m_tags:ShaderTags;

    public constructor(pipeline:PipelineBase){
        super(pipeline);

        console.log('init opaque')

        let deftags = new ShaderTags();
        deftags.blendOp = null;
        deftags.blend = false;
        deftags.zwrite = false;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = CullingMode.Back;
        deftags.fillDefaultVal();
        this.m_tags =deftags;

        let gl = pipeline.GL;

        gl.polygonOffset(-1,-1);

    }

    public render(scene:Scene){

        const CLASS = PipelineBase;

        let queue = this.pipeline.nodeList.nodeOpaque;


        const pipe = this.pipeline;
        const gl = pipe.GL;
        const glctx = pipe.GLCtx;
        const deftags = this.m_tags;

        const NAME_BASIS = ShaderFX.UNIFORM_BASIS;
        const NAME_OBJ = ShaderFX.UNIFORM_OBJ;
        const NAME_LIGHT = ShaderFX.UNIFORM_LIGHT;
        const NAME_SM = ShaderFX.UNIFORM_SHADOWMAP;

        let cam = scene.camera;

        if(queue.length == 0) return;

        gl.enable(gl.POLYGON_OFFSET_FILL);
       

        //cam
        let datacam = pipe.shaderDataBasis.camrea;
        datacam.setCameraMtxProj(cam.ProjMatrix);
        datacam.setCameraMtxView(cam.WorldMatrix);
        datacam.setCameraPos(cam.transform.position);
        let databasic = pipe.shaderDataBasis.basic;
        databasic.setScreenParam(pipe.mainFrameBufferWidth,pipe.mainFrameBufferHeight);
        datacam.setProjParam(cam.near,cam.far);
        pipe.submitShaderDataBasis();

        //light
        let light = scene.lights[0];
        if(light !=null && light.isDirty){
            let datalight = pipe.shaderDataLight;
            datalight.setLightData(light.lightPosData,light.lightType,0);
            datalight.setLightColorIntensity(light.lightColor,light.intensity,0);
            datalight.setAmbientColor(cam.ambientColor);
            pipe.updateUniformBufferLight(datalight);
        }

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

        gl.disable(gl.POLYGON_OFFSET_FILL);

    }
}