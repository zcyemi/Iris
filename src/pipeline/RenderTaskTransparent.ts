import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { GLContext, GLProgram } from "wglut";
import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
import { ShaderOptions } from "../shaderfx/ShaderVariant";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";


export class RenderTaskTransparent extends RenderTask{

    private m_deftags:ShaderTags;
    private m_shdaowEnabled:boolean = true;
    private m_perObjShaderData: ShaderDataUniformObj;
    private m_perObjUniformBuffer: WebGLBuffer;

    public init(){
        if(this.m_inited ) return;

        let tags = new ShaderTags();
        tags.blend = true;
        tags.zwrite = false;
        tags.ztest = Comparison.LEQUAL;
        tags.culling = CullingMode.None;
        tags.blendOp = BlendOperator.ADD;
        tags.fillDefaultVal();
        this.m_deftags = tags;

        this.m_perObjShaderData = new ShaderDataUniformObj();

        this.m_perObjUniformBuffer = this.pipeline.sharedBufferPerObj;

        this.m_inited = true;
    }
    
    public render(nodelist: RenderNodeList, scene: Scene, glctx: GLContext){



        let camera = scene.camera;
        if(camera == null) return;

        let queue = nodelist.nodeTransparent;
        let queueLength = queue.length;
        if(queueLength == 0) return;

        let gl = glctx.gl;
        let pipeline = this.pipeline;
        let statecache= pipeline.stateCache;


        pipeline.mainFrameBuffer.bind(gl);

        //shadowmap
        // var shadowmapEnabled = pipeline.shadowMapEnabled;
        // if(shadowmapEnabled){
        //     gl.activeTexture(pipeline.utex_sm[0]);
        //     gl.bindTexture(gl.TEXTURE_2D, pipeline.shadowMapInfo[0].texture);
        // }
        // let shadowOptions:ShaderOptions = null;
        // if(shadowmapEnabled != this.m_shdaowEnabled){
        //     shadowOptions = this.m_shadowOptions;
        //     shadowOptions.default = shadowmapEnabled ? ShaderFX.OPT_SHADOWMAP_SHADOW_ON : ShaderFX.OPT_SHADOWMAP_SHADOW_OFF;
        //     this.m_shdaowEnabled = shadowmapEnabled;
        // }


        statecache.reset(this.m_deftags);

        let campos = camera.transform.position;

        let cposx = campos.x;
        let cposz = campos.z;

        for(let i=0;i<queueLength;i++){
            let r = queue[i];
            
            let rpos = r.object.transform.position;
            let xoff = rpos.x - cposx;
            let zoff = rpos.z - cposz;
            r._depthVal = xoff * xoff + zoff * zoff;
        }

        let curprogram: GLProgram = null;
        queue.sort((a,b)=>{return a._depthVal - b._depthVal;})


        let perobjBuffer = this.m_perObjUniformBuffer;

        for(let i=0;i<queueLength;i++){
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
                let indexCam = ublock[ShaderDataUniformCam.UNIFORM_CAM];
                if (indexCam != null) gl.uniformBlockBinding(glp, indexCam, pipeline.ubufferIndex_PerCam);

                //obj uniform buffer
                let indexObj = ublock[ShaderDataUniformObj.UNIFORM_OBJ];
                if (indexObj != null) gl.uniformBlockBinding(glp, indexObj, pipeline.ubufferIndex_PerObj);

                //light uniform buffer
                let indexLight = ublock[ShaderDataUniformLight.UNIFORM_LIGHT];
                if (indexLight != null) gl.uniformBlockBinding(glp, indexLight, pipeline.ubufferIndex_Light);
                curprogram = program;
            }

            statecache.apply(mat.shaderTags);
            mat.apply(gl);

            //perobject uniform buffer
            {
                let objdata = this.m_perObjShaderData;
                let trs = node.object.transform;
                objdata.setMtxModel(trs.objMatrix);
                gl.bindBuffer(gl.UNIFORM_BUFFER, perobjBuffer);
                gl.bufferData(gl.UNIFORM_BUFFER, objdata.rawBuffer, gl.DYNAMIC_DRAW);
            }

            gl.bindVertexArray(node.vertexArrayObj);
            let indicedesc = mesh.indiceDesc;
            gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.indices.type, 0);

            gl.bindVertexArray(null);

            mat.clean(gl);
        }
        
    }

    public reload(glctx: GLContext){

    }

    public release(glctx:GLContext){
        

    }
}