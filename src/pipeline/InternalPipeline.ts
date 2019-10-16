import { GraphicsRenderCreateInfo, ITexture, Material, Mesh, MeshRender } from "../core";
import { AssetsBundle, AssetsDataBase } from "../core/AssetsDatabase";
import { ShaderFX } from "../core/ShaderFX";
import { FrameBuffer, GL, GLContext, GLProgram, GLVertexArray } from "../gl";
import { mat4, vec4 } from "../math";
import { IRenderModel } from "./IRenderModel";
import { RenderPipelineBase } from "./RenderPipelineBase";

export interface PipelineClearInfo {
    color?: vec4;
    depth?: number;
    clearMask?: number;
}

export class InternalRenderModel implements IRenderModel {

    private m_pipeline: InternalPipeline;

    private m_matDefault: Material;
    private m_matError: Material;

    private m_assets: AssetsBundle;

    public constructor(pipeline: InternalPipeline) {
        this.m_pipeline = pipeline;

        let resBundle = AssetsDataBase.getLoadedBundle("iris");
        if (resBundle == null) {
            throw new Error("InternalPipeline require iris.resbundle");
        }

        this.m_matDefault = new Material(ShaderFX.findShader(resBundle, "@shaderfx/unlit_color"));
        this.m_matError = new Material(ShaderFX.findShader(resBundle, "@shaderfx/unlit_color"));
    }

    public getMaterialDefault(): Material {
        return this.m_matDefault;
    }

    public getMaterialError(): Material {
        return this.m_matError;
    }

    bindDefaultUniform(program: GLProgram) {
        throw new Error("Method not implemented.");
    }
    updateDefaultUniform() {
        throw new Error("Method not implemented.");
    }
    setShadowMapTex(tex: ITexture, index: number) {
        throw new Error("Method not implemented.");
    }
    drawFullScreen(tex: ITexture) {
        throw new Error("Method not implemented.");
    }
    drawScreenTex(tex: ITexture, rect: vec4) {
        throw new Error("Method not implemented.");
    }
    drawMeshRender(meshrender: MeshRender, objmtx?: mat4, material?: Material) {
        throw new Error("Method not implemented.");
    }
    drawMeshWithMat(mesh: Mesh, mat: Material, vao: GLVertexArray, objmtx?: mat4) {
        throw new Error("Method not implemented.");
    }
    clearFrameBufferTarget(clearinfo: PipelineClearInfo, fb: FrameBuffer) {
        throw new Error("Method not implemented.");
    }

}


export class InternalPipeline extends RenderPipelineBase<InternalRenderModel> {


    public model: IRenderModel;

    public clearInfo: PipelineClearInfo;

    public constructor(clearInfo?: PipelineClearInfo) {
        super();

        if (clearInfo == null) clearInfo = { color: vec4.one, depth: 0, clearMask: GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT };
        this.clearInfo = clearInfo;

        this.model = new InternalRenderModel(this);



    }

    onSetupRender(glctx: GLContext, info: GraphicsRenderCreateInfo) {
        super.onSetupRender(glctx, info);
    }

    exec(data: any) {

        const glctx = this.glctx;

        glctx.clear(GL.COLOR_BUFFER_BIT);
    }

    reload() {
    }
    release() {
    }
}