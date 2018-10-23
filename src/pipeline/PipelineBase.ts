import { GLContext, GLFrameBuffer } from "wglut";
import { Scene } from "../Scene";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { GraphicsRenderCreateInfo, GraphicsRender } from "../GraphicsRender";
import { RenderNodeList } from "../RenderNodeList";
import { BufferDebugInfo } from "../render/BufferDebugInfo";
import { PassDebug } from "../render/PassDebug";
import { Texture } from "../Texture";
import { ShadowMapData } from "../render/Shadow";
import { PipelineStateCache } from "../PipelineStateCache";
import { Transform } from "../Transform";

export class PipelineBase {

    public static readonly UNIFORMINDEX_OBJ: number = 0;
    public static readonly UNIFORMINDEX_CAM: number = 1;
    public static readonly UNIFORMINDEX_SHADOWMAP: number = 2;
    public static readonly UNIFORMINDEX_LIGHT: number = 3;

    protected glctx: GLContext;
    protected gl: WebGL2RenderingContext;
    private m_pipestateCache: PipelineStateCache;

    public graphicRender: GraphicsRender;

    //For debug textures and framebuffers
    protected m_bufferDebugInfo: BufferDebugInfo[] = [];
    public get bufferDebugInfo(): BufferDebugInfo[] {
        return this.m_bufferDebugInfo;
    }

    //Copy of depth texture
    protected m_mainDepthTexture: Texture;
    protected m_mainDepthFB: WebGLFramebuffer;
    public get mainDepthTexture(): Texture {
        return this.m_mainDepthTexture;
    }
    public get mainDepthFrameBuffer(): WebGLFramebuffer {
        return this.m_mainDepthFB;
    }

    private m_uniformBufferObj: WebGLBuffer;
    private m_uniformBufferCamera: WebGLBuffer;
    private m_uniformBufferShadowMap: WebGLBuffer;
    private m_uniformBufferLight: WebGLBuffer;

    private m_shaderDataCam: ShaderDataUniformCam;
    private m_shaderDataObj: ShaderDataUniformObj;
    private m_shaderDataShadowMap: ShaderDataUniformShadowMap;
    private m_shaderDataLight: ShaderDataUniformLight;

    public get shaderDataCam(): ShaderDataUniformCam {
        return this.m_shaderDataCam;
    }
    public get shaderDataObj(): ShaderDataUniformObj {
        return this.m_shaderDataObj;
    }
    public get shaderDataLight(): ShaderDataUniformLight {
        return this.m_shaderDataLight;
    }
    public get shaderDataShadowMap(): ShaderDataUniformShadowMap {
        return this.m_shaderDataShadowMap;
    }

    protected m_shadowMapData: ShadowMapData = new ShadowMapData();
    protected m_shadowEnabled: boolean = true;

    private m_nodelist: RenderNodeList[] = [new RenderNodeList(), new RenderNodeList()];
    private m_nodelistIndex: number = 0;

    public get shadowMapData(): ShadowMapData { return this.m_shadowMapData; }
    public get GLCtx(): GLContext { return this.glctx; }
    public get GL(): WebGL2RenderingContext { return this.gl; }

    protected m_mainFrameBuffer: GLFrameBuffer;
    protected m_mainFrameBufferInfo: GraphicsRenderCreateInfo;
    protected m_mainFrameBufferBinded: boolean = false;

    public get mainFrameBufferWidth(): number { return this.m_mainFrameBufferWidth; }
    public get mainFrameBufferHeight(): number { return this.m_mainFrameBufferHeight; }
    public get mainFrameBufferAspect(): number { return this.m_mainFrameBufferAspect; }
    public get mainFrameBuffer(): GLFrameBuffer { return this.m_mainFrameBuffer; }

    public get stateCache(): PipelineStateCache { return this.m_pipestateCache; }

    protected m_mainFrameBufferAspect: number = 1.0;
    protected m_mainFrameBufferWidth: number = 0;
    protected m_mainFrameBufferHeight: number = 0;

    protected m_passDebug: PassDebug;

    public constructor() { }

    public onInitGL(glctx: GLContext) {
        this.glctx = glctx;
        this.gl = glctx.gl;
        this.m_pipestateCache = new PipelineStateCache(glctx);
    }

    public onSetupRender(bufferinfo: GraphicsRenderCreateInfo) {
        this.m_mainFrameBufferInfo = bufferinfo;

        let fb = this.glctx.createFrameBuffer(true, bufferinfo.colorFormat, bufferinfo.depthFormat);
        this.m_mainFrameBuffer = fb;
        this.m_mainFrameBufferWidth = fb.width;
        this.m_mainFrameBufferHeight = fb.height;
        this.m_mainFrameBufferAspect = fb.width / fb.height;

        this.createUniformBuffers();
    }

