import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";
import { Scene } from "../Scene";
import { RenderQueue, Shader, ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";
import { Material } from "../Material";
import { Mesh, MeshTopology } from "../Mesh";
import { ShaderDataUniformCam, ShaderDataUniformObj } from "../shaderfx/ShaderFXLibs";
import { mat4, vec3, glmath } from "wglut";
import { MeshRender } from "../MeshRender";
import { ShaderSource } from "../shaderfx/ShaderSource";
import { ShaderFile, ShaderFX } from "../shaderfx/ShaderFX";
import { MeshBuilder } from "../MeshBuilder";


export class PassGizmos{

    private pipeline:PipelineForwardZPrepass;

    protected m_material:Material;
    private m_mesh:Mesh;

    private m_vao:WebGLVertexArrayObject;

    @ShaderFile("gizmos")
    public static SH_gizmos:ShaderSource;
    private static s_shader:Shader;

    public enable:boolean = true;
    
    private m_tags:ShaderTags;

    public constructor(pipe:PipelineForwardZPrepass){
        this.pipeline = pipe;


        if(PassGizmos.s_shader == null){
            let shader = ShaderFX.compileShaders(pipe.GLCtx,PassGizmos.SH_gizmos);
            PassGizmos.s_shader = shader;
        }

        let mat = new Material(PassGizmos.s_shader);
        this.m_material = mat;

        let mesh = this.genMesh();
        this.m_mesh = mesh;

        if(mesh != null){
            this.m_vao = MeshRender.CreateVertexArrayObj(pipe.GLCtx,mesh,mat.program);
        }

        let tags= new ShaderTags();
        tags.blend = false;
        tags.ztest = Comparison.ALWAYS;
        tags.zwrite = false;
        tags.fillDefaultVal();
        this.m_tags = tags;
    }

    public render(scene:Scene,queue:RenderQueue[]){

        if(!this.enable) return;

        const mesh =this.m_mesh;
        if(mesh == null) return;
        

        const CLASS = PipelineForwardZPrepass;
        const NAME_CAM = ShaderDataUniformCam.UNIFORM_CAM;
        const NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;

        const pipeline = this.pipeline;
        const gl = pipeline.GL;

        pipeline.stateCache.apply(this.m_tags);
        
        let mat = this.m_material;
        let program = mat.program;

        let glp = program.Program;
        gl.useProgram(program.Program);

        const ublock = program.UniformBlock;
        let indexCam = ublock[NAME_CAM];
        if (indexCam != null) gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_CAM);
        let indexObj = ublock[NAME_OBJ];
        if (indexObj != null) gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);

        mat.apply(gl);

        let dataobj = pipeline.shaderDataObj;

        const mtx = mat4.Identity;
        dataobj.setMtxModel(mtx);
        pipeline.updateUniformBufferObject(dataobj);

        gl.bindVertexArray(this.m_vao);

        const indiceDesc= mesh.indiceDesc;
        gl.drawElements(indiceDesc.topology,indiceDesc.indiceCount,indiceDesc.indices.type,0);
        gl.bindVertexArray(null);

    }

    private genMesh():Mesh{

        let builder= new MeshBuilder(MeshTopology.Lines);

        builder.addLine(glmath.vec3(-50,0,0),glmath.vec3(50,0,0));
        builder.addLine(glmath.vec3(0,0,-50),glmath.vec3(0,0,50));

        builder.addLine(glmath.vec3(-5,0,-5),glmath.vec3(5,0,-5));
        builder.addLine(glmath.vec3(5,0,-5),glmath.vec3(5,0,5));
        builder.addLine(glmath.vec3(5,0,5),glmath.vec3(-5,0,5));
        builder.addLine(glmath.vec3(-5,0,5),glmath.vec3(-5,0,-5));

        return builder.genMesh();
    }
}