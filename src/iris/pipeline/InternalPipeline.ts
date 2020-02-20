import { Camera, GraphicsObj, GraphicsRenderCreateInfo, ITexture, Material, Mesh, MeshRender, Texture2D, BaseRender, GameObject, Skybox } from "../core";
import { AssetsBundle, AssetsDataBase } from "../core/AssetsDatabase";
import { CommandBuffer, CommandType } from "../core/CommandBuffer";
import { GameContext } from "../core/GameContext";
import { GameTime } from "../core/GameTime";
import { Graphics } from "../core/Graphics";
import { GraphicsSettings } from "../core/GraphicsSettings";
import { MeshPrimitive } from "../core/MeshPrimitive";
import { ShaderFX } from "../core/ShaderFX";
import { ShaderUniformBuffer } from "../core/ShaderUniformBuffer";
import { FrameBuffer, GL, GLContext, GLProgram, GLVertexArray } from "../gl";
import { mat4, vec4 } from "../math";
import { ShaderDataBasis, ShaderDataCamera, ShaderDataLight, ShaderDataObj } from "./InternalPipelineUniform";
import { IRenderModel } from "./IRenderModel";
import { RenderPipelineBase } from "./RenderPipelineBase";
import { IndexedBuffer } from "../collection";

export interface PipelineClearInfo {
    color?: vec4;
    depth?: number;
    clearMask?: number;
}

export class InternalRenderModel extends GraphicsObj implements IRenderModel {
    private m_pipeline: InternalPipeline;

    private m_matDefault: Material;
    private m_matError: Material;

    private m_assets: AssetsBundle;

    private static s_defaultScreenRect: vec4 = new vec4([0, 0, 1, 1]);
    private m_fullscreenRender: MeshRender;


    private m_matBlit: Material;
    private m_matBlitFlip:Material;


    private dataBasisBuffer: ShaderUniformBuffer<ShaderDataBasis>;
    private dataObjBuffer: ShaderUniformBuffer<ShaderDataObj>;
    private dataCameraBuffer: ShaderUniformBuffer<ShaderDataCamera>;
    private dataLightBuffer: ShaderUniformBuffer<ShaderDataLight>;

    private m_tempFramebuffer: FrameBuffer;

    public constructor(pipeline: InternalPipeline) {
        super();
        this.m_pipeline = pipeline;
        const glctx = this.glctx;

        this.m_tempFramebuffer = FrameBuffer.createEmpty(glctx);

        this.dataBasisBuffer = new ShaderUniformBuffer(ShaderDataBasis, 0, 'UNIFORM_BASIS');
        this.dataCameraBuffer = new ShaderUniformBuffer(ShaderDataCamera, 1, 'UNIFORM_CAMERA');
        this.dataObjBuffer = new ShaderUniformBuffer(ShaderDataObj, 2, 'UNIFORM_OBJ');
        this.dataLightBuffer = new ShaderUniformBuffer(ShaderDataLight, 3, 'UNIFORM_LIGHT');


        let resBundle = AssetsDataBase.getLoadedBundle("iris");
        if (resBundle == null) {
            throw new Error("InternalPipeline require iris.resbundle");
        }

        this.m_matDefault = new Material(ShaderFX.findShader(resBundle, "@shaderfx/unlit_color"));
        this.m_matError = new Material(ShaderFX.findShader(resBundle, "@shaderfx/unlit_color"));


        this.m_matBlit = new Material(ShaderFX.findShader(resBundle, "@shaderfx/internal/blit_flip"));
        this.m_matBlitFlip = new Material(ShaderFX.findShader(resBundle,"@shaderfx/internal/blit"));

        this.m_fullscreenRender = new MeshRender(MeshPrimitive.Quad, this.m_matBlit, false);
    }

    public release(){
    }

    public getMaterialDefault(): Material {
        return this.m_matDefault;
    }

    public getMaterialError(): Material {
        return this.m_matError;
    }

    bindDefaultUniform(program: GLProgram) {

        let ublocks = program.UniformBlock;

        const uniformBasis = this.dataBasisBuffer;
        let indBasis = ublocks[uniformBasis.name];
        if (indBasis) this.glctx.uniformBlockBinding(program.Program, indBasis, uniformBasis.uniformIndex);
    }

    bindCameraUniform(program: GLProgram) {
        let ublocks = program.UniformBlock;
        const uniformCamera = this.dataCameraBuffer;

        let indCamera = ublocks[uniformCamera.name];
        if (indCamera) this.glctx.uniformBlockBinding(program.Program, indCamera, uniformCamera.uniformIndex);
    }

