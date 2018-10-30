import { PipelineBase } from "../pipeline/PipelineBase";
import { ShaderTags, Comparison, CullingMode, Shader } from "../shaderfx/Shader";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { GLProgram, vec3, glmath } from "wglut";
import { ShaderDataUniformObj, ShaderDataUniformLight } from "../shaderfx/ShaderFXLibs";
import { BufferDebugInfo } from "./BufferDebugInfo";
import { RenderPass } from "./RenderPass";
import { ShaderFX } from "../shaderfx/ShaderFX";

/**
 * Pre-rendering Depth Pass
 */
export class PassDepth extends RenderPass{

    private m_tags:ShaderTags;
    private m_program:GLProgram;
    private m_bufferDebugInfo:BufferDebugInfo;

    public constructor(pipeline:PipelineBase){
        super(pipeline);

        let deftags = new ShaderTags();
        deftags.blendOp = null;
        deftags.blend = false;
        deftags.zwrite = true;
        deftags.ztest = Comparison.LEQUAL;
        deftags.culling = CullingMode.Back;
        deftags.fillDefaultVal();
        this.m_tags =deftags;

        let shader = pipeline.graphicRender.shaderLib.shaderDepth;
        this.m_program = shader.defaultProgram;

        //debug depth texture
        let debuginfo = new BufferDebugInfo(pipeline.mainDepthTexture,glmath.vec4(0,0,200,200));
        this.m_bufferDebugInfo = debuginfo;
        pipeline.addBufferDebugInfo(debuginfo);
    }
    public render(scene?:Scene){
        const CLASS = PipelineBase;

        const pipe = this.pipeline;
        const gl = pipe.GL;
        const glctx = pipe.GLCtx;
        const deftags = this.m_tags;

        const NAME_BASIS = ShaderFX.UNIFORM_BASIS;
        const NAME_OBJ = ShaderFX.UNIFORM_OBJ;

        let cam = scene.mainCamera;

        let queue = pipe.nodeList.nodeOpaque;
        if(queue.length == 0) return;

        //diable color buffer

        gl.colorMask(false,false,false,false);

        //state
        let state =pipe.stateCache;
        state.reset(deftags);

        pipe.activeDefaultTexture();

        //do draw

        let len = queue.length;
        let program = this.m_program;

        let glp = program.Program;
        gl.useProgram(this.m_program.Program);

        let ublock = program.UniformBlock;
        let indexCam = ublock[NAME_BASIS];
        gl.uniformBlockBinding(glp, indexCam, CLASS.UNIFORMINDEX_BASIS);
        let indexObj = ublock[NAME_OBJ];
        gl.uniformBlockBinding(glp, indexObj, CLASS.UNIFORMINDEX_OBJ);

        const dataobj = pipe.shaderDataObj;

        for(let i=0;i<len;i++){
            let node = queue[i];
            let mat = node.material;
            let mesh = node.mesh;

            node.refershVertexArray(glctx);
            dataobj.setMtxModel(node.object.transform.objMatrix);
            pipe.updateUniformBufferObject(dataobj);

            gl.bindVertexArray(node.vertexArrayObj);
            let indicedesc = mesh.indiceDesc;
            gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.type, indicedesc.offset);
            gl.bindVertexArray(null);

            mat.clean(gl);
        }

        gl.colorMask(true,true,true,true);


        //copy depth buffer to seperated depth texture

        let mainfb = pipe.mainFrameBuffer;
        
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER,mainfb.frambuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,pipe.mainDepthFrameBuffer);


        let w = mainfb.width;
        let h = mainfb.height;
        gl.blitFramebuffer(0,0,w,h,0,0,w,h,gl.DEPTH_BUFFER_BIT,gl.NEAREST);

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER,null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,null);

        pipe.bindTargetFrameBuffer(true);

        this.m_bufferDebugInfo.setTexture(pipe.mainDepthTexture); 

    }
}