import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { GLContext, GLProgram, mat4 } from "wglut";
import { Mesh } from "../Mesh";
import { Scene } from "../Scene";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { ShaderSource } from "../shaderfx/ShaderSource";
import { ShaderDataUniformCam, ShaderDataUniformObj } from "../shaderfx/ShaderFXLibs";
import { Shader } from "../shaderfx/Shader";

export class RenderTaskDrawCoord extends RenderTask{
    private static s_coordMesh:Mesh;
    private static readonly s_shaderSource:ShaderSource = RenderTaskDrawCoord.genShader();

    private m_coordProgram:GLProgram;
    private m_coordShader:Shader;

    private m_blockIndexCam:number;
    private m_blockIndexObj:number;

    private m_perCamShaderData:ShaderDataUniformCam;
    private m_perObjShaderData:ShaderDataUniformObj;
    private m_perCamBuffer:WebGLBuffer;
    private m_perObjBuffer:WebGLBuffer;

    public init(){

        let pipe = this.pipeline;
        let glctx = pipe.GLCtx;
        let gl =pipe.GL;

        if(RenderTaskDrawCoord.s_coordMesh == null){
            RenderTaskDrawCoord.genMesh();
        }

        if(this.m_coordShader == null){
            let shader = ShaderFX.compileShaders(glctx,RenderTaskDrawCoord.s_shaderSource);
            let program = shader.defaultProgram;
            this.m_coordProgram = program;
            this.m_coordShader = this.m_coordShader;

            this.m_blockIndexCam = gl.getUniformBlockIndex(program.Program,ShaderFX.UNIFORM_CAM);
            this.m_blockIndexObj = gl.getUniformBlockIndex(program.Program,ShaderFX.UNIFORM_OBJ);
        }

        this.m_perCamBuffer = pipe.sharedBufferPerCam;
        this.m_perCamShaderData = new ShaderDataUniformCam();

        this.m_perObjBuffer = pipe.sharedBufferPerObj;
        this.m_perObjShaderData = new ShaderDataUniformObj();

        this.m_inited = true;
    }

    //TODO
    public release(glctx:GLContext){
        this.m_perObjBuffer = null;
        this.m_perCamBuffer = null;
        //Release Program
        //Release Shader
        this.m_inited = false;
    }

    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        //coord

        let program = this.m_coordProgram;
        let meshcoord = RenderTaskDrawCoord.s_coordMesh;
        if(!meshcoord.m_bufferInited){
            this.pipeline.refreshMeshBuffer(meshcoord,program);
        }

        let gl = glctx.gl;
        let glp = program.Program;
        gl.useProgram(glp);
        gl.uniform4fv(program.Uniforms['uColor'],[1,1,1,1]);

        let camera = scene.camera;
        let mtxv = camera.WorldMatrix;
        let mtxp = camera.ProjMatrix;

        let camdata = this.m_perCamShaderData;
        camdata.setMtxView(mtxv);
        camdata.setMtxProj(mtxp);

        let objdata =this.m_perObjShaderData;
        objdata.setMtxModel(mat4.Identity);

        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_perCamBuffer);
        gl.bufferData(gl.UNIFORM_BUFFER,camdata.rawBuffer,gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_perObjBuffer);
        gl.bufferData(gl.UNIFORM_BUFFER,objdata.rawBuffer,gl.DYNAMIC_DRAW);


        let pipe = this.pipeline;
        gl.uniformBlockBinding(glp,this.m_blockIndexCam,pipe.ubufferIndex_PerCam);
        gl.uniformBlockBinding(glp,this.m_blockIndexObj,pipe.ubufferIndex_PerObj);

        gl.bindVertexArray(meshcoord.m_vao);
        gl.drawArrays(gl.LINES,0,6);
        gl.bindVertexArray(null);
    }

    private static genMesh(){
        let glmesh = new Mesh();

        let p0 = [0, 0, 0, 1];
        let px = [1, 0, 0, 1];
        let py = [0, 1, 0, 1];
        let pz = [0, 0, 1, 1];

        let dataposition = new Float32Array([
            0,0,0,1,1,0,0,1,
            0,0,0,1,0,1,0,1,
            0,0,0,1,0,0,1,1
        ]);
        glmesh.m_dataPosition = dataposition;
        glmesh.m_indicesCount = 6;
        glmesh.m_dateVerticesLen = dataposition.length;
        RenderTaskDrawCoord.s_coordMesh = glmesh;
    }
    private static genShader():ShaderSource{
        return new ShaderSource(`
        #version 300 es
        precision mediump float;
        #include SHADERFX_BASIS
        in vec4 aPosition;
        void main(){
            gl_Position = MATRIX_MVP * aPosition;
        }
        `,`
        #version 300 es
        precision lowp float;
        out vec4 fragColor;
        uniform vec4 uColor;
        void main(){
            fragColor = uColor;
        }
        `);
    }
}