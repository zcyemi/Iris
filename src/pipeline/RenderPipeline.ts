import { Scene } from "../Scene";
import { DoubleBuffered } from "../collection/DoubleBuffered";
import { RenderNodeList } from "../RenderNodeList";
import { PipelineUtility } from "./PipelineUtility";
import { type } from "os";
import { Mesh } from "../Mesh";
import { Material } from "../Material";
import { mat4 } from "../math/GLMath";
import { RenderModel } from "./RenderModel";
import { MeshRender } from "../MeshRender";
import { IRenderPipeline } from "./IRenderPipeline";
import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "../gl/GLContext";


/**
 * @todo
 * dependencies
 * @class <GLFramebuffer>
 * @class <RenderTexture>
 * 
 */
export class RenderPipeline implements IRenderPipeline{

    protected m_nodelist:DoubleBuffered<RenderNodeList>;
    protected m_model:RenderModel;

    public get graphicRender():GraphicsRender{
        return null;
    }
    public set graphicRender(val:GraphicsRender){

    }

    private m_gl:WebGL2RenderingContext;

    public onSetupRender(glctx:GLContext,info:GraphicsRenderCreateInfo){
        this.m_nodelist = new DoubleBuffered(new RenderNodeList(),new RenderNodeList());
        this.m_gl = glctx.gl;
    }

    public resizeFrameBuffer(){

    }

    public onTraversalNodes(data:any){
        if(data == null || !(data instanceof Scene)) return;
        const nodelist = this.m_nodelist;
        nodelist.swap();
        PipelineUtility.generateDrawList(data,nodelist.front);
    }

    public exec(data:any){
        if(data == null) return;
        this.onTraversalNodes(data);
    }

    public onRenderToCanvas(){

    }

    public reload(){

    }

    public release(){

    }


    public drawMeshWithMat(mesh:Mesh,mat:Material,vao:WebGLVertexArrayObject,objmtx?:mat4){
        const gl = this.m_gl;
        const model =this.m_model;
        const program = mat.program;
        gl.useProgram(program);
        model.bindUniform(program);
        mat.apply(gl);
        model.updateUniformMtx(objmtx);
        gl.bindVertexArray(vao);
        let ind = mesh.indiceDesc;
        gl.drawElements(ind.topology,ind.indiceCount,ind.type,ind.offset);
        gl.bindVertexArray(null);
        mat.clean(gl);
    }

    public drawMeshRender(meshrender:MeshRender,objmtx?:mat4){
        const gl = this.m_gl;
        const model =this.m_model;
        const mesh = meshrender.mesh;
        const mat = meshrender.material;
        const program = mat.program;
        gl.useProgram(program);
        model.bindUniform(program);
        mat.apply(gl);
        model.updateUniformRender(meshrender);

        meshrender.bindVertexArray(gl);
        let ind = mesh.indiceDesc;
        gl.drawElements(ind.topology,ind.indiceCount,ind.type,ind.offset);
        meshrender.unbindVertexArray(gl);
        mat.clean(gl);
    }

    /**
     * @todo
     */
    public drawFullscreenTex(){

    }

}
