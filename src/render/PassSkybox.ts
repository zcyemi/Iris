import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { GLProgram } from "wglut";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
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

    private m_lastCubeType: CubeMapType;
    private m_lastSkybox:TextureCubeMap;

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
        mat.setFlag("ENVMAP_TYPE","CUBE");

        let skyrender = new MeshRender(Mesh.Quad,mat);
        this.m_skyrender = skyrender;
    }

    public release(){
        this.m_skyrender.release(this.pipeline.GLCtx);
        this.m_skyrender = null;
        this.m_lastSkybox = null;

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
        let texDirty = false;
        if(texskybox.cubemapType != this.m_lastCubeType){
            let newtype = texskybox.cubemapType;
            this.m_lastCubeType = newtype;
            mat.setFlag("ENVMAP_TYPE",newtype == CubeMapType.Cube? "CUBE":"TEX");
            texDirty = true;
        }

        if(texskybox != this.m_lastSkybox){
            texDirty = true;
            this.m_lastSkybox = texskybox;
        }

        if(texDirty){
            mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,texskybox.gltex);
        }

        pipeline.drawMeshRender(skyboxrender);

    }
}