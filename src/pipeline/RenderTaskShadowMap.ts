import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { Light, LightType } from "../Light";
import { GLContext, GLProgram, mat4, glmath } from "wglut";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { Camera } from "../Camera";
import { ShaderSource } from "../shaderfx/ShaderSource";
import { Shader } from "../shaderfx/Shader";
import { ShaderDataUniformCam, ShaderDataUniformObj } from "../shaderfx/ShaderFXLibs";

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

    private m_debugColor:boolean = false;

    public m_shadowMapSize:number = 1024;

    public init(){
        
        let pipe = this.pipeline;
        let gl =pipe.GL;
        let glctx = pipe.GLCtx;

        //uniformbuffer
        this.m_camdata =new ShaderDataUniformCam();
        this.m_objdata = new ShaderDataUniformObj();

        this.m_cambuffer = pipe.sharedBufferPerCam;
        this.m_objbuffer = pipe.sharedBufferPerObj;
        

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

        let glp = this.m_shadowMapProgram.Program;
        this.m_blockIndexPerCam = gl.getUniformBlockIndex(glp,ShaderFX.UNIFORM_CAM);
        this.m_blockIndexPerObj = gl.getUniformBlockIndex(glp,ShaderFX.UNIFORM_OBJ);


        let size =this.m_shadowMapSize;

        //depth texture
        let deptex = gl.createTexture();
        this.m_shadowMapTex = deptex;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D,deptex);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texStorage2D(gl.TEXTURE_2D,1,gl.DEPTH_COMPONENT16,size,size);
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

            gl.texStorage2D(gl.TEXTURE_2D,1,gl.RGBA8,size,size);
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
        gl.bindBuffer(gl.DRAW_FRAMEBUFFER,null);

        this.m_inited = true;
    }

    public release(glctx:GLContext){
 
        let pipeline = this.pipeline;
        let gl = pipeline.GL;
        
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
    }

    private calShadowMapCamMtx(light:Light,camera:Camera):mat4{
        let ctrs = camera.transform;
        let tarPos = ctrs.position.addToRef(ctrs.forward.normalize().mul(camera.far *0.5));
        let lightdir = light.direction.mulToRef(-1.0);
        let lightPos = tarPos.add(lightdir.mulToRef(camera.far));
        //TODO tem fix LightDir parall with ve3.up
        return mat4.coordLHS(lightPos,lightdir,glmath.vec3(0,1,0.1));
    }

    private renderShadowMap(light:Light,scene:Scene,nodelist:RenderNodeList){
        //Temp: only support directional light currently.
        if(light.lightType != LightType.direction) return;

        let gl = this.pipeline.GL;
        let pipe = this.pipeline;

        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,this.m_shadowMapFrameBuffer);

        //clear depth
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.ALWAYS);
        gl.clearDepth(0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        let size = this.m_shadowMapSize;

        gl.viewport(0,0,size,size);

        let program = this.m_shadowMapProgram;
        let glp = program.Program;

        gl.useProgram(program.Program);

        gl.uniformBlockBinding(glp,this.m_blockIndexPerCam,pipe.ubufferIndex_PerCam);
        gl.uniformBlockBinding(glp,this.m_blockIndexPerObj,pipe.ubufferIndex_PerObj);

        //light mtx
        let camera = scene.camera;
        let f = camera.far;
        let lightworldMtx = this.calShadowMapCamMtx(light,scene.camera);
        let projMtx = mat4.orthographic(f,f,0.01,f *2.0);
        let lightMtx = projMtx.mul(lightworldMtx);
        this.pipeline.shadowMapInfo[0].lightMtx = lightMtx;

        //uniform camera
        let camData = this.m_camdata;
        camData.setMtxView(lightworldMtx);
        camData.setMtxProj(projMtx);
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_cambuffer);
        gl.bufferData(gl.UNIFORM_BUFFER,camData.rawBuffer,gl.STATIC_DRAW);


        //uniform obj
        let objdata =this.m_objdata;
        gl.bindBuffer(gl.UNIFORM_BUFFER,this.m_objbuffer);

        let queue = nodelist.nodeOpaque;
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
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);
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