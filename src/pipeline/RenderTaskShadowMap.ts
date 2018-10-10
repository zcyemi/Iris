import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { Light, LightType } from "../Light";
import { GLContext, GLProgram, mat4, glmath, vec4, vec3 } from "wglut";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { Camera } from "../Camera";
import { ShaderSource } from "../shaderfx/ShaderSource";
import { Shader } from "../shaderfx/Shader";
import { ShaderDataUniformCam, ShaderDataUniformObj, ShaderDataUniformShadowMap } from "../shaderfx/ShaderFXLibs";
import { ShadowConfig, ShadowCascade } from "../render/Shadow";
import { MeshRender } from "../MeshRender";

export class ShadowMapInfo{
    public texture:WebGLTexture;
    public lightMtx:mat4;
}

export class RenderTaskShadowMap extends RenderTask{

    private static readonly s_shaderShadowMap:ShaderSource = RenderTaskShadowMap.genShaderShadwoMap();
    private m_shadowMapShader:Shader;
    private m_shadowMapProgram:GLProgram;

    private m_blockIndexPerObj:number;
    private m_blockIndexPerCam:number;

    private m_shadowMapFrameBuffer:WebGLFramebuffer;
    private m_shadowMapTex:WebGLTexture;
    private m_shadowMapTexDebug:WebGLTexture;

    private m_camdata:ShaderDataUniformCam;
    private m_objdata:ShaderDataUniformObj;

    private m_cambuffer:WebGLBuffer;
    private m_objbuffer:WebGLBuffer;

    private m_smdata: ShaderDataUniformShadowMap;
    private m_smbuffer:WebGLBuffer;

    private m_debugColor:boolean = false;

    public m_shadowMapSize:number = 1024;

    private m_shadowConfig:ShadowConfig;

    private m_smWidth:number;
    private m_smHeight:number;


