import { PassOpaque } from "../render/PassOpaque";
import { PassTransparent } from "../render/PassTransparent";
import { PassSkybox } from "../render/PassSkybox";
import { PassGizmos } from "../render/PassGizmos";
import { PassDepth } from "../render/PassDepth";
import { PassShadowMap } from "../render/PassShadowMap";
import { PipelineBase } from "./PipelineBase";
import { TextureCreationDesc, Texture } from "../Texture";
import { Scene } from "../Scene";
import { Comparison } from "../shaderfx/Shader";
import { GL } from "../GL";
import { RenderPass } from "../render/RenderPass";

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

    public init(){
        if(this.m_inited) return;
        super.init();

        let gl = this.glctx.gl;
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);

        let fb = this.m_mainFrameBuffer;
        this.createMainDepthFB(fb.width, fb.height);
        this.m_passGizmos = new PassGizmos(this);
        this.m_passDepth = new PassDepth(this);
        this.m_passOpaque = new PassOpaque(this);
        this.m_passTransparent = new PassTransparent(this);
        this.m_passSkybox = new PassSkybox(this);
        this.m_passShadowMap = new PassShadowMap(this);
        this.m_inited = true;
    }

    private createMainDepthFB(width: number, height: number) {
        let bufferinfo = this.m_mainFrameBufferInfo;
        let depthtexdesc = new TextureCreationDesc(null, bufferinfo.depthFormat, false, GL.NEAREST, GL.NEAREST);
        let tex = Texture.createTexture2D(width, height, depthtexdesc, this.glctx);
        this.m_mainDepthTexture = tex;
        let gl = this.gl;
        if (this.m_mainDepthFB == null) {
            let fb = gl.createFramebuffer();
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb);
            gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex.rawtexture, 0);
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
            this.m_mainDepthFB = fb;
        }
    }

    public resizeFrameBuffer(width: number, height: number) {
        super.resizeFrameBuffer(width,height);

        let glctx = this.glctx;
        let gl = this.gl;
        //resize depth framebuffer
        if (this.m_mainDepthFB != null) {
            gl.deleteFramebuffer(this.m_mainDepthFB);
        }

        let depthtex = this.m_mainDepthTexture;
        depthtex.resize(width, height, glctx);
        let fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthtex.rawtexture, 0);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
        this.m_mainDepthFB = fb;
    }


    public exec(scene: Scene) {
        let cam = scene.mainCamera;
        if (cam == null) return;
        cam.aspect = this.mainFrameBufferAspect;

        this.updateShaderDataBasis(cam);

        this.generateDrawList(scene);

        this.bindTargetFrameBuffer();

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

        let gl =this.gl;
        gl.deleteFramebuffer(this.m_mainDepthFB);
        this.m_mainDepthTexture.release(this.glctx);
        this.m_mainDepthTexture = null;
    
        this.m_passDebug = RenderPass.Release(this.m_passDepth);
        this.m_passGizmos = RenderPass.Release(this.m_passGizmos);
        this.m_passOpaque = RenderPass.Release(this.m_passOpaque);
        this.m_passShadowMap = RenderPass.Release(this.m_passShadowMap);
        this.m_passSkybox = RenderPass.Release(this.m_passSkybox);
        this.m_passTransparent = RenderPass.Release(this.m_passTransparent);
    }

    public reload(){
        this.release();
        this.init();
    }

}
