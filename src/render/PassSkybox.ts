import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { GLProgram } from "wglut";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { ClearType } from "../Camera";
import { CubeMapType } from "../TextureCubeMap";
import { Material } from "../Material";
import { Mesh } from "../Mesh";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { RenderPass } from "./RenderPass";

export class PassSkybox extends RenderPass{
    private m_tags:ShaderTags;
    private m_material:Material;
    private m_program:GLProgram;

    private m_skyvao:WebGLVertexArrayObject;
    private m_quadMesh:Mesh;
    
    private m_texuniform :WebGLUniformLocation;
    private m_uniformBlockCamIndex:number;

    private m_lastCubeType: CubeMapType;

    public constructor(pipeline:PipelineBase){
        super(pipeline);


        let deftags = new ShaderTags();
        deftags.blend = false;
        deftags.zwrite = true;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = CullingMode.Back;
        deftags.fillDefaultVal();
        this.m_tags =deftags;

        let mat= new Material(pipeline.graphicRender.shaderLib.shaderSkybox);
        this.m_material= mat;
        mat.setFlag("ENVMAP_TYPE","CUBE");

        let program = mat.program;
        this.m_program = program;

        let glct = pipeline.GLCtx;
        let mesh = Mesh.Quad;
        this.m_quadMesh = mesh;
        this.m_skyvao = MeshRender.CreateVertexArrayObj(glct,mesh,program);

        this.m_texuniform = program.Uniforms[ShaderFX.UNIFORM_MAIN_TEXTURE];
        this.m_uniformBlockCamIndex = program.UniformBlock[ShaderDataUniformCam.UNIFORM_CAM];
    }

    public render(scene?:Scene){
        const CLASS = PipelineBase;

        let camera = scene.camera;

        if(camera.clearType != ClearType.Skybox || camera.skybox == null) return;

        let pipeline = this.pipeline;

        pipeline.bindTargetFrameBuffer();

        pipeline.stateCache.reset(this.m_tags);

        let texskybox = camera.skybox;
        if(texskybox.cubemapType != this.m_lastCubeType){
            let newtype = texskybox.cubemapType;
            this.m_material.setFlag("ENVMAP_TYPE",newtype == CubeMapType.Cube? "CUBE":"TEX");
            this.m_lastCubeType = newtype;
            let program = this.m_material.program;
            this.m_program = program;
            this.m_texuniform = program.Uniforms[ShaderFX.UNIFORM_MAIN_TEXTURE];
        }

        let program = this.m_program;
        let gl = pipeline.GL;
        
        gl.useProgram(program.Program);
        const camindex = this.m_uniformBlockCamIndex;
        if(camindex != null){
            gl.uniformBlockBinding(program.Program,camindex,CLASS.UNIFORMINDEX_CAM);
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

        gl.bindVertexArray(this.m_skyvao);

        const indices = this.m_quadMesh.indiceDesc.indiceCount;
        gl.drawElements(gl.TRIANGLES,indices,gl.UNSIGNED_SHORT,0);
        gl.bindVertexArray(null);

    }
}