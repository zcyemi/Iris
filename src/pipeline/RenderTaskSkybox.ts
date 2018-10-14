import { RenderTask } from "../RenderPipeline";
import { GLContext, GLProgram } from "wglut";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { ClearType } from "../Camera";
import { Mesh } from "../Mesh";
import { Shader } from "../shaderfx/Shader";
import { MeshRender } from "../MeshRender";


export class RenderTaskSkybox extends RenderTask{


    private m_fullquad:Mesh;
    private m_shSkybox:Shader;
    private m_shProgram:GLProgram;

    private m_vao:WebGLVertexArrayObject;

    public init(){
        console.log('init skybox');
        let mesh = Mesh.Quad;
        this.m_fullquad =mesh;
        this.m_shSkybox = this.pipeline.graphicRender.shaderLib.shaderSkybox;
        let program = this.m_shSkybox.defaultProgram;
        this.m_shProgram = program;

        let glctx =this.pipeline.GLCtx;
        this.m_vao = MeshRender.CreateVertexArrayObj(glctx,mesh,program);
    }


    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        let camera = scene.camera;
        if(camera.clearType != ClearType.Skybox || camera.skybox == null) return;

        //draw skybox

        // let texskybox = camera.skybox;
        // let program =this.m_shProgram;
        // let gl =glctx.gl;
        // gl.useProgram(program.Program);
        // gl.activeTexture(gl.TEXTURE16);
        // gl.bindTexture(gl.TEXTURE_CUBE_MAP,texskybox);

        // gl.bindVertexArray(this.m_vao);

        // const indices = this.m_fullquad.m_indicesCount;
        // gl.drawElements(gl.TRIANGLES,indices,gl.UNSIGNED_SHORT,0);
        // gl.bindVertexArray(null);
        

    }
    public release(glctx:GLContext){

    }
    public reload(glctx:GLContext){

    }
}