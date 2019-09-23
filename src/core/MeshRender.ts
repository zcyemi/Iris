import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GameObject } from "./GameObject";
import { ShaderFX } from "../shaderfx";
import { BaseRender } from "./BaseRender";
import { GLContext,GLProgram,GL,GLVertexArray} from "../gl/index";

export class MeshRender extends BaseRender{
    public mesh:Mesh;
    public object:GameObject;

    public _depthVal:number;

    private m_dynamic:boolean =false;
    private m_vao:GLVertexArray;
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
            glctx.deleteGLVertexArray(this.m_vao);
            this.m_vao = null;
        }

        this.mesh = null;
    }

    public draw(gl:GLContext){
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
            glctx.bindGLVertexArray(this.m_vao);
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

    /**
     * @todo buffer binding
     * @param glctx 
     * @param mesh 
     * @param program 
     */
    private static bindBuffers(glctx:GLContext,mesh:Mesh,program:GLProgram){
        const vertdesc = mesh.vertexDesc;
        const attrs = program.Attributes;

        if(mesh.seperatedBuffer){
            if(vertdesc.position != null){
                let aPos = attrs[ShaderFX.ATTR_aPosition];
                if(aPos != null){
                    glctx.bindBuffer(GL.ARRAY_BUFFER,mesh.bufferVertices);
                    let posdesc = vertdesc.position;
                    glctx.vertexAttribPointer(aPos,posdesc.size,GL.FLOAT,false,posdesc.size *4,posdesc.offset);
                    glctx.enableVertexAttribArray(aPos);
                }
            }
            if(vertdesc.uv !=null){
                let aUV = attrs[ShaderFX.ATTR_aUV];
                if(aUV != null){
                    glctx.bindBuffer(GL.ARRAY_BUFFER,mesh.bufferUV);
                    let uvdesc = vertdesc.uv;
                    glctx.vertexAttribPointer(aUV,uvdesc.size,GL.FLOAT,false,uvdesc.size *4,uvdesc.offset);
                    glctx.enableVertexAttribArray(aUV);
                }
            }
            if(vertdesc.normal){
                let aNorm = attrs[ShaderFX.ATTR_aNormal];
                if(aNorm !=null){
                    glctx.bindBuffer(GL.ARRAY_BUFFER,mesh.bufferNormal)
                    let normdesc = vertdesc.normal;
                    glctx.vertexAttribPointer(aNorm,normdesc.size,GL.FLOAT,false,normdesc.size *4,normdesc.offset);
                    glctx.enableVertexAttribArray(aNorm);
                }
            }
            if(vertdesc.color){
                let aColor = attrs[ShaderFX.ATTR_aColor]
                if(aColor != null){
                    glctx.bindBuffer(GL.ARRAY_BUFFER,mesh.bufferColor);
                    let colordesc = vertdesc.color;
                    glctx.vertexAttribPointer(aColor,colordesc.size,GL.FLOAT,false,colordesc.size*4, colordesc.offset);
                    glctx.enableVertexAttribArray(aColor);
                }
            }
            glctx.bindBuffer(GL.ARRAY_BUFFER,null);
        }
        else{
            glctx.bindBuffer(GL.ARRAY_BUFFER,mesh.bufferVertices);
            if(vertdesc.position !=null){
                let aPos = attrs[ShaderFX.ATTR_aPosition];
                if(aPos !=null){
                    let posdesc = vertdesc.position;
                    glctx.vertexAttribPointer(aPos,posdesc.size,GL.FLOAT,false,posdesc.size *4,posdesc.offset);
                    glctx.enableVertexAttribArray(aPos);
                }
            }
            if(vertdesc.uv !=null){
                let aUV = attrs[ShaderFX.ATTR_aUV];
                if(aUV != null){
                    let uvdesc = vertdesc.uv;
                    glctx.vertexAttribPointer(aUV,uvdesc.size,GL.FLOAT,false,uvdesc.size *4,uvdesc.offset);
                    glctx.enableVertexAttribArray(aUV);
                }
            }
            if(vertdesc.normal){
                let aNorm = attrs[ShaderFX.ATTR_aNormal];
                if(aNorm !=null){
                    let normdesc = vertdesc.normal;
                    glctx.vertexAttribPointer(aNorm,normdesc.size,GL.FLOAT,false,normdesc.size *4,normdesc.offset);
                    glctx.enableVertexAttribArray(aNorm);
                }
            }
        }

        glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,mesh.bufferIndices);
    }

    public static CreateVertexArrayObj(glctx:GLContext,mesh:Mesh,program:GLProgram):GLVertexArray{
        if(!mesh.bufferInited){
            mesh.refreshMeshBuffer(glctx);
        }
        if(program == null) throw new Error("program is null"); 

        let vao = glctx.createGLVertexArray();

        glctx.bindGLVertexArray(vao);
        MeshRender.bindBuffers(glctx,mesh,program);
        glctx.bindGLVertexArray(null);

        return vao;
    }
}


