import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { ShadowMapInfo } from "../pipeline/RenderTaskShadowMap";
import { Shader } from "../shaderfx/Shader";
import { GLProgram, glmath, vec3, mat4, vec4 } from "wglut";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { ShadowCascade, ShadowConfig } from "./Shadow";
import { Texture } from "../Texture";
import { Light, LightType } from "../Light";
import { Camera } from "../Camera";
import { RenderNodeList } from "../RenderNodeList";


export class PassShadowMap{

    private pipe:PipelineForwardZPrepass;

    private m_shader:Shader;
    private m_program:GLProgram;

    private m_blockIndexCam:number;
    private m_blockIndexObj:number;

    private m_smwidth:number;
    private m_smheight:number;

    private m_smtex:WebGLTexture;
    private m_smfb:WebGLFramebuffer;


    public constructor(pipeline:PipelineForwardZPrepass){
        this.pipe = pipeline;

        this.initShadowMaps();
    }

    private initShadowMaps(){
        let pipe = this.pipe;
        let gl =pipe.GL;
        let glctx = pipe.GLCtx;

        let config = pipe.graphicRender.shadowConfig;

        let shadowMapInfo:ShadowMapInfo[] = [];
        pipe.shadowMapInfo = shadowMapInfo;
        for(let i=0;i<4;i++){
            shadowMapInfo.push(new ShadowMapInfo());
        }

        let shader = pipe.graphicRender.shaderLib.shaderDepth;
        let program = shader.defaultProgram;
        this.m_shader = shader;
        this.m_program = program;

        let ublocks = program.UniformBlock;
        let indexCam = ublocks[ShaderFX.UNIFORM_CAM];
        let indexObj = ublocks[ShaderFX.UNIFORM_OBJ];
        this.m_blockIndexCam = indexCam;
        this.m_blockIndexObj = indexObj;

        let size = config.shadowmapSize;
        
        let smheight = size;
        let smwidth = size;
        if(config.cascade == ShadowCascade.TwoCascade){
            smwidth *=2;
        }
        this.m_smheight = smheight;
        this.m_smwidth = smwidth;

        //depth texture and framebuffer
        let smtex = gl.createTexture();
        this.m_smtex = smtex;
        gl.activeTexture(ShaderFX.GL_SHADOWMAP_TEX0);
        gl.bindTexture(gl.TEXTURE_2D,smtex);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,smwidth,smheight);
        gl.bindTexture(gl.TEXTURE_2D,null);
        
