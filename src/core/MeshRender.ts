import { GL, GLContext, GLProgram, GLVertexArray } from "../gl/index";
import { BaseRender } from "./BaseRender";
import { GameObject } from "./GameObject";
import { Material } from "./Material";
import { Mesh } from "./Mesh";
import { AttrSemantic } from "./ShaderFX";
import { GraphicsContext } from "./GraphicsContext";

export class MeshRender extends BaseRender {
    public mesh: Mesh;
    public object: GameObject;

    public _depthVal: number;

    private m_dynamic: boolean = false;
    private m_vao: GLVertexArray;
    private m_vaoProgamId: number = -1;

    public get dynamic(): boolean {
        return this.m_dynamic;
    }

    /**
     * @param mesh 
     * @param mat 
     * @param dynamic dynamic meshRender will not generate VertexArrayObject
     */
    public constructor(mesh?: Mesh, mat?: Material, dynamic: boolean = false) {
        super();
        this.mesh = mesh;
        this.material = mat;
        this.castShadow = true;
        this.m_dynamic = dynamic;
    }


    public release(glctx: GLContext) {
        if (this.m_vao != null) {
            glctx.deleteGLVertexArray(this.m_vao);
            this.m_vao = null;
        }

        this.mesh = null;
    }

    public draw(gl: GLContext) {
        let mesh = this.mesh;
        const desc = mesh.indiceDesc;
        gl.drawElements(desc.topology, desc.indiceCount, desc.type, desc.offset);
    }

    public refreshData() {

        let glctx = GraphicsContext.glctx;
        let mesh = this.mesh;
        let mat = this.material;
        if (mat == null || mat.program == null) {
            throw new Error("material or program is null");
        }

        if (this.m_dynamic) {
            if (!mesh.bufferInited) {
                mesh.refreshMeshBuffer(glctx);
            }
        }
        else {
            let vao = this.m_vao;
            if (vao != null) {
                let curid = mat.program.id;
                if (curid == this.m_vaoProgamId) return;
                glctx.deleteVertexArray(this.m_vao);
                this.m_vaoProgamId = -1;
            }

            this.m_vao = MeshRender.CreateVertexArrayObj(glctx, mesh, mat.program);
            this.m_vaoProgamId = mat.program.id;
        }
    }

    /**
     * Bind meshbuffers
     * dynamic meshrender: bindBuffer
     * static meshrender: bindVertexArray
     * @param glctx 
     */
    public bindVertexArray(glctx: GLContext) {
        if (this.m_dynamic) {
            MeshRender.bindBuffers(glctx, this.mesh, this.material.program);
        }
        else {
            glctx.bindGLVertexArray(this.m_vao);
        }
    }

    /**
     * Unbind meshbuffers
     * dynamic meshrender: unbindBuffer
     * static meshrender: unbindVertexArray
     * @param glctx
     */
    public unbindVertexArray(glctx: GLContext, unbindBuffer: boolean = true) {
        if (this.m_dynamic) {
            if (unbindBuffer) {
                glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
                glctx.bindBuffer(GL.ARRAY_BUFFER, null);
            }
        }
        else {
            glctx.bindVertexArray(null);
        }
    }

    /**
     * @todo buffer binding
     * @param glctx 
     * @param mesh 
     * @param program 
     */
    private static bindBuffers(glctx: GLContext, mesh: Mesh, program: GLProgram) {
        const vertdesc = mesh.vertexDesc;
        const attrs = program.Attributes;

        if (mesh.seperatedBuffer) {
            for (const attr in vertdesc) {
                if (vertdesc.hasOwnProperty(attr)) {
                    const desc = vertdesc[attr];
                    if (desc != null && AttrSemantic[attr] == null) continue;
                    let programAttr = attrs[attr];
                    if (programAttr != null) {
                        glctx.bindBuffer(GL.ARRAY_BUFFER, mesh.bufferVertices);
                        glctx.vertexAttribPointer(programAttr, desc.size, GL.FLOAT, false, desc.size * 4, desc.offset);
                        glctx.enableVertexAttribArray(programAttr);
                    }
                }
            }
            glctx.bindBuffer(GL.ARRAY_BUFFER, null);
        }
        else {
            glctx.bindBuffer(GL.ARRAY_BUFFER, mesh.bufferVertices);


            console.log(attrs,vertdesc);

            for (const attr in vertdesc) {
                if (vertdesc.hasOwnProperty(attr)) {
                    const desc = vertdesc[attr];

                    if (desc != null && AttrSemantic[attr] == null) continue;
                    let programAttr = attrs[attr];

                    console.log(attr,programAttr);
                    if (programAttr != null) {

                        glctx.vertexAttribPointer(programAttr, desc.size, GL.FLOAT, false, desc.size * 4, desc.offset);
                        glctx.enableVertexAttribArray(programAttr);
                    }
                }
            }
        }

        glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, mesh.bufferIndices);
    }

    public static CreateVertexArrayObj(glctx: GLContext, mesh: Mesh, program: GLProgram): GLVertexArray {
        if (!mesh.bufferInited) {
            mesh.refreshMeshBuffer(glctx);
        }
        if (program == null) throw new Error("program is null");

        let vao = glctx.createGLVertexArray();

        console.log('create vao',mesh);

        glctx.bindGLVertexArray(vao);
        MeshRender.bindBuffers(glctx, mesh, program);
        glctx.bindGLVertexArray(null);

        return vao;
    }
}
