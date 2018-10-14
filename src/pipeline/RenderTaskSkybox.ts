import { RenderTask } from "../RenderPipeline";
import { GLContext, GLProgram } from "wglut";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { ClearType } from "../Camera";
import { Mesh } from "../Mesh";
import { Shader } from "../shaderfx/Shader";
import { MeshRender } from "../MeshRender";
import { ShaderDataUniformCam } from "../shaderfx/ShaderFXLibs";


export class RenderTaskSkybox extends RenderTask{


    private m_fullquad:Mesh;
    private m_shSkybox:Shader;
    private m_shProgram:GLProgram;

    private m_vao:WebGLVertexArrayObject;


    private m_blockIndexCam:number;

    public init(){
        console.log('init skybox');
        let mesh = Mesh.Quad;
        this.m_fullquad =mesh;
        this.m_shSkybox = this.pipeline.graphicRender.shaderLib.shaderSkybox;
        let program = this.m_shSkybox.defaultProgram;
        this.m_shProgram = program;

        let glctx =this.pipeline.GLCtx;
        this.m_vao = MeshRender.CreateVertexArrayObj(glctx,mesh,program);

        this.m_blockIndexCam = program.UniformBlock[ShaderDataUniformCam.UNIFORM_CAM];
    }


    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        let camera = scene.camera;
        if(camera.clearType != ClearType.Skybox || camera.skybox == null) return;

        //draw skybox

        let texskybox = camera.skybox;
        let program =this.m_shProgram;
        let gl =glctx.gl;
        gl.useProgram(program.Program);

        const indexCam = this.m_blockIndexCam;
        if(indexCam != null){
            gl.uniformBlockBinding(program.Program,indexCam,this.pipeline.ubufferIndex_PerCam);
        }


        gl.activeTexture(gl.TEXTURE16);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP,texskybox.gltex);

        gl.bindVertexArray(this.m_vao);

        const indices = this.m_fullquad.m_indicesCount;
        gl.drawElements(gl.TRIANGLES,indices,gl.UNSIGNED_SHORT,0);
        gl.bindVertexArray(null);

    }
    public release(glctx:GLContext){

    }
    public reload(glctx:GLContext){

    }
}