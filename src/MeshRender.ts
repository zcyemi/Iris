import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GameObject } from "./GameObject";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { BaseRender } from "./BaseRender";
import { GLContext } from "./gl/GLContext";
import { GLProgram } from "./gl/GLProgram";
import { Program } from "estree";
import { GL } from "./gl/GL";

export class MeshRender extends BaseRender{
    public mesh:Mesh;
    public object:GameObject;

    public _depthVal:number;

    private m_dynamic:boolean =false;
    private m_vao:WebGLVertexArrayObject;
    private m_vaoProgamId:number = -1;

    public get dynamic():boolean{
        return this.m_dynamic;
    }

    /**
     * @param mesh 
     * @param mat 
     * @param dynamic dynamic meshRender will not generate VertexArrayObject
     */
    public constructor(mesh?:Mesh,mat?:Material,dynamic:boolean = false){
        super();
        this.mesh = mesh;
        this.material = mat;
        this.castShadow = true;
        this.m_dynamic = dynamic;
    }
    

    public release(glctx:GLContext){
        if(this.m_vao != null){
            glctx.deleteVertexArray(this.m_vao);
            this.m_vao = null;
        }

        this.mesh = null;
    }

    public draw(gl:WebGL2RenderingContext){
        let mesh = this.mesh;
        const desc = mesh.indiceDesc;
        gl.drawElements(desc.topology,desc.indiceCount,desc.type,desc.offset);
    }
    
    public refreshData(glctx:GLContext){
        let mesh =this.mesh;
        let mat = this.material;
        if(mat == null || mat.program == null){
            throw new Error("material or program is null");
        }

        if(this.m_dynamic){
            if(!mesh.bufferInited){
                mesh.refreshMeshBuffer(glctx);
            }
        }
        else{
            let vao = this.m_vao;
            if(vao != null){
                let curid = mat.program.id;
                if(curid == this.m_vaoProgamId) return;
                glctx.deleteVertexArray(this.m_vao);
                this.m_vaoProgamId = -1;
            }
    
            this.m_vao = MeshRender.CreateVertexArrayObj(glctx,mesh,mat.program);
            this.m_vaoProgamId = mat.program.id;
        }
    }

    /**
     * Bind meshbuffers
     * dynamic meshrender: bindBuffer
     * static meshrender: bindVertexArray
     * @param glctx 
     */
    public bindVertexArray(glctx:GLContext){
        if(this.m_dynamic){
            MeshRender.bindBuffers(glctx,this.mesh,this.material.program);
        }
        else{
            glctx.bindVertexArray(this.m_vao);
        }
    }

    /**
     * Unbind meshbuffers
     * dynamic meshrender: unbindBuffer
     * static meshrender: unbindVertexArray
     * @param glctx
     */
    public unbindVertexArray(glctx:GLContext,unbindBuffer:boolean = true){
        if(this.m_dynamic){
            if(unbindBuffer){
                glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,null);
                glctx.bindBuffer(GL.ARRAY_BUFFER,null);
            }
        }
        else{
            glctx.bindVertexArray(null);
        }
    }


    private static bindBuffers(glctx:GLContext,mesh:Mesh,program:GLProgram){
        const vertdesc = mesh.vertexDesc;
        const attrs = program.Attributes;

        const gl = glctx.getWebGLRenderingContext();

        if(mesh.seperatedBuffer){
            if(vertdesc.position != null){
                gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferVertices);
                let aPos = attrs[ShaderFX.ATTR_aPosition];
                if(aPos != null){
                    let posdesc = vertdesc.position;
                    gl.vertexAttribPointer(aPos,posdesc.size,gl.FLOAT,false,posdesc.size *4,posdesc.offset);
                    gl.enableVertexAttribArray(aPos);
                }
            }
            if(vertdesc.uv !=null){
                gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferUV);
                let aUV = attrs[ShaderFX.ATTR_aUV];
                if(aUV != null){
                    let uvdesc = vertdesc.uv;
                    gl.vertexAttribPointer(aUV,uvdesc.size,gl.FLOAT,false,uvdesc.size *4,uvdesc.offset);
                    gl.enableVertexAttribArray(aUV);
                }
            }
            if(vertdesc.normal){
                gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferNormal)
                let aNorm = attrs[ShaderFX.ATTR_aNormal];
                if(aNorm !=null){
                    let normdesc = vertdesc.normal;
                    gl.vertexAttribPointer(aNorm,normdesc.size,gl.FLOAT,false,normdesc.size *4,normdesc.offset);
                    gl.enableVertexAttribArray(aNorm);
                }
            }
            gl.bindBuffer(gl.ARRAY_BUFFER,null);
        }
        else{
            gl.bindBuffer(gl.ARRAY_BUFFER,mesh.bufferVertices);
            if(vertdesc.position !=null){
                let aPos = attrs[ShaderFX.ATTR_aPosition];
                if(aPos !=null){
                    let posdesc = vertdesc.position;
                    gl.vertexAttribPointer(aPos,posdesc.size,gl.FLOAT,false,posdesc.size *4,posdesc.offset);
                    gl.enableVertexAttribArray(aPos);
                }
            }
            if(vertdesc.uv !=null){
                let aUV = attrs[ShaderFX.ATTR_aUV];
                if(aUV != null){
                    let uvdesc = vertdesc.uv;
                    gl.vertexAttribPointer(aUV,uvdesc.size,gl.FLOAT,false,uvdesc.size *4,uvdesc.offset);
                    gl.enableVertexAttribArray(aUV);
                }
            }
    
            if(vertdesc.normal){
                let aNorm = attrs[ShaderFX.ATTR_aNormal];
                if(aNorm !=null){
                    let normdesc = vertdesc.normal;
                    gl.vertexAttribPointer(aNorm,normdesc.size,gl.FLOAT,false,normdesc.size *4,normdesc.offset);
                    gl.enableVertexAttribArray(aNorm);
                }
            }
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.bufferIndices);
    }

    public static CreateVertexArrayObj(glctx:GLContext,mesh:Mesh,program:GLProgram):WebGLVertexArrayObject{
        if(!mesh.bufferInited){
            mesh.refreshMeshBuffer(glctx);
        }
        if(program == null) throw new Error("program is null"); 

        let vao = glctx.createVertexArray();

        glctx.bindVertexArray(vao);
        MeshRender.bindBuffers(glctx,mesh,program);
        glctx.bindVertexArray(null);

        return vao;
    }
}


