import { RenderTask } from "../RenderPipeline";
import { GLContext, GLProgram } from "wglut";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { ClearType } from "../Camera";
import { Mesh } from "../Mesh";
import { Shader } from "../shaderfx/Shader";


export class RenderTaskSkybox extends RenderTask{


    private m_fullquad:Mesh;
    private m_shSkybox:Shader;
    private m_shProgram:GLProgram;

    public init(){
        console.log('init skybox');
        let mesh = Mesh.Quad;
        this.m_fullquad =mesh;
        this.m_shSkybox = this.pipeline.graphicRender.shaderLib.shaderSkybox;
        this.m_shProgram = this.m_shSkybox.defaultProgram;

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

        
        

    }
    public release(glctx:GLContext){

    }
    public reload(glctx:GLContext){

    }
}