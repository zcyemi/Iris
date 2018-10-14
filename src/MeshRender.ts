import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GameObject } from "./GameObject";
import { GLContext } from "wglut";
import { ShaderFX } from "./shaderfx/ShaderFX";

export class MeshRender{
    public mesh:Mesh;
    public material:Material;
    public object:GameObject;

    public castShadow:boolean = true;

    private m_vao:WebGLVertexArrayObject;

    public get vertexArrayObj():WebGLVertexArrayObject{
        return this.m_vao;
    }

    public constructor(mesh?:Mesh,mat?:Material){
        this.mesh = mesh;
        this.material = mat;
    }

    public release(glctx:GLContext){
        if(this.m_vao != null){
            glctx.gl.deleteVertexArray(this.m_vao);
            this.m_vao = null;
        }
    }
    
    public refershVertexArray(glctx:GLContext){
        let mesh =this.mesh;
        if(!mesh.bufferInited){
            mesh.refreshMeshBuffer(glctx);
        }

        let vao = this.m_vao;
        if(vao != null) return;

        let mat = this.material;
        if(mat == null) throw new Error("material is null");

        let program = mat.program;
        if(program == null) throw new Error("program is null"); 

        let attrs = program.Attributes;

        let vertdesc = this.mesh.vertexDesc;

        let gl = glctx.gl;
        vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

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

        //indices
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.m_bufferIndices);
        
        gl.bindVertexArray(null);
        this.m_vao= vao;
    }
}


