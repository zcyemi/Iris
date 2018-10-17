import { RenderTask } from "../RenderPipeline";
import { GLContext, GLProgram } from "wglut";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { ClearType } from "../Camera";
import { Mesh } from "../Mesh";
import { Shader } from "../shaderfx/Shader";
import { MeshRender } from "../MeshRender";
import { ShaderDataUniformCam } from "../shaderfx/ShaderFXLibs";
import { Material } from "../Material";
import { CubeMapType } from "../TextureCubeMap";
import { ShaderFX } from "../shaderfx/ShaderFX";


export class RenderTaskSkybox extends RenderTask{


    private m_fullquad:Mesh;
    private m_material:Material;
    private m_shProgram:GLProgram;

    private m_vao:WebGLVertexArrayObject;


    private m_blockIndexCam:number;

    private m_lastCubeType:CubeMapType = CubeMapType.Cube;

    private m_texuniform:WebGLUniformLocation;

    public init(){
        console.log('init skybox');
        let mesh = Mesh.Quad;
        this.m_fullquad =mesh;
        let mat = new Material(this.pipeline.graphicRender.shaderLib.shaderSkybox);
        this.m_material = mat;
        mat.setFlag("ENVMAP_TYPE","CUBE");

        let program = mat.program;
        this.m_shProgram = program;

        let glctx =this.pipeline.GLCtx;
        this.m_vao = MeshRender.CreateVertexArrayObj(glctx,mesh,program);

        this.m_blockIndexCam = program.UniformBlock[ShaderDataUniformCam.UNIFORM_CAM];

        this.m_texuniform = program.Uniforms[ShaderFX.UNIFORM_MAIN_TEXTURE];
    }


    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        let camera = scene.camera;
        if(camera.clearType != ClearType.Skybox || camera.skybox == null) return;

        //draw skybox


        let texskybox = camera.skybox;

        if(texskybox.cubemapType != this.m_lastCubeType){
            let newtype = texskybox.cubemapType;
            console.log("switch textype:" + newtype);

            this.m_material.setFlag("ENVMAP_TYPE",newtype == CubeMapType.Cube? "CUBE":"TEX");
            this.m_lastCubeType = newtype;
            let program = this.m_material.program;
            this.m_shProgram = program;
            this.m_texuniform = program.Uniforms[ShaderFX.UNIFORM_MAIN_TEXTURE];
        }

        let program =this.m_shProgram;
        let gl =glctx.gl;
        gl.useProgram(program.Program);

        const indexCam = this.m_blockIndexCam;
        if(indexCam != null){
            gl.uniformBlockBinding(program.Program,indexCam,this.pipeline.ubufferIndex_PerCam);
        }


        gl.activeTexture(gl.TEXTURE4);
        let cubetype = this.m_lastCubeType;
        if(cubetype == CubeMapType.Cube){
            gl.bindTexture(gl.TEXTURE_CUBE_MAP,texskybox.gltex);
        }
        else{
            gl.bindTexture(gl.TEXTURE_2D,texskybox.gltex);
        }
        gl.uniform1i(this.m_texuniform,4);

        gl.bindVertexArray(this.m_vao);

        const indices = this.m_fullquad.indiceDesc.indiceCount;
        gl.drawElements(gl.TRIANGLES,indices,gl.UNSIGNED_SHORT,0);
        gl.bindVertexArray(null);

    }
    public release(glctx:GLContext){

    }
    public reload(glctx:GLContext){

    }
}