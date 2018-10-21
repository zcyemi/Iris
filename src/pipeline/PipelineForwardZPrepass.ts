import { RenderPipeline } from "../RenderPipeline";
import { GLContext, GLProgram, vec4 } from "wglut";
import { Scene } from "../Scene";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { GraphicsRenderCreateInfo } from "../GraphicsRender";
import { RenderNodeList } from "../RenderNodeList";
import { ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";
import { PassOpaque } from "../render/PassOpaque";
import { PassTransparent } from "../render/PassTransparent";
import { PassSkybox } from "../render/PassSkybox";
import { BufferDebugInfo } from "./BufferDebugInfo";
import { PassDebug } from "../render/PassDebug";
import { PassGizmos } from "../render/PassGizmos";


export class PipelineForwardZPrepass extends RenderPipeline{

    public static readonly UNIFORMINDEX_OBJ:number = 0;
    public static readonly UNIFORMINDEX_CAM:number = 1;
    public static readonly UNIFORMINDEX_SHADOWMAP:number = 2;
    public static readonly UNIFORMINDEX_LIGHT:number = 3;
    

    private m_bufferDebugInfo:BufferDebugInfo[] = [];

    public get bufferDebugInfo():BufferDebugInfo[]{
        return this.m_bufferDebugInfo;
    }

    private m_uniformBufferObj:WebGLBuffer;
    private m_uniformBufferCamera:WebGLBuffer;
    private m_uniformBufferShadowMap:WebGLBuffer;
    private m_uniformBufferLight:WebGLBuffer;

    private m_shaderDataCam:ShaderDataUniformCam;
    private m_shaderDataObj:ShaderDataUniformObj;
    private m_shaderDataShadowMap:ShaderDataUniformShadowMap;
    private m_shaderDataLight:ShaderDataUniformLight;

    public get shaderDataCam():ShaderDataUniformCam{
        return this.m_shaderDataCam;
    }
    public get shaderDataObj():ShaderDataUniformObj{
        return this.m_shaderDataObj;
    }
    public get shaderDataLight():ShaderDataUniformLight{
        return this.m_shaderDataLight;
    }
    public get shaderDataShadowMap():ShaderDataUniformShadowMap{
        return this.m_shaderDataShadowMap;
    }


    private m_passOpaque:PassOpaque;
    private m_passTransparent:PassTransparent;
    private m_passSkybox:PassSkybox;

    private m_passDebug:PassDebug;
    private m_passGizmos:PassGizmos;

    public constructor(){
        super();
    }

    public onSetupRender(bufferinfo:GraphicsRenderCreateInfo){
        this.m_mainFrameBufferInfo = bufferinfo;

        let fb = this.glctx.createFrameBuffer(true,bufferinfo.colorFormat,bufferinfo.depthFormat);
        this.m_mainFrameBuffer = fb;

        let gl = this.glctx.gl;
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);


        this.createUniformBuffers();

        this.m_passDebug= new PassDebug(this);
        this.m_passGizmos = new PassGizmos(this);


        this.m_passOpaque = new PassOpaque(this,null);
        this.m_passTransparent = new PassTransparent(this,null);
        this.m_passSkybox =new PassSkybox(this,null);

    }

    private createUniformBuffers(){
        const CLASS = PipelineForwardZPrepass;
        let gl =this.gl;
        //create internal uniform buffer
        if(this.m_uniformBufferObj == null){
            let data = new ShaderDataUniformObj();
            this.m_shaderDataObj = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER,buffer);
            gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER,CLASS.UNIFORMINDEX_OBJ,buffer);
            this.m_uniformBufferObj = buffer;
        }
        if(this.m_uniformBufferCamera == null){
            let data = new ShaderDataUniformCam();
            this.m_shaderDataCam = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER,buffer);
            gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER,CLASS.UNIFORMINDEX_CAM,buffer);
            this.m_uniformBufferCamera = buffer;
        }
        if(this.m_uniformBufferShadowMap == null){
            let data = new ShaderDataUniformShadowMap();
            this.m_shaderDataShadowMap = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER,buffer);
            gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER,CLASS.UNIFORMINDEX_SHADOWMAP,buffer);
            this.m_uniformBufferShadowMap = buffer;
        }
        if(this.m_uniformBufferLight == null){
            let data = new ShaderDataUniformLight();
            this.m_shaderDataLight = data;
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER,buffer);
            gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
            gl.bindBufferBase(gl.UNIFORM_BUFFER,CLASS.UNIFORMINDEX_LIGHT,buffer);
            this.m_uniformBufferLight = buffer;
        }
    }


    public exec(scene:Scene){

        let cam =scene.camera;

        if(cam == null) return;

        cam.aspect = this.mainFrameBufferAspect;

        let nodeList = this.generateDrawList(scene);

        this.bindTargetFrameBuffer();

        let gl = this.gl;
        gl.clearColor(1,0,0,1);
        gl.clearDepth(10.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //do rendering

        const passOpaque = this.m_passOpaque;
        passOpaque.render(scene,nodeList.nodeOpaque);

        const passSkybox= this.m_passSkybox;
        passSkybox.render(scene,null);

        const passTransparent = this.m_passTransparent;
        passTransparent.render(scene,nodeList.nodeTransparent);

        const passGizmos = this.m_passGizmos;
        passGizmos.render(null,null);

        this.renderBufferDebug();

        this.UnBindTargetFrameBuffer();

        const state = this.stateCache;
        state.setBlend(false);
        state.setZTest(Comparison.ALWAYS);
        state.setZWrite(true);

    }

    public updateUniformBufferCamera(data:ShaderDataUniformCam){
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_uniformBufferCamera);
        gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
    }

    public updateUniformBufferObject(data:ShaderDataUniformObj){
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_uniformBufferObj);
        gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
    }

    public updateUniformBufferShadowMap(data:ShaderDataUniformShadowMap){
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_uniformBufferShadowMap);
        gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
    }

    public updateUniformBufferLight(data:ShaderDataUniformLight){
        const gl = this.gl;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_uniformBufferLight);
        gl.bufferData(gl.UNIFORM_BUFFER,data.rawBuffer,gl.DYNAMIC_DRAW);
    }

    public activeDefaultTexture(){
        const gl =this.gl;
        gl.activeTexture(gl.TEXTURE3);
        gl.bindTexture(gl.TEXTURE_2D,this.graphicRender.defaultTexture.rawtexture);

    }

    public addBufferDebugInfo(info:BufferDebugInfo){
        let curinfo = this.m_bufferDebugInfo;
        if(curinfo.indexOf(info) >=0) return;
        curinfo.push(info);
    }

    public removeBufferDebugInfo(info:BufferDebugInfo){
        let curinfo = this.m_bufferDebugInfo;
        let index = curinfo.indexOf(info);
        if(index < 0) return;
        curinfo = curinfo.splice(index,1);
    }

    public renderBufferDebug(){
        let passdebug = this.m_passDebug;
        if(passdebug != null && this.m_bufferDebugInfo.length !=0) passdebug.render(null,null);
    }

}