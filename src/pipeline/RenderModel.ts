import { GLProgram } from "../gl/GLProgram";
import { mat4 } from "../math/GLMath";
import { BaseRender } from "../BaseRender";
import { PipelineBase } from "./PipelineBase";
import { ShaderDataBasis, ShaderDataUniformObj, ShaderDataUniformShadowMap, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { FrameBuffer } from "../gl/FrameBuffer";
import { GLContext } from "../gl/GLContext";
import { IGraphicObj, ReleaseGraphicObj } from "../IGraphicObj";
import { IRenderPipeline } from "./IRenderPipeline";
import { ShaderUniformBuffer } from "../shaderfx/ShaderUniformBuffer";
import { MeshRender } from "../MeshRender";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { Material } from "../Material";
import { Mesh } from "../Mesh";
import { ITexture } from "../Texture";
import { Camera } from "../Camera";
import { PipelineClearInfo } from "./RenderPipeline";
import { Scene } from "../Scene";


/**
 * @todo add internal res to graphics render
 */
export class RenderModel implements IGraphicObj{
    private m_glctx:GLContext;

    private m_uniformBasis:ShaderUniformBuffer<ShaderDataBasis>;
    private m_uniformObj:ShaderUniformBuffer<ShaderDataUniformObj>;
    private m_uniformLight:ShaderUniformBuffer<ShaderDataUniformLight>;
    private m_uniformShadowMap:ShaderUniformBuffer<ShaderDataUniformShadowMap>;

    private m_matFullscreen:Material;
    private m_renderFullscreen:MeshRender;

    private m_screenAspect:number;


    
    public get uniformBasis():ShaderUniformBuffer<ShaderDataBasis>{return this.m_uniformBasis;}
    public get uniformObj():ShaderUniformBuffer<ShaderDataUniformObj>{return this.m_uniformObj;}
    public get uniformLight():ShaderUniformBuffer<ShaderDataUniformLight>{return this.m_uniformLight;}
    public get uniformShadowMap():ShaderUniformBuffer<ShaderDataUniformShadowMap>{return this.m_uniformShadowMap;}



    public constructor(pipeline:IRenderPipeline){
        const glctx = pipeline.graphicRender.glctx;
        this.m_glctx = glctx;

        this.m_uniformObj = new ShaderUniformBuffer(glctx,ShaderDataUniformObj,0,ShaderFX.UNIFORM_OBJ);
        this.m_uniformBasis = new ShaderUniformBuffer(glctx,ShaderDataBasis,1,ShaderFX.UNIFORM_BASIS);
        this.m_uniformShadowMap = new ShaderUniformBuffer(glctx,ShaderDataUniformShadowMap,2,ShaderFX.UNIFORM_SHADOWMAP);
        this.m_uniformLight = new ShaderUniformBuffer(glctx,ShaderDataUniformLight,3,ShaderFX.UNIFORM_LIGHT);
    
        this.m_matFullscreen = new Material(pipeline.graphicRender.shaderLib.shaderBlit);
        this.m_renderFullscreen = new MeshRender(Mesh.Quad,this.m_matFullscreen);
    }


    public bindDefaultUniform(program:GLProgram){
        const glctx = this.m_glctx;
        const glp = program.Program;
        let ublock = program.UniformBlock;

        let uniformBasis = this.m_uniformBasis;
        let indexBasis = ublock[uniformBasis.name];
        if(indexBasis != null) glctx.uniformBlockBinding(glp,indexBasis,uniformBasis.uniformIndex);

        let uniformObj = this.m_uniformObj;
        let indexObj = ublock[uniformObj.name];
        if(indexObj != null) glctx.uniformBlockBinding(glp,indexObj,uniformObj.uniformIndex);

        let uniformLight = this.m_uniformLight;
        let indexLight = ublock[uniformLight.name];
        if(indexLight != null) glctx.uniformBlockBinding(glp,indexLight,uniformLight.uniformIndex);

        //ShadowMap todo
    }

    public updateUnifromScreenParam(w:number,h:number){
        let uniformBasis = this.m_uniformBasis;
        let data = uniformBasis.data;
        data.render.setScreenParam(w,h);
        this.m_screenAspect =w*1.0 / h;
    }

    public updateUniformBasis(cam:Camera){
        let uniformBasis = this.m_uniformBasis;
        let data = uniformBasis.data;

        let datacamera = data.camrea;
        if(cam.isDataTrsDirty){
            datacamera.setCameraMtxView(cam.WorldMatrix);
            datacamera.setCameraPos(cam.transform.position);
            cam.isDataTrsDirty = false;
        }

        if(cam.aspect != this.m_screenAspect) cam.aspect= this.m_screenAspect;
        if(cam.isDataProjDirty){
            datacamera.setCameraMtxProj(cam.ProjMatrix);
            datacamera.setProjParam(cam.near,cam.far);
            cam.isDataProjDirty = false;
        }
    }

    public updateUniformLightData(scene:Scene):boolean{
        if(!scene.lightDataDirty) return false;

        let uniformLight =this.m_uniformLight;
        
        let data = uniformLight.data;
        
        const lightNum = scene.lightCount;
        const alllights = scene.lightDataList;
        data.setLightCount(lightNum);
        
        data.setPointLights(alllights,lightNum);
        data.setMainLight(scene.lightPrime);

        uniformLight.uploadBufferData(this.m_glctx);
        scene.lightDataDirty = false;

        console.log("upload light data");

        return true;

    }

    public updateUniformObjMtx(objmtx:mat4){
        let uniformObj = this.m_uniformObj;
        uniformObj.data.setMtxModel(objmtx);
        uniformObj.uploadBufferData(this.m_glctx);
    }

    public drawFullScreen(tex:ITexture){
        const mat = this.m_matFullscreen;
        mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,tex);
        this.drawMeshRender(this.m_renderFullscreen);
    }

    public drawMeshRender(meshrender:MeshRender,objmtx?:mat4){
        let mat = meshrender.material;
        let mesh = meshrender.mesh;

        const glctx = this.m_glctx;
        meshrender.refreshData(glctx);
        let glp = mat.program;
        glctx.useGLProgram(glp);
        this.bindDefaultUniform(glp);
        mat.apply(glctx);
        if(objmtx != null){
            this.updateUniformObjMtx(objmtx);
        }

        meshrender.bindVertexArray(glctx);
        glctx.drawElementIndices(mesh.indiceDesc);
        meshrender.unbindVertexArray(glctx);
        mat.clean(glctx);
    }

    public drawMeshWithMat(mesh:Mesh,mat:Material,vao:WebGLVertexArrayObject,objmtx:mat4){
        const glctx = this.m_glctx;
        mesh.refreshMeshBuffer(glctx);
        let glp = mat.program;
        glctx.useGLProgram(glp);
        this.bindDefaultUniform(glp);
        mat.apply(glctx);
        if(objmtx != null)this.updateUniformObjMtx(objmtx);
        glctx.bindVertexArray(vao);
        glctx.drawElementIndices(mesh.indiceDesc);
        glctx.bindVertexArray(null);
        mat.clean(glctx);
    }

    public clearFrameBufferTarget(clearinfo:PipelineClearInfo,fb:FrameBuffer){
        if(clearinfo == null )return;
        const glctx = this.m_glctx;
        glctx.bindGLFramebuffer(fb);
        let ccol = clearinfo.color;
        if(ccol) glctx.clearColorAry(ccol.raw);
        let depth = clearinfo.depth;
        if(depth !=null) glctx.clearDepth(depth);
        glctx.clear(clearinfo.clearMask);
    }

    public release(glctx:GLContext){
        this.m_glctx = null;
        this.m_uniformObj = ReleaseGraphicObj(this.m_uniformObj,glctx);
        this.m_uniformBasis = ReleaseGraphicObj(this.m_uniformBasis,glctx);
        this.m_uniformLight = ReleaseGraphicObj(this.m_uniformLight,glctx);
        this.m_uniformShadowMap = ReleaseGraphicObj(this.m_uniformShadowMap,glctx);
    }

}
