import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { GLContext, GLProgram } from "wglut";
import { Scene } from "../Scene";
import { ShaderFX } from "../shaderfx/ShaderFX";
import { Light } from "../Light";
import { AmbientType } from "../Camera";
import { ShaderDataUniformLight, ShaderDataUniformObj, ShaderDataUniformCam } from "../shaderfx/ShaderFXLibs";

export class RenderTaskForwardShading extends RenderTask {
    private m_lightUniformBuffer: WebGLBuffer;
    private m_lightShaderData: ShaderDataUniformLight;
    private m_perObjUniformBuffer: WebGLBuffer;
    private m_perObjShaderData: ShaderDataUniformObj;
    private m_perCamUniformBuffer: WebGLBuffer;
    private m_perCamShaderData: ShaderDataUniformCam;

    private m_forceLightDataUpdate:boolean = false;

    public init() {
        if(this.m_inited) return;

        let pipe = this.pipeline;
        let gl = pipe.GL;
        let glctx = pipe.GLCtx;

        //uniform camera
        if (this.m_perCamUniformBuffer == null) this.m_perCamUniformBuffer = pipe.sharedBufferPerCam;
        if (this.m_perObjShaderData == null) this.m_perCamShaderData = new ShaderDataUniformCam();

        //uniform perobj
        if (this.m_perObjUniformBuffer == null) this.m_perObjUniformBuffer = pipe.sharedBufferPerObj;
        if (this.m_perObjShaderData == null) this.m_perObjShaderData = new ShaderDataUniformObj();

        //uniform light
        if (this.m_lightUniformBuffer == null) {
            let lightbuffer = gl.createBuffer();
            gl.bindBuffer(gl.UNIFORM_BUFFER, lightbuffer);
            gl.bindBufferBase(gl.UNIFORM_BUFFER, pipe.ubufferIndex_Light, lightbuffer);
            this.m_lightUniformBuffer = lightbuffer;
        }
        if (this.m_lightShaderData == null) {
            this.m_lightShaderData = new ShaderDataUniformLight();
        }

        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
        console.log("[init RenderTaskForwardShading done!]");
        this.m_inited = true;
    }

