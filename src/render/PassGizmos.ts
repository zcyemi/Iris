import { Scene } from "../Scene";
import { Shader, ShaderTags, Comparison } from "../shaderfx/Shader";
import { Material } from "../Material";
import { Mesh, MeshTopology } from "../Mesh";
import { mat4, glmath } from "../math/GLMath";
import { MeshRender } from "../MeshRender";
import { ShaderSource } from "../shaderfx/ShaderSource";
import { ShaderFile, ShaderFX } from "../shaderfx/ShaderFX";
import { MeshBuilder } from "../MeshBuilder";
import { RenderPass } from "./RenderPass";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { GLVertexArray } from "../gl/GLVertexArray";

export class PassGizmos extends RenderPass{
    protected m_material:Material;
    private m_mesh:Mesh;

    private m_meshcross:Mesh;
    private m_meshvao:GLVertexArray;
    private m_matColor:Material;

    private m_vao:GLVertexArray;

    @ShaderFile("gizmos")
    public static SH_gizmos:ShaderSource;
    private static s_shader:Shader;

    public enable:boolean = true;
    
    private m_tags:ShaderTags;

    public constructor(pipe:IRenderPipeline){
        super(pipe);

        if(PassGizmos.s_shader == null){
            let shader = ShaderFX.compileShaders(pipe.glctx,PassGizmos.SH_gizmos);
            PassGizmos.s_shader = shader;
        }

        let mat = new Material(PassGizmos.s_shader);
        this.m_material = mat;



        let mesh = this.genMesh();
        this.m_mesh = mesh;

        if(mesh != null){
            this.m_vao = MeshRender.CreateVertexArrayObj(pipe.glctx,mesh,mat.program);
        }

        let tags= new ShaderTags();
        tags.blend = false;
        tags.ztest = Comparison.LEQUAL;
        tags.zwrite = false;
        tags.fillDefaultVal();
        this.m_tags = tags;

        this.genMeshCross();
    }

    public render(scene?:Scene){
        if(!this.enable) return;

        // const mesh =this.m_mesh;
        // if(mesh == null) return;

        // const CLASS = PipelineBase;
        // const NAME_BASIS = ShaderFX.UNIFORM_BASIS;
        // const NAME_OBJ = ShaderFX.UNIFORM_OBJ;

        const pipeline = this.pipeline;
        const model = pipeline.model;
        const glctx = pipeline.glctx;

        glctx.bindGLFramebuffer(pipeline.mainFrameBuffer);

        if(scene != null){
            this.drawLightMark(scene);
        }

        // pipeline.stateCache.apply(this.m_tags);
        
        // let mat = this.m_material;
        // let program = mat.program;

        // let glp = program.Program;
        // gl.useProgram(program.Program);

        // const ublock = program.UniformBlock;
        // let indexCam = ublock[NAME_BASIS];
        // if (indexCam != null) gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_BASIS);
        // let indexObj = ublock[NAME_OBJ];
        // if (indexObj != null) gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);

        // mat.apply(gl);

        // let dataobj = pipeline.shaderDataObj;

        // const mtx = mat4.Identity;
        // dataobj.setMtxModel(mtx);
        // pipeline.updateUniformBufferObject(dataobj);

        // gl.bindVertexArray(this.m_vao);

        // const indiceDesc= mesh.indiceDesc;
        // gl.drawElements(indiceDesc.topology,indiceDesc.indiceCount,indiceDesc.type,indiceDesc.offset);
        // gl.bindVertexArray(null);
    }

    private drawLightMark(scene:Scene)
    {
        let lights = scene.lights;
        const lightcount = scene.lightCount;

        const model = this.pipeline.model;
        const mesh =this.m_meshcross;
        const meshvao = this.m_meshvao;
        let mat = this.m_matColor;       

        let lightPrime = scene.lightPrime;
        if(lightPrime != null){
            mat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,lightPrime.lightColor.vec4(1.0));
            model.drawMeshWithMat(mesh,mat,meshvao,lightPrime.transform.objMatrix);
        }

        if(lights == null || lightcount == 0) return;



        for(var t=0;t<lightcount;t++){
            let light = lights[t];
            
            mat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,light.lightColor.vec4(1.0));
            model.drawMeshWithMat(mesh,mat,meshvao,light.transform.objMatrix);
        }



    }

    private genMeshCross(){
        let crossbuilder = new MeshBuilder(MeshTopology.Lines);
        crossbuilder.addLine(glmath.vec3(-0.3,0,0),glmath.vec3(0.3,0,0));
        crossbuilder.addLine(glmath.vec3(0,-0.3,0),glmath.vec3(0,0.3,0));
        crossbuilder.addLine(glmath.vec3(0,0,-0.3),glmath.vec3(0,0,0.3));
        this.m_meshcross =crossbuilder.genMesh();

        const pipe = this.pipeline;
        let mat = new Material(pipe.graphicRender.shaderLib.shaderUnlitColor);
        this.m_matColor = mat;
        mat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(1.0,0,0,1.0));
        this.m_meshvao = MeshRender.CreateVertexArrayObj(pipe.glctx,this.m_meshcross,mat.program);
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
