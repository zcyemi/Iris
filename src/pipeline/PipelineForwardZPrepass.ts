import { PassOpaque } from "../render/PassOpaque";
import { PassTransparent } from "../render/PassTransparent";
import { PassSkybox } from "../render/PassSkybox";
import { PassGizmos } from "../render/PassGizmos";
import { PassDepth } from "../render/PassDepth";
import { PassShadowMap } from "../render/PassShadowMap";
import { PipelineBase } from "./PipelineBase";
import { Scene } from "../Scene";
import { Comparison } from "../shaderfx/Shader";
import { RenderPass } from "../render/RenderPass";
import { RenderTexture } from "../RenderTexture";
import { ReleaseGraphicObj } from "../IGraphicObj";
import { GLContext } from "../gl/GLContext";
import { GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GL } from "../gl/GL";


export class PipelineForwardZPrePass extends PipelineBase {

    private m_passDepth: PassDepth;
    private m_passOpaque: PassOpaque;
    private m_passTransparent: PassTransparent;
    private m_passSkybox: PassSkybox;
    private m_passGizmos: PassGizmos;
    private m_passShadowMap: PassShadowMap;

    public constructor() {
        super();
    }

    public onInitGL(){
        super.onInitGL();
        const glctx = this.glctx;
        glctx.depthMask(true);
        glctx.depthFunc(GL.LEQUAL);
        glctx.enable(GL.DEPTH_TEST);

        let fb = this.mainFBaspect;
        this.m_depthRT = RenderTexture.create(this.glctx,fb.width,fb.height,{
            internalformat : fb.depthtex.getDesc().internalformat
        });

        this.m_passGizmos = new PassGizmos(this);
        this.m_passDepth = new PassDepth(this);
        this.m_passOpaque = new PassOpaque(this);
        this.m_passTransparent = new PassTransparent(this);
        this.m_passSkybox = new PassSkybox(this);
        this.m_passShadowMap = new PassShadowMap(this);
    }
  
    public resizeFrameBuffer(width: number, height: number) {
        super.resizeFrameBuffer(width,height);

        //resize depth rt;
        if(this.m_depthRT!=null){
            this.m_depthRT.resize(this.glctx,width,height);
        }
    }


    public exec(scene: Scene) {
        if(scene == null) return;
        let cam = scene.mainCamera;
        if (cam == null) return;
        cam.aspect = this.mainFrameBufferAspect;

        this.updateShaderDataBasis(cam);
        this.generateDrawList(scene);
        this.bindTargetFrameBuffer(false,false);

        let gl = this.gl;
        gl.clearColor(1, 0, 0, 1);
        gl.clearDepth(10.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //do rendering

        const passDepth = this.m_passDepth;
        passDepth.render(scene);

        //sm
        const passSM = this.m_passShadowMap;
        passSM.render(scene);

        const passOpaque = this.m_passOpaque;
        passOpaque.render(scene);

        const passSkybox = this.m_passSkybox;
        passSkybox.render(scene);

        const passTransparent = this.m_passTransparent;
        passTransparent.render(scene);

        const passGizmos = this.m_passGizmos;
        passGizmos.render();

        this.renderBufferDebug();
        this.UnBindTargetFrameBuffer();

        const state = this.stateCache;
        state.setBlend(false);
        state.setZTest(Comparison.ALWAYS);
        state.setZWrite(true);
    }

    public release(){
        if(this.m_inited) return;

        this.m_depthRT = ReleaseGraphicObj(this.m_depthRT,this.glctx);
    
        this.m_passDebug = RenderPass.Release(this.m_passDepth);
        this.m_passGizmos = RenderPass.Release(this.m_passGizmos);
        this.m_passOpaque = RenderPass.Release(this.m_passOpaque);
        this.m_passShadowMap = RenderPass.Release(this.m_passShadowMap);
        this.m_passSkybox = RenderPass.Release(this.m_passSkybox);
        this.m_passTransparent = RenderPass.Release(this.m_passTransparent);

        super.release()
    }

    public reload(){
        this.release();
    }

}
