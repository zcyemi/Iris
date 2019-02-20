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

export class TextBuilder{

    public vertexbuffer:IndexedTypedBuffer<Float32Array>;
    public uvbuffer:IndexedTypedBuffer<Float32Array>;

    public constructor(defaultSize:number = 512){
        this.vertexbuffer = new IndexedTypedBuffer(Float32Array,defaultSize);
        this.uvbuffer = new IndexedTypedBuffer(Float32Array,defaultSize);
    }

    public drawTextRect(content:string,rect:vec4){
        this.drawText(content,rect.x,rect.y,rect.z,rect.w);
    }

    public drawText(content:string,x:number,y:number,w:number,h:number){
        if(content == null || content === '') return;

        let len =content.length;

        const vertbuffer = this.vertexbuffer;
        const uvbuffer = this.uvbuffer;
        
        let vertary = vertbuffer.array;
        let vertsize = vertbuffer.size;

        let uvary = uvbuffer.array;
        let uvsize = uvbuffer.size;

        let xbase = x;
        let ybase = y;

        for(let t =0;t<len;t++){
            let c = content.charCodeAt(t);
            
            let g = FontInfo.glyphData[c];
            if(g == null) continue;
        
        
            let x1 = xbase + g.lb;
            let x2 = x1 + g.x2 - g.x1;
            let y1 = ybase - g.y + g.y1;
            let y2 = ybase + g.y2 - g.y;

            if(vertbuffer.checkExten(12)){
                vertary = vertbuffer.array;
            }

            vertary[vertsize] = x1;
            vertary[vertsize+1] = y1;
            vertary[vertsize+2] = 0;

            vertary[vertsize+3] = x2;
            vertary[vertsize+4] = y1;
            vertary[vertsize+5] = 0;

            vertary[vertsize+6] = x2;
            vertary[vertsize+7] = y2;
            vertary[vertsize+8] = 0;

            vertary[vertsize+9] = x1;
            vertary[vertsize+10] = y2;
            vertary[vertsize+11] = 0;

            if(uvbuffer.checkExten(8)){
                uvary = uvbuffer.array;
            }

            let u1 = g.x1 / 128.0;
            let u2 = g.x2 / 128.0;
            let v1 = g.y1 / 128.0;
            let v2 = g.y2 / 128.0;
            

            uvary[uvsize] = u1;
            uvary[uvsize+1] = v1;

            uvary[uvsize+2] = u2;
            uvary[uvsize+3] = v1;

            uvary[uvsize+4] = u2;
            uvary[uvsize+5] = v2;

            uvary[uvsize+6] = u1;
            uvary[uvsize+7] = v2;

            uvsize +=8;

            vertsize+=12;

            xbase = x2 + g.rb;
            
        }

        vertbuffer.size= vertsize;
    }
}

export class UIRender extends BaseRender {

    private m_mesh:Mesh;
    private m_vao:GLVertexArray;

    private m_textBuilder:TextBuilder;
    private m_textmesh:DynamicMesh;
    private m_texvao:GLVertexArray;

    private m_matText:Material;


    public constructor(grender:GraphicsRender){
        super();

        this.material = new Material(grender.shaderLib.shaderRect);
        let meshbuilder = new MeshBuilder(MeshTopology.Triangles);
        meshbuilder.addRect(new vec4([50,100,200,50]),-0.9);
        meshbuilder.addRect(new vec4([43,144,43,75]),0);
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