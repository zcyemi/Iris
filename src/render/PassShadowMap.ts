import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { ShadowMapInfo } from "../pipeline/RenderTaskShadowMap";
import { Shader } from "../shaderfx/Shader";
import { GLProgram, glmath, vec3, mat4, vec4 } from "wglut";
import { ShaderFX, ShaderFile } from "../shaderfx/ShaderFX";
import { ShadowCascade, ShadowConfig } from "./Shadow";
import { Texture, TextureCreationDesc } from "../Texture";
import { Light, LightType } from "../Light";
import { Camera } from "../Camera";
import { RenderNodeList } from "../RenderNodeList";
import { BufferDebugInfo } from "../pipeline/BufferDebugInfo";
import { Mesh } from "../Mesh";
import { ShaderSource } from "../shaderfx/ShaderSource";
import { Material } from "../Material";
import { ShaderDataUniformShadowMap } from "../shaderfx/ShaderFXLibs";
import { pipeline } from "stream";


export class PassShadowMap{

    private pipe:PipelineForwardZPrepass;

    private m_shader:Shader;
    private m_program:GLProgram;

    private m_blockIndexCam:number;
    private m_blockIndexObj:number;

    private m_smwidth:number;
    private m_smheight:number;

    private m_smtex:Texture;
    private m_smfb:WebGLFramebuffer;

    private m_bufferDebugInfo:BufferDebugInfo;

    //ShadowGathering
    private m_shadowTexture:Texture;
    private m_shadowFB:WebGLFramebuffer;
    private m_quadMesh:Mesh;
    private m_quadVAO:WebGLVertexArrayObject;
    private m_gatherMat:Material;

    @ShaderFile("shadowsGather")
    private static SH_shadowGather:ShaderSource;
    private static s_shadowGatherShader:Shader;

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

        let smtexdesc = new TextureCreationDesc(null,gl.DEPTH_COMPONENT24,false,gl.NEAREST,gl.NEAREST);
        let smtex = Texture.createTexture2D(smwidth,smheight,smtexdesc,glctx);
        this.m_smtex = smtex;

        
        gl.activeTexture(gl.TEXTURE12);
        gl.bindTexture(gl.TEXTURE_2D,smtex.rawtexture);
        