    public init(){
        if(this.m_inited) return;
        let pipe = this.pipeline;
        let gl =pipe.GL;
        let glctx = pipe.GLCtx;

        this.m_shadowConfig = pipe.graphicRender.shadowConfig;

        //uniformbuffer
        if(this.m_camdata == null) this.m_camdata =new ShaderDataUniformCam();
        if(this.m_objdata == null) this.m_objdata = new ShaderDataUniformObj();

        this.m_cambuffer = pipe.sharedBufferPerCam;
        this.m_objbuffer = pipe.sharedBufferPerObj;

        if(this.m_smdata == null) this.m_smdata = new ShaderDataUniformShadowMap();
        this.m_smbuffer = pipe.sharedBufferShadowMap;
        

        //sminfo
        let shadowMapInfos:ShadowMapInfo[] = [];
        pipe.shadowMapInfo = shadowMapInfos;
        for(let i=0;i<4;i++){
            shadowMapInfos.push(new ShadowMapInfo());
        }

        //shaders
        let shader= ShaderFX.compileShaders(glctx,RenderTaskShadowMap.s_shaderShadowMap);
        this.m_shadowMapShader = shader;
        this.m_shadowMapProgram = shader.defaultProgram;

        let program = this.m_shadowMapProgram;
        let ublocks = program.UniformBlock;
        this.m_blockIndexPerCam =ublocks[ShaderFX.UNIFORM_CAM];
        this.m_blockIndexPerObj = ublocks[ShaderFX.UNIFORM_OBJ];

        let size =this.m_shadowMapSize;
        let config = this.m_shadowConfig;
        this.m_smHeight = size;

        let smwidth = size;
        let smheight =size;
        if(config.cascade == ShadowCascade.TwoCascade){
            smwidth *= 2;
        }

        this.m_smWidth = smwidth;
        this.m_smHeight = smheight;

        //depth texture
        let deptex = gl.createTexture();
        this.m_shadowMapTex = deptex;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,deptex);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        
        gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT24,smwidth,smheight);

        gl.bindTexture(gl.TEXTURE_2D,null);
        pipe.shadowMapInfo[0].texture = deptex;

        //debug color texture;
        if(this.m_debugColor){
            let debugtex = gl.createTexture();
            this.m_shadowMapTexDebug =debugtex;
            gl.bindTexture(gl.TEXTURE_2D,debugtex);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

            gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA8,smwidth,smheight);
            gl.bindTexture(gl.TEXTURE_2D,null);

            this.m_shadowMapTexDebug = debugtex;
        }

        //framebuffer
        let fb = gl.createFramebuffer();
        this.m_shadowMapFrameBuffer =fb;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,fb);

        gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.TEXTURE_2D,deptex,0);
        if(this.m_shadowMapTexDebug) gl.framebufferTexture2D(gl.DRAW_FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,this.m_shadowMapTexDebug,0);

        let status = gl.checkFramebufferStatus(gl.DRAW_FRAMEBUFFER);
        if(status != gl.FRAMEBUFFER_COMPLETE){
            console.error('fb status incomplete '+ status.toString(16));
        }
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
        this.m_inited = true;
    }

    public release(glctx:GLContext){
        let pipeline = this.pipeline;
        let gl = pipeline.GL;

        this.m_shadowConfig= null;

        //shader buffers
        this.m_camdata = null;
        this.m_objdata = null;
        
        this.m_cambuffer = null;
        this.m_objbuffer = null;

        this.m_smdata =null;
        this.m_smbuffer = null;

        //sminfo
        pipeline.shadowMapInfo = null;

        //shaders
        this.m_shadowMapShader.release();

        let program = this.m_shadowMapProgram;
        gl.deleteProgram(program.Program);
        this.m_shadowMapProgram = null;

        this.m_blockIndexPerCam = null;
        this.m_blockIndexPerObj= null;

        //framebuffers
        if(this.m_shadowMapFrameBuffer != null){
            gl.deleteFramebuffer(this.m_shadowMapFrameBuffer);
            this.m_shadowMapFrameBuffer= null;
        }

        if(this.m_shadowMapTex != null){
            gl.deleteTexture(this.m_shadowMapTex);
            this.m_shadowMapTex = null;
        }
        if(this.m_shadowMapTexDebug != null){
            gl.deleteTexture(this.m_shadowMapTexDebug);
            this.m_shadowMapTexDebug = null;
        }

        this.m_inited = false;
    }

    public reload(glctx:GLContext){
        this.release(glctx);
        this.init();

        console.log('[reload RenderTaskShadowMap done!]');
    }

    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        let camera = scene.camera;
        if(camera == null) return;
        let lights = scene.lights;
        let lcount = lights.length;
        for(let i=0;i<lcount;i++){
            let l = lights[i];
            if(l.active && l.castShadow){
                this.renderShadowMap(l,scene,nodelist);
            }
        }

        //update uniformbuffer
        let gl = this.pipeline.GL;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_smbuffer);
        gl.bufferData(gl.UNIFORM_BUFFER,this.m_smdata.rawBuffer,gl.DYNAMIC_DRAW);
    }


    private calCascadeShadowMapLightMtx(light:Light,camera:Camera,config:ShadowConfig):[mat4,mat4][]{
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


    private renderShadowMap(light:Light,scene:Scene,nodelist:RenderNodeList){
        //Temp: only support directional light currently.
        if(light.lightType != LightType.direction) return;

        let gl = this.pipeline.GL;
        let pipe = this.pipeline;

        let smdata = this.m_smdata;

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.m_shadowMapFrameBuffer);

        //clear depth
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        gl.viewport(0,0,this.m_smWidth,this.m_smHeight);

        let program = this.m_shadowMapProgram;
        let glp = program.Program;

        gl.useProgram(program.Program);

        gl.uniformBlockBinding(glp,this.m_blockIndexPerCam,pipe.ubufferIndex_PerCam);
        gl.uniformBlockBinding(glp,this.m_blockIndexPerObj,pipe.ubufferIndex_PerObj);

        //light mtx
        let camera = scene.camera;
        let f = camera.far;
        let lightMtxs = this.calCascadeShadowMapLightMtx(light,camera,this.m_shadowConfig);

        let [lightworldMtx,lightProjMtx] = lightMtxs[0];

        let lightMtx = lightProjMtx.mul(lightworldMtx);
        smdata.setLightMtx(lightMtx,0);
        this.pipeline.shadowMapInfo[0].lightMtx = lightMtx;

        let cascades = this.m_shadowConfig.cascade;

        let nodequeue = nodelist.nodeOpaque;

        let size = this.m_smHeight;
        if(cascades == 1){
            this.renderShadowCascade(glmath.vec4(0,0,size,size),nodequeue,lightMtxs[0]);
        }
        else if(cascades == 2){
            this.renderShadowCascade(glmath.vec4(0,0,size,size),nodequeue,lightMtxs[0]);
            this.renderShadowCascade(glmath.vec4(size,0,size,size),nodequeue,lightMtxs[1]);
        }else{
            this.renderShadowCascade(glmath.vec4(0,0,size,size),nodequeue,lightMtxs[0]);
            this.renderShadowCascade(glmath.vec4(size,0,size,size),nodequeue,lightMtxs[1]);
            this.renderShadowCascade(glmath.vec4(0,size,size,size),nodequeue,lightMtxs[2]);
            this.renderShadowCascade(glmath.vec4(size,size,size,size),nodequeue,lightMtxs[3]);
        }
        


        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
    }

    private renderShadowCascade(viewport:vec4,nodelist:MeshRender[],mtx:[mat4,mat4]){
        let gl = this.pipeline.GL;

        let camData = this.m_camdata;
        camData.setMtxView(mtx[0]);
        camData.setMtxProj(mtx[1]);
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_cambuffer);
        gl.bufferData(gl.UNIFORM_BUFFER,camData.rawBuffer,gl.DYNAMIC_DRAW);

        gl.viewport(viewport.x,viewport.y,viewport.z,viewport.w);

        let objdata = this.m_objdata;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_objbuffer);

        let queue = nodelist;
        let queueLen = queue.length;
        for(let i=0;i<queueLen;i++){
            let node = queue[i];
            
            if(!node.castShadow) continue;

            let mat = node.material;
            let mesh = node.mesh;
            if(mat == null || mesh == null || mat.program == null) continue;

            if(!mesh.m_bufferInited){
                this.pipeline.refreshMeshBuffer(mesh,mat.program);
            }

            let trs = node.object.transform;

            //modelmatrix
            objdata.setMtxModel(trs.ObjMatrix);
            gl.bufferData(gl.UNIFORM_BUFFER,objdata.rawBuffer,gl.DYNAMIC_DRAW);

            gl.bindVertexArray(mesh.m_vao);
            let drawCount = mesh.m_indicesCount;
            gl.drawElements(gl.TRIANGLES,drawCount,gl.UNSIGNED_SHORT,0);
            gl.bindVertexArray(null);
        }
    }

    private static genShaderShadwoMap():ShaderSource{
        return new ShaderSource(`
        #version 300 es
        precision highp float;
        #include SHADERFX_BASIS
        in vec4 aPosition;
        void main(){
            gl_Position = MATRIX_MVP * aPosition;
        }
        `,`
        #version 300 es
        precision lowp float;
        out vec4 fragColor;
        void main(){
            fragColor = vec4(0,1.0,0,1.0);
        }
        `);
    }
}