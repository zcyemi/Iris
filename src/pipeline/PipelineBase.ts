import { Scene } from "../Scene";
import { ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight, ShaderDataBasis } from "../shaderfx/ShaderFXLibs";
import { GraphicsRenderCreateInfo, GraphicsRender } from "../GraphicsRender";
import { RenderNodeList } from "../RenderNodeList";
import { BufferDebugInfo } from "../render/BufferDebugInfo";
import { PassDebug } from "../render/PassDebug";
import { Texture } from "../Texture";
import { ShadowMapData } from "../render/Shadow";
import { PipelineStateCache } from "../PipelineStateCache";
import { Transform } from "../Transform";
import { IRenderPipeline } from "./IRenderPipeline";
import { RenderPass } from "../render/RenderPass";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { Mesh } from "../Mesh";
import { MeshRender } from "../MeshRender";
import { Material } from "../Material";
import { Camera } from "../Camera";
import { Input } from "../Input";
import { GLContext } from "../gl/GLContext";
import { GLFrameBuffer } from "../gl/GLFrameBuffer";
import { GLProgram } from "../gl/GLProgram";
import { mat4 } from "../math/GLMath";

export class PipelineBase implements IRenderPipeline {

    public static readonly UNIFORMINDEX_OBJ: number = 0;
    public static readonly UNIFORMINDEX_BASIS: number = 1;
    public static readonly UNIFORMINDEX_SHADOWMAP: number = 2;
    public static readonly UNIFORMINDEX_LIGHT: number = 3;

    public static readonly UNIFORMINDEX_SHADER:number = 4;

    public get GLCtx(): GLContext { return this.glctx; }
    public get GL(): WebGL2RenderingContext { return this.gl; }

    protected glctx: GLContext;
    protected gl: WebGL2RenderingContext;
    private m_pipestateCache: PipelineStateCache;
    protected m_inited:boolean = false;

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

    private m_uniformBufferBasis: WebGLBuffer;


    private m_uniformBufferObj: WebGLBuffer;
    private m_uniformBufferShadowMap: WebGLBuffer;
    private m_uniformBufferLight: WebGLBuffer;

    private m_shaderDataBasis: ShaderDataBasis;
    private m_shaderDataObj: ShaderDataUniformObj;
    private m_shaderDataShadowMap: ShaderDataUniformShadowMap;
    private m_shaderDataLight: ShaderDataUniformLight;

