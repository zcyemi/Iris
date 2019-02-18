import { BaseRender } from "./BaseRender";
import { GLContext, GLVertexArray } from "../gl";
import { Material } from "./Material";
import { GraphicsRender } from "./GraphicsRender";
import { DynamicMesh } from "./DynamicMesh";
import { MeshBuilder } from "./MeshBuilder";
import { MeshTopology, Mesh } from "./Mesh";
import { vec3, vec4 } from "../math";
import { RenderModel } from "../pipeline";
import { MeshRender } from "./MeshRender";


export class UIRender extends BaseRender {

    private m_mesh:Mesh;
    private m_vao:GLVertexArray;
    public constructor(grender:GraphicsRender){
        super();

        this.material = new Material(grender.shaderLib.shaderRect);
        let meshbuilder = new MeshBuilder(MeshTopology.Triangles);
        meshbuilder.addRect(new vec4([50,100,100,50]),-0.9);
        meshbuilder.addRect(new vec4([43,144,43,75]),0);

        this.m_mesh = meshbuilder.genMesh();
        console.log(this.m_mesh);
    }

    public refreshData(glctx: GLContext){
        let mesh =this.m_mesh;
        let mat = this.material;
        if(mat == null || mat.program == null){
            throw new Error("material or program is null");
        }

        let vao = this.m_vao;
        if(vao == null){
            this.m_vao = MeshRender.CreateVertexArrayObj(glctx,mesh,mat.program);
        }
    } 
    public release(glctx: GLContext){
        this.material = null;
    }
    public draw(gl: GLContext,model:RenderModel){
        const mesh = this.m_mesh;
        if(mesh == null)  return;
        this.refreshData(gl);


        let glp = this.material.program;
        gl.useGLProgram(glp);
        this.material.apply(gl);
        model.bindDefaultUniform(glp);
        let vao = this.m_vao;
        gl.bindGLVertexArray(vao);
        gl.drawElementIndices(mesh.indiceDesc);
        gl.bindGLVertexArray(null);
    }


}