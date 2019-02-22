import { BaseRender } from "./BaseRender";
import { GLContext, GLVertexArray, GLConst, GL } from "../gl";
import { Material } from "./Material";
import { GraphicsRender } from "./GraphicsRender";
import { DynamicMesh } from "./DynamicMesh";
import { MeshBuilder } from "./MeshBuilder";
import { MeshTopology, Mesh, MeshBufferUtility } from "./Mesh";
import { vec3, vec4 } from "../math";
import { RenderModel } from "../pipeline";
import { MeshRender } from "./MeshRender";
import { FontInfo } from "../misc/FontInfo";
import { IndexedTypedBuffer } from "../collection";
import { Texture2D } from "./Texture2D";
import { ShaderFX } from "../shaderfx";
import { debug } from "util";
import { TextureDescUtility } from "./Texture";
import { TextBuilder } from "../misc/TextBuilder";
import { SpriteBatch } from "../misc/SpriteBatch";
import { Color } from "./Color";



export class UIRender extends BaseRender {

    private m_mesh:Mesh;
    private m_vao:GLVertexArray;

    private m_textBuilder:TextBuilder;
    private m_textmesh:DynamicMesh;
    private m_texvao:GLVertexArray;

    private m_matText:Material;

    private m_sprBatch:SpriteBatch;


    public constructor(grender:GraphicsRender){
        super();

        this.material = new Material(grender.shaderLib.shaderRect);
        let meshbuilder = new MeshBuilder(MeshTopology.Triangles);

        meshbuilder.addRect(new vec4([50,100,200,50]),-0.9);
        meshbuilder.addRect(new vec4([43,144,43,75]),0);

        let batch = new SpriteBatch();
        batch.drawRect([100,100,100,10],Color.YELLOW,0);
        batch.drawRect([200,10,30,100],Color.BLUE,0);

        this.m_mesh = meshbuilder.genMesh();

        let tb = new TextBuilder();
        tb.drawText("Hello_World{#00}",70,120,200,100);

        
        let vsize = tb.vertexbuffer.size;
        let qsize = vsize /12;


        let indiecebuffer = new Uint16Array(qsize *6);
        MeshBufferUtility.IndicesBufferFillQuad(indiecebuffer,qsize);
        
        let dymesh = new DynamicMesh("textmesh");

        dymesh.setPosition(tb.vertexbuffer.array,GLConst.FLOAT,3,vsize *4);
        dymesh.setUV(tb.uvbuffer.array,GLConst.FLOAT,2,vsize /3*2 *4);
        dymesh.setIndices(indiecebuffer,GLConst.UNSIGNED_SHORT,MeshTopology.Triangles);
        dymesh.refreshMeshBuffer(grender.glctx);

        this.m_textmesh = dymesh;

        this.m_matText = new Material(grender.shaderLib.shaderText);

        var tex = Texture2D.createTexture2DImage(FontInfo.image,TextureDescUtility.DefaultRGBA,grender.glctx);
        this.m_matText.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,tex);

        this.m_textBuilder = tb;
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

        let textvao = this.m_texvao;
        if(textvao == null){
            this.m_texvao = MeshRender.CreateVertexArrayObj(glctx,this.m_textmesh,this.m_matText.program);
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

        let mattext = this.m_matText;

        let cursatet  =gl.currentPipelineState;

        gl.pipelineState(mattext.shaderTags);
        glp = mattext.program;
        gl.useGLProgram(glp);
        mattext.apply(gl);
        model.bindDefaultUniform(glp);

        gl.bindGLVertexArray(this.m_texvao);
        gl.drawElementIndices(this.m_textmesh.indiceDesc);
        gl.bindGLVertexArray(null);

        gl.pipelineState(cursatet);
    }
}