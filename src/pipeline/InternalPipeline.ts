import { IRenderModel } from "./IRenderModel";
import { GLProgram, GLVertexArray, FrameBuffer } from "../gl";
import { Material, ITexture, MeshRender, Mesh } from "../core";
import { vec4, mat4 } from "../math";
import { PipelineClearInfo } from "./RenderPipeline";
import { RenderPipelineBase } from "./RenderPipelineBase";
import { AssetsDataBase, AssetsBundle } from "../core/AssetsDatabase";
import { ShaderFX } from "../core/ShaderFX";


export class InternalRenderModel implements IRenderModel {

    private m_pipeline:InternalPipeline;

    private m_matDefault:Material;
    private m_matError:Material;

    private m_assets:AssetsBundle;

    public constructor(pipeline:InternalPipeline){
        this.m_pipeline = pipeline;

        let resBundle = AssetsDataBase.getLoadedBundle("iris");
        if(resBundle == null){
            throw new Error("InternalPipeline require iris.resbundle");
        }

        this.m_matDefault = new Material(ShaderFX.findShader(resBundle,"@shaderfx/unlit_color"));
        this.m_matError = new Material(ShaderFX.findShader(resBundle,"@shaderfx/unlit_color"));
    }

    public getMaterialDefault(): Material {
        return this.m_matDefault;
    } 

    public getMaterialError():Material{
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

    public model:IRenderModel;

    public constructor(){
        super();
        this.model = new InternalRenderModel(this);
    }
}