    public get shaderDataBasis(): ShaderDataBasis {
        return this.m_shaderDataBasis;
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
    public get shadowMapData(): ShadowMapData { return this.m_shadowMapData; }
    protected m_shadowEnabled: boolean = false;

    private m_nodelist: RenderNodeList[] = [new RenderNodeList(), new RenderNodeList()];
    private m_nodelistIndex: number = 0;
    private m_nodelistCur:RenderNodeList;
    public get nodeList():RenderNodeList{
        return this.m_nodelistCur;
    }

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

    /** for viewport update in @function <bindTargetFrameBuffer> */
    private m_mainFrameBufferResized:boolean = true;

    /** for shderDataBasis screnparam */
    private m_shaderDataScreenResized:boolean= false;

    /* DebugPass own by PipelineBase */
    protected m_passDebug: PassDebug;
    public renderPassDebug:boolean = false;

    private m_fullscreenRender:MeshRender;
    private m_fullscreenMat:Material;

    public constructor() { }

    public onSetupRender(glctx:GLContext,bufferinfo: GraphicsRenderCreateInfo) {
        this.glctx = glctx;
        this.gl = glctx.gl;
        this.m_mainFrameBufferInfo = bufferinfo;

        this.init();
    }

    public init(){
        if(this.m_inited) return;

        let glctx = this.glctx;
        let bufferinfo = this.m_mainFrameBufferInfo;
        this.m_pipestateCache = new PipelineStateCache(glctx);
        let fb = this.glctx.createFrameBuffer(true, bufferinfo.colorFormat, bufferinfo.depthFormat);
        this.m_mainFrameBuffer = fb;
        this.m_mainFrameBufferWidth = fb.width;
        this.m_mainFrameBufferHeight = fb.height;
        this.m_mainFrameBufferAspect = fb.width / fb.height;
        this.createUniformBuffers();

        this.m_passDebug = new PassDebug(this);

        if(this.m_fullscreenMat == null){
            this.m_fullscreenMat = new Material(this.graphicRender.shaderLib.shaderBlit);
        }

        if(this.m_fullscreenRender == null){
            this.m_fullscreenRender = new MeshRender(Mesh.Quad,this.m_fullscreenMat);
        }


        this.m_inited= true;

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
            gl.bufferData(gl.UNIFORM_BUFFER, data.fxbuffer.raw, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_OBJ, buffer);
            this.m_uniformBufferObj = buffer;
        }
        if (this.m_uniformBufferBasis == null) {
            let data = new ShaderDataBasis();
            this.m_shaderDataBasis = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.fxbuffer.raw, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_BASIS, buffer);
            this.m_uniformBufferBasis = buffer;
        }
        if (this.m_uniformBufferShadowMap == null) {
            let data = new ShaderDataUniformShadowMap();
            this.m_shaderDataShadowMap = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.fxbuffer.raw, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_SHADOWMAP, buffer);
            this.m_uniformBufferShadowMap = buffer;
        }
        if (this.m_uniformBufferLight == null) {
            let data = new ShaderDataUniformLight();
            this.m_shaderDataLight = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
            gl.bufferData(gl.UNIFORM_BUFFER, data.fxbuffer.raw, gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, CLASS.UNIFORMINDEX_LIGHT, buffer);
            this.m_uniformBufferLight = buffer;
        }

        console.log('create uniform buffers');
    }

    public renderBufferDebug() {
        if(!this.renderPassDebug) return;
        let passdebug = this.m_passDebug;
        if (passdebug != null && this.m_bufferDebugInfo.length != 0) passdebug.render();
    }

    public resizeFrameBuffer(width: number, height: number) {
        let bufferInfo = this.m_mainFrameBufferInfo;
        this.m_mainFrameBuffer = this.glctx.createFrameBuffer(false, bufferInfo.colorFormat, bufferInfo.depthFormat, width, height, this.m_mainFrameBuffer);
        this.m_mainFrameBufferWidth = width;
        this.m_mainFrameBufferHeight = height;
        this.m_mainFrameBufferAspect = width / height;
        this.m_mainFrameBufferResized = true;

        this.m_shaderDataScreenResized  = true;
    }

    public exec(scene: Scene) {
    }

    /**
     * draw main framebuffer to canvas buffer
     */
    public onRenderToCanvas() {
        const gl = this.gl;
        gl.viewport(0,0,this.m_mainFrameBufferWidth,this.m_mainFrameBufferHeight);
        this.drawFullScreenTex(this.m_mainFrameBuffer.colorTex0);
    }

    public updateShaderDataBasis(camera:Camera,submit:boolean =true){
        const grender = this.graphicRender;
        const databasis = this.m_shaderDataBasis;
        
        const databasic = databasis.render;
        databasic.setTime(grender.time,this.graphicRender.deltaTime);
        if(this.m_shaderDataScreenResized){
            databasic.setScreenParam(this.mainFrameBufferWidth,this.mainFrameBufferHeight);
            this.m_shaderDataScreenResized = false;
        }

        const datacamera = databasis.camrea;
        if(camera.isDataTrsDirty){
            datacamera.setCameraMtxView(camera.WorldMatrix);
            datacamera.setCameraPos(camera.transform.position);
            camera.isDataTrsDirty = false;
        }
        if(camera.isDataProjDirty){
            datacamera.setCameraMtxProj(camera.ProjMatrix);
            datacamera.setProjParam(camera.near,camera.far);
            camera.isDataProjDirty = false;
        }

        if(submit){
            this.submitShaderDataBasis();
        }
    }


    public submitShaderDataBasis(){
        const dataBasis = this.m_shaderDataBasis;
        const gl = this.gl;
        dataBasis.submitBuffer(gl,this.m_uniformBufferBasis);
    }
    public updateUniformCamera(camera:Camera,submit:boolean = false){
        const data = this.m_shaderDataBasis.camrea;
        let ctrs = camera.transform;
        data.setCameraPos(ctrs.position);
        data.setCameraMtxProj(camera.ProjMatrix);
        data.setCameraMtxView(camera.WorldMatrix);

        if(submit){
            this.submitShaderDataBasis();
        }
    }
    public updateUniformBufferObject(data: ShaderDataUniformObj) {
        const gl = this.gl;
        data.submitBuffer(gl,this.m_uniformBufferObj);
    }
    public updateUniformBufferShadowMap(data: ShaderDataUniformShadowMap) {
        const gl = this.gl;
        data.submitBuffer(gl,this.m_uniformBufferShadowMap);
    }
    public updateUniformBufferLight(data: ShaderDataUniformLight) {
        const gl = this.gl;
        data.submitBuffer(gl,this.m_uniformBufferLight);
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

    public bindTargetFrameBuffer(forece: boolean = false) {
        let mainfb = this.m_mainFrameBuffer;
        if (!this.m_mainFrameBufferBinded || forece ){
            mainfb.bind(this.gl);
            this.m_mainFrameBufferBinded = true;
            forece = true;
        }
        if(this.m_mainFrameBufferResized || forece){
            this.gl.viewport(0, 0, mainfb.width, mainfb.height);
            this.m_mainFrameBufferResized = false;
        }
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
        this.m_nodelistCur = nodelist;
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
            if (crender != null) {
                drawlist.pushRenderNode(crender);
            }
            this.traversalRenderNode(drawlist, c);
        }
    }

    /**
     * Bind internal ShaderFX uniform block index to current program;
     * UNIFORM_BASIS, UNIFORM_OBJ, UNIFORM_LIGHT, UNIFORM_SM
     * @param program 
     */
    public uniformBindDefault(program: GLProgram) {
        const CLASS = PipelineBase;
        const NAME_BASIS = ShaderFX.UNIFORM_BASIS;
        const NAME_OBJ = ShaderDataUniformObj.UNIFORM_OBJ;
        const NAME_LIGHT = ShaderDataUniformLight.UNIFORM_LIGHT;
        const NAME_SM = ShaderFX.UNIFORM_SHADOWMAP;
        const gl = this.gl;
        let ublock = program.UniformBlock;
        let glp = program.Program;
        //cam uniform buffer
        let indexBasis = ublock[NAME_BASIS];
        if (indexBasis != null) gl.uniformBlockBinding(glp, indexBasis, CLASS.UNIFORMINDEX_BASIS);
        //obj uniform buffer
        let indexObj = ublock[NAME_OBJ];
        if (indexObj != null) gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);
        //light uniform buffer
        let indexLight = ublock[NAME_LIGHT];
        if (indexLight != null) gl.uniformBlockBinding(glp, indexLight, CLASS.UNIFORMINDEX_LIGHT);

        let indexSM = ublock[NAME_SM];
        if(indexSM != null){
            gl.uniformBlockBinding(glp, indexSM, CLASS.UNIFORMINDEX_SHADOWMAP);
            let loc = program.Uniforms[ShaderFX.UNIFORM_SHADOWMAP_SAMPLER];
            if (loc != null){
                gl.uniform1i(loc,ShaderFX.GL_SHADOWMAP_TEX0_ID);
            }
        }
    }

    /** draw fullscreen tex */
    public drawFullScreenTex(tex:Texture| WebGLTexture){
        const mat =this.m_fullscreenMat;
        mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,tex);
        this.drawMeshRender(this.m_fullscreenRender);
    }

    /**
     * procedural drawing a mesh with material
     * @param mesh 
     * @param mat 
     * @param vao 
     * @param objmtx 
     * @param defUniformBlock 
     */
    public drawMeshWithMat(mesh:Mesh,mat:Material,vao:WebGLVertexArrayObject,objmtx?:mat4,defUniformBlock:boolean = true){
        const gl = this.gl;
        let program = mat.program;
        gl.useProgram(program.Program);
        if(defUniformBlock){
            this.uniformBindDefault(program);
        }
        mat.apply(gl);
        const dataobj = this.m_shaderDataObj;
        if(objmtx !=null){
            dataobj.setMtxModel(objmtx);
            this.updateUniformBufferObject(dataobj);
        }
        if(vao == null) throw new Error('vertex array obj is null!');
        gl.bindVertexArray(vao);
        let indicedesc = mesh.indiceDesc;
        gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.type,indicedesc.offset);
        gl.bindVertexArray(null);
        mat.clean(gl);
    }

    /**
     * draw a seperated MeshRender
     * @param meshrender 
     * @param objmtx 
     * @param defUniformBlock 
     */
    public drawMeshRender(meshrender:MeshRender,objmtx?:mat4,defUniformBlock:boolean = true){
        const gl = this.gl;
        let mat = meshrender.material;
        let mesh = meshrender.mesh;
        meshrender.refreshData(this.glctx);
        let program = mat.program;
        gl.useProgram(program.Program);
        if(defUniformBlock){
            this.uniformBindDefault(program);
        }
        mat.apply(gl);
        const dataobj = this.m_shaderDataObj;
        if(objmtx !=null){
            dataobj.setMtxModel(objmtx);
            this.updateUniformBufferObject(dataobj);
        }
        let vao = meshrender.vertexArrayObj;
        gl.bindVertexArray(vao);
        let indicedesc = mesh.indiceDesc;
        gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.type,indicedesc.offset);
        gl.bindVertexArray(null);
        mat.clean(gl);
    }

    public release() {
        if(!this.m_inited) return;
        
        let glctx = this.glctx;
        let gl = glctx.gl;

        this.m_bufferDebugInfo = [];
        
        this.m_mainFrameBuffer.release(glctx);
        this.m_mainFrameBufferWidth = 0;
        this.m_mainFrameBufferHeight = 0;
        this.m_mainFrameBufferAspect = 1.0;
        this.m_mainFrameBuffer = null;

        this.m_pipestateCache.release();
        this.m_pipestateCache = null;


        gl.deleteBuffer(this.m_uniformBufferBasis);
        gl.deleteBuffer(this.m_uniformBufferLight);
        gl.deleteBuffer(this.m_uniformBufferObj);
        gl.deleteBuffer(this.m_uniformBufferShadowMap);

        this.m_uniformBufferBasis = null;
        this.m_uniformBufferLight = null;
        this.m_uniformBufferObj= null;
        this.m_uniformBufferShadowMap = null;

        this.m_shadowEnabled = false;
        this.m_shadowMapData = new ShadowMapData();

        let passDebug = this.m_passDebug;
        if(passDebug != null){
            this.m_passDebug = RenderPass.Release(passDebug);
        }

        this.m_inited = false;
    }

    public reload() {
        this.release();
        this.init();
    }

}