    bindObjectUniform(program:GLProgram){
        let ublocks = program.UniformBlock;
        const uniformObject = this.dataCameraBuffer;

        let indObj = ublocks[uniformObject.name];
        if (indObj) this.glctx.uniformBlockBinding(program.Program, indObj, uniformObject.uniformIndex);
    }

    updateDefaultUniform() {

        const basisBuffer = this.dataBasisBuffer;
        const basisData = basisBuffer.data;

        if (GraphicsSettings.update()) {
            basisData.fogColor.setValue(GraphicsSettings.fogColor);
            basisData.fogParam.setValue(GraphicsSettings.fogParam);
            basisData.ambientColor.setValue(GraphicsSettings.ambientColor);
            console.log('update graphicsSettings');
        }

        //update time
        let time = GameTime.time;
        let dt = GameTime.deltaTime;
        basisData.time.setValue(new vec4([time, dt, Math.sin(time), Math.cos(time)]));

        this.dataBasisBuffer.uploadBufferData();
    }

    updateObjectUniform(obj:GameObject){
        if(obj == null) return;

        const objBuffer = this.dataObjBuffer;
        const objData = objBuffer.data;
        
        objData.obj2world.setValue(obj.transform.objMatrix);

        objBuffer.uploadBufferData();
    }


    updateCameraUnifomrm(camera: Camera) {
        if (camera == null) return;

        const cameraBuffer = this.dataCameraBuffer;
        const cameraData = cameraBuffer.data;

        if (camera.isDataTrsDirty) {
            cameraData.cameraPos.setValue(camera.transform.position.vec4(0));
            cameraData.cameraMtxView.setValue(camera.WorldMatrix);
        }


        if (camera.isDataProjDirty) {
            cameraData.cameraMtxProj.setValue(camera.ProjMatrix);
            cameraData.cameraMtxInvProj.setValue(camera.ProjMatrixInv);
            cameraData.cameraProjParam.setValue(camera.ProjParam);
        }

        cameraBuffer.uploadBufferData();
    }

    setShadowMapTex(tex: ITexture, index: number) {
        throw new Error("Method not implemented.");
    }
    drawFullScreen(tex: ITexture) {
        let mat = this.m_matBlitFlip;
        mat.setTexture("uSampler", tex);
        this.drawMeshRender(this.m_fullscreenRender, null, mat);
    }
    drawScreenTex(tex: ITexture, rect?: vec4) {
        rect = rect || InternalRenderModel.s_defaultScreenRect;

        let mat = this.m_matBlit;
        mat.setTexture("uSampler", tex);
        this.drawMeshRender(this.m_fullscreenRender, null, mat);
    }
    drawMeshRender(meshrender: MeshRender, objmtx?: mat4, material?: Material) {
        const glctx = this.glctx;
        meshrender.refreshData();

        this.updateObjectUniform(meshrender.object);

        if (material == null) material = this.m_matDefault;
        let glp = material.program;
        glctx.useGLProgram(glp);
        material.apply(glctx);

        this.bindDefaultUniform(glp);
        this.bindCameraUniform(glp);

        meshrender.bindVertexArray(glctx);
        glctx.drawElementIndices(meshrender.mesh.indiceDesc);
        meshrender.unbindVertexArray(glctx);
    }

    drawBaseRender(meshrender:BaseRender,objmtx?:mat4,material?:Material){

        if(meshrender instanceof MeshRender){
            this.drawMeshRender(meshrender,objmtx,material);
        }

    }

    bindFrameBuffer(fb:FrameBuffer){
        let glctx=  this.glctx;
        if(glctx.bindGLFramebuffer(fb)){
            glctx.viewport(0,0,fb.width,fb.height);
        }
    }

    blit(src:Texture2D,dest:Texture2D,mat?:Material){
        if(dest ==null) return;
        let material:Material = mat || this.m_matBlit;

        material.setMainTexture(src);
        
        let glctx = this.glctx;

        let tempfb = this.m_tempFramebuffer;

        glctx.bindGLFramebuffer(tempfb);
        glctx.viewport(0,0,dest.width,dest.height);
        glctx.framebufferTexture2D(GL.FRAMEBUFFER,GL.COLOR_ATTACHMENT0,GL.TEXTURE_2D,dest.getRawTexture(),0);

        let tex2d:Texture2D = <Texture2D>dest;
        glctx.viewport(0,0,tex2d.width,tex2d.height);

        this.drawMeshRender(this.m_fullscreenRender, null, material);

        glctx.bindGLFramebuffer(this.m_pipeline.mainFrameBuffer);
    }

