import { vec4 } from "../math";
import { IndexedTypedBuffer } from "../collection";
import { float } from "../core/Types";
import { DynamicMesh, MeshDataBufferIndices, MeshBufferUtility, MeshTopology, Mesh, MeshRender, Material, GraphicsRender, Color } from "../core";
import { GLConst, GLContext, GLVertexArray } from "../gl";
import { ShaderFX } from "../core/ShaderFX";

export class SpriteBatch{
    public rectPosBuffer:IndexedTypedBuffer<Float32Array>;
    public rectColorBuffer:IndexedTypedBuffer<Float32Array>;

    private static s_indicesBuffer:Uint16Array;

    private m_isdirty:boolean = true;
    public mesh:DynamicMesh;
    public vao:GLVertexArray;

    private m_matRect:Material;

    public get material():Material{
        return this.m_matRect;
    }

    public constructor(defaultSize:number = 512,grender:GraphicsRender){
        this.rectPosBuffer = new IndexedTypedBuffer(Float32Array,defaultSize);
        this.rectColorBuffer = new IndexedTypedBuffer(Float32Array,defaultSize);

        let indicesArray = new Uint16Array(128*6);
        MeshBufferUtility.IndicesBufferFillQuad(indicesArray,128);
        SpriteBatch.s_indicesBuffer = indicesArray;

        let mesh = new DynamicMesh("spritebatch");

        mesh.setIndices(indicesArray,GLConst.UNSIGNED_SHORT,MeshTopology.Triangles);
        mesh.setPosition(this.rectPosBuffer.array,GLConst.FLOAT,3);
        mesh.setColor(this.rectColorBuffer.array,GLConst.FLOAT,4);
        mesh.refreshMeshBuffer(grender.glctx);

        let mat = this.m_matRect;
        if(mat == null){

            let shader = ShaderFX.findShader("iris","@shaderfx/rect");
            mat = new Material(shader);
            this.m_matRect = mat;
        }

        if(this.vao == null){
            this.vao = MeshRender.CreateVertexArrayObj(grender.glctx,mesh,mat.program);
        }

        this.mesh = mesh;
    }
    

    public refreshData(glctx:GLContext){
        if(!this.m_isdirty) return;
        let mesh = this.mesh;
        
        let posbuffer = this.rectPosBuffer;
        mesh.uploadDataBufferPosition(glctx,posbuffer.array,posbuffer.size *4);
        let colbuffer = this.rectColorBuffer;
        mesh.uploadDataBufferColor(glctx,colbuffer.array,colbuffer.size*4);
        mesh.setIndicesCount(posbuffer.size /8 *6);

        this.m_isdirty = false;
    }

    public drawRect(rect:float[],color:float[],depth:number =0){
        const vertexbuffer = this.rectPosBuffer;
        const colorbuffer= this.rectColorBuffer;

        let varray = vertexbuffer.array;
        let carray = colorbuffer.array;

        let x = rect[0];
        let y = rect[1];
        let x1 = x + rect[2];
        let y1 = y + rect[3];

        varray.set([x,y,depth,x1,y,depth,x1,y1,depth,x,y1,depth],vertexbuffer.size);

        vertexbuffer.size+= 12;

        const col = color;

        let csize = colorbuffer.size;
        for(let t=0;t<4;t++){
            carray.set(col,csize);
            csize +=4;
        }
        colorbuffer.size = csize;

        this.m_isdirty= true;
    }
    public drawRectVec4(rect:vec4,color:vec4,depth:number =0){
        this.drawRect(rect.raw,color.raw,depth);
    }

    public drawSprite(){
        throw new Error("not implemented");
    }
}