    public renderBufferDebug() {
        let passdebug = this.m_passDebug;
        if (passdebug != null && this.m_bufferDebugInfo.length != 0) passdebug.render(null, null);
    }

    public resizeFrameBuffer(width: number, height: number) {
        let bufferInfo = this.m_mainFrameBufferInfo;
        this.m_mainFrameBuffer = this.glctx.createFrameBuffer(false, bufferInfo.colorFormat, bufferInfo.depthFormat, width, height, this.m_mainFrameBuffer);
        this.m_mainFrameBufferWidth = width;
        this.m_mainFrameBufferHeight = height;
        this.m_mainFrameBufferAspect = width / height;
    }

    private createUniformBuffers() {
        const CLASS = PipelineBase;
        let gl = this.gl;
        //create internal uniform buffer
        if (this.m_uniformBufferObj == null) {
            let data = new ShaderDataUniformObj();
            this.m_shaderDataObj = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_OBJ, buffer);
            this.m_uniformBufferObj = buffer;
        }
        if (this.m_uniformBufferCamera == null) {
            let data = new ShaderDataUniformCam();
            this.m_shaderDataCam = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_CAM, buffer);
            this.m_uniformBufferCamera = buffer;
        }
        if (this.m_uniformBufferShadowMap == null) {
            let data = new ShaderDataUniformShadowMap();
            this.m_shaderDataShadowMap = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_SHADOWMAP, buffer);
            this.m_uniformBufferShadowMap = buffer;
        }
        if (this.m_uniformBufferLight == null) {
            let data = new ShaderDataUniformLight();
            this.m_shaderDataLight = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_LIGHT, buffer);
            this.m_uniformBufferLight = buffer;
        }
    }

    public exec(scene: Scene) {
    }

    /**
     * draw main framebuffer to canvas buffer
     */
    public onRenderToCanvas() {
        this.glctx.drawTexFullscreen(this.m_mainFrameBuffer.colorTex0, false, false);
    }

    public updateUniformBufferCamera(data: ShaderDataUniformCam) {
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferCamera);
        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
    }

    public updateUniformBufferObject(data: ShaderDataUniformObj) {
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferObj);
        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
    }

    public updateUniformBufferShadowMap(data: ShaderDataUniformShadowMap) {
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferShadowMap);
        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
    }

    public updateUniformBufferLight(data: ShaderDataUniformLight) {
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_uniformBufferLight);
        gl.bufferData(gl.UNIFORM_BUFFER, data.rawBuffer, gl.DYNAMIC_DRAW);
    }

    public activeDefaultTexture() {
        const gl = this.gl;
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D, this.graphicRender.defaultTexture.rawtexture);

    }

    public addBufferDebugInfo(info: BufferDebugInfo) {
        let curinfo = this.m_bufferDebugInfo;
        if (curinfo.indexOf(info) >= 0) return;
        curinfo.push(info);
    }

    public removeBufferDebugInfo(info: BufferDebugInfo) {
        let curinfo = this.m_bufferDebugInfo;
        let index = curinfo.indexOf(info);
        if (index < 0) return;
        curinfo = curinfo.splice(index, 1);
    }

    /**
     * @returns whether to call gl.BindFrameBuffer;
     */
    public bindTargetFrameBuffer(forece: boolean = false): boolean {
        if (this.m_mainFrameBufferBinded && !forece) return false;
        let mainfb = this.m_mainFrameBuffer;
        mainfb.bind(this.gl);
        this.m_mainFrameBufferBinded = true;

        //TODO
        this.gl.viewport(0, 0, mainfb.width, mainfb.height);

        return true;
    }

    public UnBindTargetFrameBuffer() {
        if (!this.m_mainFrameBufferBinded) return;

        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        this.m_mainFrameBufferBinded = false;
    }

    public generateDrawList(scene: Scene): RenderNodeList {
        let nodelistIndex = this.m_nodelistIndex;
        let nodelist = this.m_nodelist[nodelistIndex];
        nodelist.reset();
        this.traversalRenderNode(nodelist, scene.transform);
        nodelist.sort();
        this.m_nodelistIndex = nodelistIndex == 0 ? 1 : 0;
        return nodelist;
    }

    private traversalRenderNode(drawlist: RenderNodeList, obj: Transform) {
        let children = obj.children;
        if (children == null) return;
        for (let i = 0, len = children.length; i < len; i++) {
            let c = children[i];
            let cobj = c.gameobject;
            if (!cobj.active) continue;
            let crender = cobj.render;
            if (crender != null && crender.mesh != null) {
                drawlist.pushRenderNode(crender);
            }
            this.traversalRenderNode(drawlist, c);
        }
    }

    public release() {
    }

    public reload() {
    }

}