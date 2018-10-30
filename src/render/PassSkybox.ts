import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { GLProgram } from "wglut";
import { ClearType } from "../Camera";
import { CubeMapType, TextureCubeMap } from "../TextureCubeMap";
import { Material } from "../Material";
import { Mesh } from "../Mesh";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { RenderPass } from "./RenderPass";
import { Texture } from "../Texture";

export class PassSkybox extends RenderPass{
    private m_tags:ShaderTags;

    private m_skyrender:MeshRender;

    private m_lastCubeType: CubeMapType = CubeMapType.Texture360;
    private m_lastTex:WebGLTexture;

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
        mat.setFlag("ENVMAP_TYPE","TEX",true);

        let skyrender = new MeshRender(Mesh.Quad,mat);
        this.m_skyrender = skyrender;
    }

    public release(){
        this.m_skyrender.release(this.pipeline.GLCtx);
        this.m_skyrender = null;
        this.m_lastTex = null;

        super.release();
    }

    public render(scene?:Scene){
        let camera = scene.camera;
        if(camera.clearType != ClearType.Skybox || camera.skybox == null) return;

        let pipeline = this.pipeline;
        pipeline.bindTargetFrameBuffer();
        pipeline.stateCache.reset(this.m_tags);

        const skyboxrender = this.m_skyrender;
        const mat = skyboxrender.material;
        let texskybox = camera.skybox;
        if(texskybox.cubemapType != this.m_lastCubeType){
            let newtype = texskybox.cubemapType;
            this.m_lastCubeType = newtype;
            mat.setFlag("ENVMAP_TYPE",newtype == CubeMapType.Cube? "CUBE":"TEX",true);
            mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,texskybox.gltex);
        }

        if(texskybox.gltex != this.m_lastTex){
            let tex =texskybox.gltex;
            this.m_lastTex = tex;
            mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,tex);

        }

        pipeline.drawMeshRender(skyboxrender);

    }
}