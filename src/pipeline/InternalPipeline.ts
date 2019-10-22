import { GraphicsRenderCreateInfo, ITexture, Material, Mesh, MeshRender, SceneManager, GraphicsObj, Camera, Texture2D } from "../core";
import { AssetsBundle, AssetsDataBase } from "../core/AssetsDatabase";
import { ShaderFX, CullingMode } from "../core/ShaderFX";
import { FrameBuffer, GL, GLContext, GLProgram, GLVertexArray } from "../gl";
import { mat4, vec4 } from "../math";
import { IRenderModel } from "./IRenderModel";
import { RenderPipelineBase } from "./RenderPipelineBase";
import { CommandBuffer, CommandType } from "../core/CommandBuffer";
import { MeshPrimitive } from "../core/MeshPrimitive";
import { ShaderDataBasis, ShaderDataObj, ShaderDataCamera, ShaderDataLight } from "./InternalPipelineUniform";
import { ShaderUniformBuffer } from "../core/ShaderUniformBuffer";
import { GraphicsSettings } from "../core/GraphicsSettings";
import { GameTime } from "../core/GameTime";
import { Graphics } from "../core/Graphics";

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
    private m_fullscreenMat: Material;


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


        this.m_fullscreenMat = new Material(ShaderFX.findShader(resBundle, "@shaderfx/unlit"));

        this.m_fullscreenRender = new MeshRender(MeshPrimitive.Quad, this.m_fullscreenMat, false);
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
    }

    setShadowMapTex(tex: ITexture, index: number) {
        throw new Error("Method not implemented.");
    }
    drawFullScreen(tex: ITexture) {
        let mat = this.m_fullscreenMat;
        mat.setTexture("uSampler", tex);
        this.drawMeshRender(this.m_fullscreenRender, null, mat);
    }
    drawScreenTex(tex: ITexture, rect?: vec4) {
        rect = rect || InternalRenderModel.s_defaultScreenRect;

        let mat = this.m_fullscreenMat;
        mat.setTexture("uSampler", tex);
        this.drawMeshRender(this.m_fullscreenRender, null, mat);
    }
    drawMeshRender(meshrender: MeshRender, objmtx?: mat4, material?: Material) {

        const glctx = this.glctx;
        meshrender.refreshData();

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

    bindFrameBuffer(fb:FrameBuffer){
        let glctx=  this.glctx;
        if(glctx.bindGLFramebuffer(fb)){
            glctx.viewport(0,0,fb.width,fb.height);
        }
    }

    blit(src:Texture2D,dest:Texture2D,mat?:Material){
        if(dest ==null) return;
        let material:Material = mat || this.m_fullscreenMat;

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
        throw new Error("Method not implemented.");
    }
    clearFrameBufferTarget(clearinfo: PipelineClearInfo, fb: FrameBuffer) {
        throw new Error("Method not implemented.");
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
                    let args =cmd.args;
                    this.blit(args[0],args[1],args[2]);
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

        if (clearInfo == null) clearInfo = { color: vec4.one, depth: 0, clearMask: GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT };
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
        glctx.clearColor(1.0,1.0,0,1.0);
        glctx.clear(GL.COLOR_BUFFER_BIT);

        model.updateDefaultUniform();

        let graphicsCmd = Graphics.onFrame();
        if(graphicsCmd){
            model.execCommand(graphicsCmd);
        }

        //loop all camera

        let cameras = SceneManager.allCameras;
        

        cameras.forEach(cam => {


            //render
            if (!cam.enabled) return;

            model.updateCameraUnifomrm(cam);

            let cmdbuffer = cam.cmdbufferClear;
            //clar
            if (cmdbuffer.valid) {
                model.execCommand(cmdbuffer);
            }

            let cameraCmdList = cam.cmdList;

            //opaque
            this.execCmdBuffers(cameraCmdList.beforeOpaque);

            this.execCmdBuffers(cameraCmdList.beforeOpaque);
            //transparent

            this.execCmdBuffers(cameraCmdList.beforeTransparent);

            this.execCmdBuffers(cameraCmdList.afterTransparent);

            //postprocess
            this.execCmdBuffers(cameraCmdList.beforePostProcess);

            this.execCmdBuffers(cameraCmdList.afterPostProcess);
            //final
        });


        let error = glctx.getError();
        this.m_hasError = error != 0;
        if (this.m_hasError) {
            console.error("Get GLError: " + error);
        }

    }

    reload() {
    }
    release() {
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