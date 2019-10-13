import { Scene } from "../core/Scene";
import { MeshRender } from "../core/MeshRender";
import { ClearType } from "../core/Camera";
import { Material } from "../core/Material";
import { Mesh } from "../core/index";
import { RenderPass } from "./RenderPass";
import { SkyboxType } from "../core/Skybox";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { ShaderFX, Comparison, CullingMode, ShaderTags } from "../core/ShaderFX";

export class PassSkybox extends RenderPass{
    private m_tags:ShaderTags;

    private m_skyrender:MeshRender;

    private m_lastSkyboxType: SkyboxType = SkyboxType.Tex360;
    private m_lastTex:WebGLTexture;

    public constructor(pipeline:IRenderPipeline){
        super(pipeline);
        let deftags = new ShaderTags();
        deftags.blend = false;
        deftags.zwrite = true;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = CullingMode.Back;
        deftags.fillDefaultVal();
        this.m_tags =deftags;


        let shader = ShaderFX.findShader("iris","@shaderfx/skybox");

        let mat= new Material(shader);
        mat.setFlag("ENVMAP_TYPE","TEX",true);

        let skyrender = new MeshRender(Mesh.Quad,mat);
        this.m_skyrender = skyrender;
    }

    public release(){
        this.m_skyrender.release(this.pipeline.glctx);
        this.m_skyrender = null;
        this.m_lastTex = null;

        super.release();
    }

    public render(scene?:Scene){
        let camera = scene.mainCamera;
        if(camera.clearType != ClearType.Skybox || camera.skybox == null) return;

        let pipeline = this.pipeline;
        const glctx = pipeline.glctx;
        glctx.bindGLFramebuffer(pipeline.mainFrameBuffer);


        const skyboxrender = this.m_skyrender;
        const mat = skyboxrender.material;
        let texskybox = camera.skybox;
        if(texskybox.type != this.m_lastSkyboxType){
            let newtype = texskybox.type;
            this.m_lastSkyboxType = newtype;
            mat.setFlag("ENVMAP_TYPE",newtype,true);

            let rawtex = texskybox.rawTex;
            mat.setTexture("MainTexture",rawtex);
        }

        let rawtex = texskybox.rawTex;
        if(rawtex != null && rawtex != this.m_lastTex){
            let tex =texskybox.rawTex;
            this.m_lastTex = tex;
            mat.setTexture("MainTexture",tex);
        }

        pipeline.model.drawMeshRender(skyboxrender);
    }
}