    private static readonly LIGHT_COUNT_MAX: number = 4;
    /**
     * vec4 vec4 LightData[4] 8*4
     * vec4 AmbientColor 4
     */
    private static readonly LIGHT_UNIFORM_EXTRA_SIZE: number = 4;
    //LightData 8
    // POS_TYPE float3 float
    // COLOR_INTENSITY float3 float
    private updateLightBufferData(scene: Scene, gl: WebGL2RenderingContext) {
        const max = RenderTaskForwardShading.LIGHT_COUNT_MAX;

        let lights = scene.lights;
        let lightcount = lights.length;
        let dataDirty = false;
        let lightdata = this.m_lightShaderData;

        //lights
        if (lightcount != 0) {
            let lightDirty = false;
            for (let i = 0; i < lightcount; i++) {
                if (lights[i].isDirty) {
                    lightDirty = true;
                    break;
                }
            }

            if(this.m_forceLightDataUpdate){
                lightDirty = true;
                this.m_forceLightDataUpdate = false;
            }

            if (lightDirty) {
                for (let i = 0; i < max; i++) {
                    let offset = i * 8;
                    if (i < lightcount) {
                        let light = lights[i];
                        light.isDirty = false;
                        let lpos = light.lightPosData;
                        let lcolor = light.lightColor;
                        lightdata.setFloatArray(offset, [lpos.x, lpos.y, lpos.z, light.lightType, lcolor.x, lcolor.y, lcolor.z, light.intensity]);
                    }
                    else {
                        lightdata.fill(offset, 0, 8);
                    }
                }
                dataDirty = true;
            }
        }

        //ambient
        let camera = scene.camera;
        if (camera.ambientDataDirty) {
            dataDirty = true;
            const ambientDataOffset = RenderTaskForwardShading.LIGHT_UNIFORM_EXTRA_SIZE * 8;

            let finalAmbientColor = camera.ambientType == AmbientType.AmbientColor ? camera.ambientColor : camera.background;
            lightdata.setVec4(ambientDataOffset, finalAmbientColor);
            camera.ambientDataDirty = false;
        }

        if (dataDirty) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_lightUniformBuffer);
            gl.bufferData(gl.UNIFORM_BUFFER, lightdata.rawBuffer, gl.STATIC_DRAW);
        }
    }

    public render(nodelist: RenderNodeList, scene: Scene, glctx: GLContext) {

        let camera = scene.camera;
        if (camera == null) return;
        camera.aspect = this.pipeline.mainFrameBufferAspect;

        let queue = nodelist.nodeOpaque;
        if (queue.length == 0) return;

        let gl = glctx.gl;

        let pipeline = this.pipeline;
        pipeline.bindTargetFrameBuffer();

        //clean
        let clearColor = camera.background;
        gl.clearColor(clearColor.x, clearColor.y, clearColor.z, clearColor.w);
        gl.clearDepth(1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        //setup draw state
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.CULL_FACE);
        gl.frontFace(gl.CCW);
        gl.cullFace(gl.BACK);

        //light uniform buffer
        this.updateLightBufferData(scene, gl);

        //camera uniform buffer
        {
            let mtxv = camera.WorldMatrix;
            let mtxp = camera.ProjMatrix;
            let camobj = this.m_perCamShaderData;
            camobj.setMtxView(mtxv);
            camobj.setMtxProj(mtxp);
            gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_perCamUniformBuffer);
            gl.bufferData(gl.UNIFORM_BUFFER, camobj.rawBuffer, gl.DYNAMIC_DRAW);
        }

        //shadowmap
        gl.activeTexture(pipeline.utex_sm[0]);
        gl.bindTexture(gl.TEXTURE_2D, pipeline.shadowMapInfo[0].texture);

        //draw
        let len = queue.length;
        let curprogram: GLProgram = null;

        for (let i = 0; i < len; i++) {
            let node = queue[i];
            let mat = node.material;
            let mesh = node.mesh;
            let program = mat.program;

            //mesh

            node.refershVertexArray(glctx);

            //program
            if (program != curprogram) {

                let glp = program.Program;
                gl.useProgram(glp);

                let ublock = program.UniformBlock;

                //cam uniform buffer
                let indexCam = ublock[ShaderDataUniformCam.UNIFORM_CAM];
                if (indexCam != null) gl.uniformBlockBinding(glp, indexCam, pipeline.ubufferIndex_PerCam);

                //obj uniform buffer
                let indexObj = ublock[ShaderDataUniformObj.UNIFORM_OBJ];
                if (indexObj != null) gl.uniformBlockBinding(glp, indexObj, pipeline.ubufferIndex_PerObj);

                //light uniform buffer
                let indexLight = ublock[ShaderDataUniformLight.LIGHT];
                if (indexLight != null) gl.uniformBlockBinding(glp, indexLight, pipeline.ubufferIndex_Light);
                curprogram = program;

                //sm uniform buffer
                let indexSM = ublock[ShaderFX.UNIFORM_SHADOWMAP];
                if (indexSM != null) {
                    gl.uniformBlockBinding(glp, indexSM, pipeline.ubufferIndex_ShadowMap);
                    let loc = program.Uniforms['uShadowMap'];
                    if (loc != null) gl.uniform1i(loc, pipeline.utex_sm_slot[0]);
                }
            }

            //uniforms
            mat.apply(gl);

            //perobject uniform buffer
            {
                let objdata = this.m_perObjShaderData;
                let trs = node.object.transform;
                objdata.setMtxModel(trs.ObjMatrix);
                gl.bindBuffer(gl.UNIFORM_BUFFER, this.m_perObjUniformBuffer);
                gl.bufferData(gl.UNIFORM_BUFFER, objdata.rawBuffer, gl.DYNAMIC_DRAW);
            }

            gl.bindVertexArray(node.vertexArrayObj);
            let drawCount = mesh.m_indicesCount;
            gl.drawElements(gl.TRIANGLES, drawCount, gl.UNSIGNED_SHORT, 0);
            gl.bindVertexArray(null);

            mat.clean(gl);
        }
        gl.bindBuffer(gl.UNIFORM_BUFFER, null);
    }

    public release(glctx: GLContext) {
        if(!this.m_inited) return;
        this.m_inited = false;

        this.m_perCamUniformBuffer = null;
        this.m_perObjUniformBuffer = null;

        let gl = glctx.gl;

        let lightuniformBuffer = this.m_lightUniformBuffer;
        if(lightuniformBuffer !=null){
            gl.bindBufferBase(gl.UNIFORM_BUFFER,this.pipeline.ubufferIndex_Light,null);
            gl.deleteBuffer(lightuniformBuffer);
            this.m_lightUniformBuffer=  null;
            this.m_forceLightDataUpdate = true;
        }
    }

    public reload(glctx: GLContext) {
        this.release(glctx);
        this.init();
        console.log('[reload RenderTaskForwardShading done!]');
    }
}