    drawMeshWithMat(mesh: Mesh, mat: Material, vao: GLVertexArray, objmtx?: mat4) {

        const glctx= this.glctx;

        mesh.refreshMeshBuffer(glctx);
        let glp = mat.program;
        glctx.useGLProgram(glp);
        this.bindDefaultUniform(glp);
        this.bindCameraUniform(glp);
        mat.apply(glctx);

        glctx.bindGLVertexArray(vao);
        glctx.drawElementIndices(mesh.indiceDesc);
        glctx.bindVertexArray(null);
        mat.clean(glctx);

    }
    clearFrameBufferTarget(clearinfo: PipelineClearInfo, fb: FrameBuffer) {
        throw new Error("Method not implemented.");
    }

    private m_skyboxRender:MeshRender;

    drawSkyBox(skyboxMat:Material){
        this.drawMeshRender(this.m_fullscreenRender, null, skyboxMat);
    }

    execCommand(cmdbufer: CommandBuffer) {

        let items = cmdbufer.commandList;
        let len = items.length;

        const glctx = this.m_pipeline.glctx;
        for (let t = 0; t < len; t++) {
            let cmd = items[t];

            switch (cmd.type) {
                case CommandType.ClearColor:
                    glctx.clearColorAry(cmd.args[0].raw);
                    glctx.clear(GL.COLOR_BUFFER_BIT);
                    break;
                case CommandType.DrawScreenTex:
                    this.drawScreenTex(cmd.args[0], null);
                    break;
                case CommandType.Blit:
                    {
                        let args =cmd.args;
                        this.blit(args[0],args[1],args[2]);
                    }
                    break;
                case CommandType.Draw:
                    {
                        let args = cmd.args;
                        this.drawMeshWithMat(args[0],args[1],cmd.temp_vao);
                    }
                    break;
                case CommandType.DrawSkybox:
                    {
                        this.drawSkyBox(cmd.args[0]);
                    }
                    break;
            }
        }
    }
}


export class InternalPipeline extends RenderPipelineBase<InternalRenderModel> {
    public model: IRenderModel;
    public clearInfo: PipelineClearInfo;
    private m_hasError: boolean = false;

    public constructor(clearInfo?: PipelineClearInfo) {
        super();
        this.clearInfo = clearInfo;
    }

    onSetupRender(glctx: GLContext, info: GraphicsRenderCreateInfo) {

        super.onSetupRender(glctx, info);
        this.model = new InternalRenderModel(this);
    }

    exec() {
        if (this.m_hasError) return;

        const glctx = this.glctx;
        const model = this.model;



        glctx.bindGLFramebuffer(this.mainFrameBuffer);

        if(this.clearInfo!=null){
            glctx.clearColorAry(this.clearInfo.color.raw);
            glctx.clear(GL.COLOR_BUFFER_BIT);
        }


        model.updateDefaultUniform();

        let graphicsCmd = Graphics.onFrame();
        if(graphicsCmd){
            model.execCommand(graphicsCmd);
        }

        //loop all camera

        const gamectx = GameContext.current;

        let cam = gamectx.mainCamera;

        //render
        if (!cam.enabled) return;

        model.updateDefaultUniform();
        model.updateCameraUnifomrm(cam);

        let cmdbuffer = cam.cmdbufferClear;
        //clear
        if (cmdbuffer.valid) {
            model.execCommand(cmdbuffer);
        }

        let cameraCmdList = cam.cmdList;

        const renderNodeList = gamectx.nodeList;

        //opaque
        this.execCmdBuffers(cameraCmdList.beforeOpaque);
        this.drawNodeList(renderNodeList.nodeOpaque);
        this.execCmdBuffers(cameraCmdList.afterOpaque);
        //transparent

        this.execCmdBuffers(cameraCmdList.beforeTransparent);
        this.drawNodeList(renderNodeList.nodeTransparent);
        this.execCmdBuffers(cameraCmdList.afterTransparent);

        //postprocess
        this.execCmdBuffers(cameraCmdList.beforePostProcess);
        this.drawNodeList(renderNodeList.nodeImage);
        this.execCmdBuffers(cameraCmdList.afterPostProcess);
        //final

        let error = glctx.getError();
        this.m_hasError = error != 0;
        if (this.m_hasError) {
            console.error("Get GLError: " + error);
        }
    }

    private drawNodeList(list:IndexedBuffer<BaseRender>){
        const size = list.size;
        if(size ==0) return;
        
        const ary = list.array;

        for(let t=0;t<size;t++){
            let render:BaseRender = ary[t];
            this.model.drawBaseRender(render);
        }



    }

    reload() {
    }
    
    release(){
        
    }


    private execCmdBuffers(cmdlist: CommandBuffer[]) {

        let len = cmdlist.length;
        if (len == 0) return;


        const model = this.model;
        for (let t = 0; t < len; t++) {
            let cb = cmdlist[t];
            if (cb.valid) {
                model.execCommand(cb);
            }
        }
    }
}