        let smfb = gl.createFramebuffer();
        this.m_smfb = smfb;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,smfb);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,smtex.rawtexture,0);
        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE){
            console.error('fb status incomplete '+ status.toString(16));
        }
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);


        let debuginfo = new BufferDebugInfo(this.m_smtex,glmath.vec4(200,0,200,200));
        pipe.addBufferDebugInfo(debuginfo);

        //shadow gather

        if(PassShadowMap.s_shadowGatherShader == null){
            let gathersh = ShaderFX.compileShaders(glctx,PassShadowMap.SH_shadowGather);
            PassShadowMap.s_shadowGatherShader = gathersh;
        }

        let gathermat = new Material(PassShadowMap.s_shadowGatherShader);
        let gatherProj = gathermat.program;
        this.m_gatherMat = gathermat;

        gathermat.setTexture("uDepthTexure",pipe.mainDepthTexture);
        gathermat.setTexture("uShadowMap",this.m_smtex);

        this.m_quadMesh = Mesh.Quad;
        this.m_quadVAO = MeshRender.CreateVertexArrayObj(glctx,this.m_quadMesh,gatherProj);


        let texdesc = new TextureCreationDesc(gl.RGB,gl.RGB8,false,gl.LINEAR,gl.LINEAR);
        let stex = Texture.createTexture2D(pipe.mainFrameBufferWidth,pipe.mainFrameBufferHeight,texdesc,glctx);
        this.m_shadowTexture = stex;

        let sfb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,sfb);
        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,stex.rawtexture,0);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
        this.m_shadowFB = sfb;

        let debugshadows = new BufferDebugInfo(stex,glmath.vec4(0,200,200,200));
        pipe.addBufferDebugInfo(debugshadows);


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


        let lights = scene.lights;
        for(let i=0,lcount = lights.length;i<lcount;i++){
            this.renderLightShadowMap(lights[i],cam,queue,config);
        }

        //update shadowmap uniform buffer
        let smdata = this.pipe.shaderDataShadowMap;
        pipe.updateUniformBufferShadowMap(smdata);

        //update camerabuffer

        let datacam = pipe.shaderDataCam;
        datacam.setCameraPos(cam.transform.position);
        datacam.setClipPlane(cam.near,cam.far);
        datacam.setMtxProj(cam.ProjMatrix);
        datacam.setMtxView(cam.WorldMatrix);
        datacam.setScreenSize(pipe.mainFrameBufferWidth,pipe.mainFrameBufferHeight);
        pipe.updateUniformBufferCamera(datacam);

        //this.shadowGathering(lights[0]);

        pipe.bindTargetFrameBuffer(true);
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

        let camdist = far - near;
        let shadowDis = Math.min(camdist,config.shadowDistance);
        let cascades:number = config.cascade;
        let cascadeSplit:number[] = config.cascadeSplit;

        let fardist = near;
        let neardist = near;

        let campos = ctrs.localPosition;
        let camforward = ctrs.forward;

        let hCoefficient = Math.tan(camera.fov / 2.0 * glmath.Deg2Rad);
        let wCoefficient = hCoefficient * camera.aspect;

        let ldir = light.lightPosData;
        let lup = vec3.up;
        if(Math.abs(vec3.Dot(lup,ldir))>0.99){
            lup = glmath.vec3(0,1,0.001);
        }
        
        let ret = [];

        for(let i=0;i<cascades;i++){
            let dist = cascadeSplit[i] * shadowDis;
            fardist += dist;

            let d =dist *0.5;

            let cdist = neardist + d;
            let cpos = campos.clone().sub(camforward.clone().mul(cdist));
            let h = fardist * hCoefficient;
            let w = fardist * wCoefficient;

            let r = Math.sqrt(h *h + d* d + w * w);
            let lpos = cpos.sub(ldir.mulToRef(r));

            let vmtx = mat4.coordCvt(lpos,ldir,lup);
            let pmtx = mat4.orthographic(r,r,0.1,r*2.0);

            ret.push([vmtx,pmtx]);

            //next frausta
            neardist += dist;
        }
        return ret;
    }

    private renderShadowCascade(vp:vec4,queue:MeshRender[],mtx:[mat4,mat4]){

        let pipe = this.pipe;
        let glctx = pipe.GLCtx;
        let gl = glctx.gl;

        let camdata = pipe.shaderDataCam;
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


    private shadowGathering(light:Light){

        const CLASS = PipelineForwardZPrepass;


        let dataSM =this.pipe.shaderDataShadowMap;

        dataSM.setLightMtx(this.pipe.shadowMapInfo[0].lightMtx,0);
        this.pipe.updateUniformBufferShadowMap(dataSM);

        const gl =this.pipe.GL;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.m_shadowFB);
        gl.clearColor(0,0,0,0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        let shadowtex = this.m_shadowTexture;

        gl.viewport(0,0,shadowtex.width,shadowtex.height);

        let mat = this.m_gatherMat;
        let program = mat.program;

        let glp = program.Program;
        gl.useProgram(glp);

        let blocks = program.UniformBlock;
        let indexSM = blocks[ShaderFX.UNIFORM_SHADOWMAP];
        if(indexSM !=null){
            gl.uniformBlockBinding(glp,indexSM,CLASS.UNIFORMINDEX_SHADOWMAP);
        }

        let indexCam = blocks[ShaderFX.UNIFORM_CAM];
        if(indexCam != null){
            gl.uniformBlockBinding(glp,indexCam,CLASS.UNIFORMINDEX_CAM);
        }

        let indexObj = blocks[ShaderFX.UNIFORM_OBJ];
        if(indexObj != null){
            gl.uniformBlockBinding(glp,indexObj,CLASS.UNIFORMINDEX_OBJ);
        }

        mat.apply(gl);

        let mesh = this.m_quadMesh;
        let vao = this.m_quadVAO;
        gl.bindVertexArray(vao);

        let indices = mesh.indiceDesc;
        gl.drawElements(gl.TRIANGLES,indices.indiceCount,indices.indices.type,0);
        gl.bindVertexArray(null);

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);


    }
}