        let smfb = gl.createFramebuffer();
        this.m_smfb = smfb;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,smfb);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,smtex,0);
        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE){
            console.error('fb status incomplete '+ status.toString(16));
        }
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);

    }

    public render(scene:Scene,queue:MeshRender[]){
        const CLASS = PipelineForwardZPrepass;

        let cam = scene.camera;
        if(cam == null) return;
        let pipe = this.pipe;
        cam.aspect = pipe.mainFrameBufferAspect;
        let config = pipe.graphicRender.shadowConfig;

        //use program 
        let program = this.m_program;
        let gl = pipe.GL;
        let glp = program.Program;
        gl.useProgram(glp);
        gl.uniformBlockBinding(glp,this.m_blockIndexCam,CLASS.UNIFORMINDEX_CAM);
        gl.uniformBlockBinding(glp,this.m_blockIndexObj,CLASS.UNIFORMINDEX_OBJ);

        let light = scene.lights;
        for(let i=0,lcount = light.length;i<lcount;i++){
            this.renderLightShadowMap(light[i],cam,queue,config);
        }

        //update shadowmap uniform buffer
        let smdata = this.pipe.shaderDataShadowMap;
        pipe.updateUniformBufferShadowMap(smdata);
    }

    private renderLightShadowMap(light:Light,camera:Camera,queue:MeshRender[],config:ShadowConfig){

        if(light.lightType != LightType.direction) return;

        let pipe = this.pipe;
        let gl = pipe.GL;
        let smdata =pipe.shaderDataShadowMap;

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.m_smfb);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.viewport(0,0,this.m_smwidth,this.m_smheight);

        let lightMtxs = this.calculateLightMatrix(light,camera,config);
        let [lightworldMtx,lightProjMtx] = lightMtxs[0];
        let lightMtx = lightProjMtx.mul(lightworldMtx);
        smdata.setLightMtx(lightMtx,0);
        pipe.shadowMapInfo[0].lightMtx = lightMtx;

        let cascades =config.cascade;
        let size = this.m_smheight;
        if(cascades == 1){
            this.renderShadowCascade(glmath.vec4(0,0,size,size),queue,lightMtxs[0]);
        }
        else if(cascades == 2){
            this.renderShadowCascade(glmath.vec4(0,0,size,size),queue,lightMtxs[0]);
            this.renderShadowCascade(glmath.vec4(size,0,size,size),queue,lightMtxs[1]);
        }else{
            this.renderShadowCascade(glmath.vec4(0,0,size,size),queue,lightMtxs[0]);
            this.renderShadowCascade(glmath.vec4(size,0,size,size),queue,lightMtxs[1]);
            this.renderShadowCascade(glmath.vec4(0,size,size,size),queue,lightMtxs[2]);
            this.renderShadowCascade(glmath.vec4(size,size,size,size),queue,lightMtxs[3]);
        }

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
    }

    private calculateLightMatrix(light:Light,camera:Camera,config:ShadowConfig):[mat4,mat4][]{
        let ctrs = camera.transform;
        let near = camera.near;
        let far = camera.far;

        let camdist = far- near;
        let shadowDis= Math.min(camdist,config.shadowDistance);
        let cascades:number= config.cascade;
        let cascadeSplit:number[] = config.cascadeSplit;

        let fardist = near;
        let neardist = near;

        let campos = ctrs.localPosition;
        let camforward = ctrs.forward;

        let hcoefficient = Math.tan(camera.fov /2.0 * glmath.Deg2Rad);
        let wcoefficient = hcoefficient * camera.aspect;

        let ldir = light.lightPosData;
        let lup = vec3.up;

        if(Math.abs(vec3.Dot(lup,ldir)) > 0.99){
            lup = glmath.vec3(0,1,0.001);
        }

        let ret = [];
        for(let i=0;i<cascades;i++){
            let dist = cascadeSplit[i ]* shadowDis;
            fardist +=dist;
            let d = dist *0.5;
            let cdist = neardist + d;
            let cpos = campos.clone().sub(camforward.clone().mul(cdist));
            let h = fardist * hcoefficient;
            let w = fardist * wcoefficient;
            let r = Math.sqrt(h *h + d* d + w * w);
            let lpos = cpos.sub(ldir.mulToRef(r));

            let vmtx = mat4.coordCvt(lpos,ldir,lup);
            let pmtx = mat4.orthographic(r,r,0.1,r*2.0);

            ret.push([vmtx,pmtx]);

            neardist += dist;
        }
        return ret;
    }

    private renderShadowCascade(vp:vec4,queue:MeshRender[],mtx:[mat4,mat4]){
        let pipe = this.pipe;
        let glctx = pipe.GLCtx;
        let gl = glctx.gl;

        let camdata = pipe.shaderDataCam;;
        camdata.setMtxView(mtx[0]);
        camdata.setMtxProj(mtx[1]);
        pipe.updateUniformBufferCamera(camdata);

        gl.viewport(vp.x,vp.y,vp.z,vp.w);
        let objdata = pipe.shaderDataObj;

        let queueLen = queue.length;
        for(let i=0;i<queueLen;i++){
            let node = queue[i];
            if(!node.castShadow) continue;
            let mat = node.material;
            let mesh = node.mesh;
            if(mat == null || mesh == null) continue;
            node.refershVertexArray(glctx);

            let trs = node.object.transform;
            objdata.setMtxModel(trs.objMatrix);
            pipe.updateUniformBufferObject(objdata);

            gl.bindVertexArray(node.vertexArrayObj);
            let indicesDesc = mesh.indiceDesc;
            gl.drawElements(indicesDesc.topology,indicesDesc.indiceCount,indicesDesc.indices.type,0);
            gl.bindVertexArray(null);
        }
    }
}