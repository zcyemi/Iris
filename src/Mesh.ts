import { vec3, vec4, GLContext, GLTFdata } from "wglut";
import { GL, GLDataType, GLConst } from "./GL";
import { type } from "os";

export enum MeshTopology{
    Triangles,
    TriangleFan,
    TriangleStrip,
    Points,
    Lines,
    LineStrip,
    LineLoop
}

export class MeshVertexAttrDesc{
    public type:GLDataType;
    public size:number;
    public totalbytes:number;
    public offset:number;
    

    /**
     * constructor of MeshVertexAttrDesc
     * @param type
     * @param size 
     * @param bytes total size in bytes
     * @param offset offset in bytes
     */
    public constructor(type:GLDataType,size:number,bytes:number,offset:number = 0){
        this.type = type;
        this.size = size;
        this.totalbytes = bytes;
        this.offset= 0;
    }

    public get length():number{
        return this.size / this.size / MeshBufferUtility.TypeSize(this.type);
    }
}

export class MeshVertexDesc{
    public position : MeshVertexAttrDesc;
    public uv: MeshVertexAttrDesc;
    public normal: MeshVertexAttrDesc;
    public get totalByteSize(){
        return this.position.totalbytes + this.uv.totalbytes + this.normal.totalbytes;
    }
}

export class MeshIndicesDesc{
    public indices: MeshVertexAttrDesc;
    public topology: MeshTopology;
    public indiceCount:number = 0;
}

export type MeshDataBufferIndices = Uint16Array | Uint32Array | Uint8Array;
export type MeshDataBuffer = ArrayBuffer | DataView | Float32Array | Float64Array | Int32Array | Int16Array | Int8Array | Uint16Array | Uint32Array | Uint8Array;

export class Mesh{
    public bufferVertices:WebGLBuffer;
    public bufferIndices:WebGLBuffer;
    public name:string;
    public readonly vertexDesc:MeshVertexDesc = new MeshVertexDesc();
    public readonly indiceDesc:MeshIndicesDesc = new MeshIndicesDesc();

    private static s_quad:Mesh;
    private static s_cube:Mesh;

    private m_dataPosition:MeshDataBuffer;
    private m_dataUV:MeshDataBuffer;
    private m_dataNormal:MeshDataBuffer;
    private m_dataIndices:MeshDataBufferIndices;

    private m_bufferInited:boolean =false;

    public get bufferInited():boolean{
        return this.m_bufferInited;
    }

    public static get Quad():Mesh{
        if(Mesh.s_quad != null) return Mesh.s_quad;
        let quad = new Mesh();
        Mesh.s_quad =quad;

        let dataPosition = new Float32Array([
            -0.5,-0.5,0,1,
            0.5,-0.5,0,1,
            -0.5,0.5,0,1,
            0.5,0.5,0,1
        ]);
        let dataIndices = new Uint16Array([
            0,1,2,
            1,3,2
        ]);
        let dataUV =new Float32Array([
            0.0,1.0,
            1.0,1.0,
            0.0,0.0,
            1.0,0.0
        ]);

        quad.m_dataPosition = dataPosition;
        quad.m_dataUV = dataUV;
        quad.m_dataIndices = dataIndices;
        quad.name = "quad";
        let vertexdesc = quad.vertexDesc;
        vertexdesc.position= new MeshVertexAttrDesc(GL.FLOAT,4,dataPosition.length*4);
        vertexdesc.uv = new MeshVertexAttrDesc(GL.FLOAT,2,dataUV.length*4);
        let indicedesc = quad.indiceDesc;
        indicedesc.topology = MeshTopology.Triangles;
        indicedesc.indices = new MeshVertexAttrDesc(GL.UNSIGNED_SHORT,1,dataIndices.byteLength,0);
        indicedesc.indiceCount = dataIndices.length;

        quad.calculateNormal();
        return quad;
    }

    public static get Cube():Mesh{
        if(Mesh.s_cube != null) return Mesh.s_cube;

        let cube = new Mesh();
        Mesh.s_cube = cube;

        let dataPosition = new Float32Array([
            -1, 1, 1, 1,
            1, 1, 1, 1,
            -1, -1, 1, 1,
            1, -1, 1, 1,

            1, 1, 1, 1,
            1, 1, -1, 1,
            1, -1, 1, 1,
            1, -1, -1, 1,

            1, 1, -1, 1,
            -1, 1, -1, 1,
            1, -1, -1, 1,
            -1, -1, -1, 1,

            -1, 1, -1, 1,
            -1, 1, 1, 1,
            -1, -1, -1, 1,
            -1, -1, 1, 1,

            - 1, 1, -1, 1,
            1, 1, -1, 1,
            -1, 1, 1, 1,
            1, 1, 1, 1,

            -1, -1, 1, 1,
            1, -1, 1, 1,
            -1, -1, -1, 1,
            1, -1, -1, 1,
        ]);
        let dataUV = new Float32Array(48);
        for(var i=0;i<6;i++){
            dataUV.set([0,1,1,1,0,0,1,0],i*8);
        }

        let dataIndices:number[]= [];
        for(let i=0;i<6;i++){
            let k = i*4;
            dataIndices.push(k,k+1,k+2,k+1,k+3,k+2);
        }

        cube.m_dataIndices = new Uint16Array(dataIndices);
        cube.m_dataPosition = dataPosition;
        cube.m_dataUV =dataUV;
        cube.name = "cube";

        let vertexdesc = cube.vertexDesc;
        vertexdesc.position = new MeshVertexAttrDesc(GL.FLOAT,4,dataPosition.length *4);
        vertexdesc.uv = new MeshVertexAttrDesc(GL.FLOAT,2,dataUV.length*4);

        let indicedesc = cube.indiceDesc;
        indicedesc.topology = MeshTopology.Triangles;
        indicedesc.indices = new MeshVertexAttrDesc(GL.UNSIGNED_SHORT,1,dataIndices.length *2,0);
        indicedesc.indiceCount = dataIndices.length;

        cube.calculateNormal();
        return cube;
    }

    public calculateNormal(){

        if(this.indiceDesc.topology != MeshTopology.Triangles){
            console.warn(`${MeshTopology[this.indiceDesc.topology]} is not supported.`);
            return;
        }

        let normal = this.m_dataNormal;
        let position = this.m_dataPosition;
        if(position == null){
            console.warn('vertices position is needed for normal calculation.');
            return;
        }
        let indics = this.m_dataIndices;
        if(indics == null){
            console.warn('indices data is needed for normal calculation.');
            return;
        }

        let positionattr = this.vertexDesc.position;
        let floatLength = positionattr.totalbytes / MeshBufferUtility.TypeSize(positionattr.type);
        let normaldata = new Float32Array(floatLength);
        let verticesLen =floatLength / positionattr.size;
        let normalVec:vec3[] = new Array<vec3>(verticesLen);
        let normalAcc:Uint16Array = new Uint16Array(verticesLen);
        let tricount = indics.length /3;

        for(let i=0;i<tricount;i++){
            let off = i*3;
            let i1 = indics[off];
            let i2 = indics[off+1]
            let i3 = indics[off+2];

            let i1v = i1 *4;
            let i2v = i2 *4;
            let i3v = i3 *4;
            let v1 = new vec3([position[i1v],position[i1v+1],position[i1v+2]]);
            let v2 = new vec3([position[i2v],position[i2v+1],position[i2v+2]]);
            let v3 = new vec3([position[i3v],position[i3v+1],position[i3v+2]]);

            let n = vec3.Cross(v1.sub(v2),v3.sub(v2)).normalize;
            normalAcc[i1]++;
            if(normalVec[i1] == null)normalVec[i1] = vec3.zero;
            normalVec[i1].add(n);

            normalAcc[i2]++;
            if(normalVec[i2] == null)normalVec[i2] = vec3.zero;
            normalVec[i2].add(n);

            normalAcc[i3]++;
            if(normalVec[i3] == null)normalVec[i3] = vec3.zero;
            normalVec[i3].add(n);
        }

        for(let i=0;i<verticesLen;i++){
            let v = normalVec[i].div(normalAcc[i]).raw;
            normaldata.set([v[0],v[1],v[2],0],i*4);
        }

        this.m_dataNormal = normaldata;
        this.vertexDesc.normal = new MeshVertexAttrDesc(GL.FLOAT,4,normaldata.length *4);
    }

    public refreshMeshBuffer(glctx:GLContext){
        if(this.m_bufferInited) return;

        let gl = glctx.gl;
        let buffervert = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER,buffervert);
        this.bufferVertices = buffervert;

        let dataTotalSize = this.vertexDesc.totalByteSize;
        let totalData = new ArrayBuffer(dataTotalSize);

        let totalDataView= new DataView(totalData,0,dataTotalSize);


        let offset = 0;
        let vertexDesc = this.vertexDesc;


        if (this.m_dataPosition != null) {
            vertexDesc.position.offset = offset;
            offset = MeshBufferUtility.copyBuffer(totalDataView,this.m_dataPosition,offset);
        }
        if (this.m_dataUV != null) {
            vertexDesc.uv.offset = offset;
            offset = MeshBufferUtility.copyBuffer(totalDataView,this.m_dataUV,offset);
        }
        if (this.m_dataNormal != null) {
            vertexDesc.normal.offset= offset;
            offset = MeshBufferUtility.copyBuffer(totalDataView,this.m_dataNormal,offset);
        }
        gl.bufferData(gl.ARRAY_BUFFER,totalData,gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);

        //Indices
        let dataIndices = this.m_dataIndices;
        let hasIndices = dataIndices != null && dataIndices.length !=0;
        if(hasIndices){
            let bufferIndices = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,bufferIndices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,dataIndices,gl.STATIC_DRAW);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

            this.bufferIndices = bufferIndices;
        }
        this.m_bufferInited = true;
    }
}


class MeshBufferUtility{
    /**
     * 
     * @param target 
     * @param buffer 
     * @param offsetInByte 
     * @returns endpos in byte
     */
    public static copyBuffer(target:DataView,buffer:MeshDataBuffer,offsetInByte:number):number{
        let offset = offsetInByte;
        if(buffer instanceof DataView){
            let sourceView= new Uint8Array(buffer.buffer,0,buffer.byteLength);
            for(let i=0,len = sourceView.byteLength;i<len;i++){
                target.setUint8(offset,sourceView[i]);
                offset++;
            }
            return offset;
        }
        else if(buffer instanceof ArrayBuffer){
            let sourceView= new Uint8Array(buffer,0,buffer.byteLength);
            for(let i=0,len = sourceView.byteLength;i<len;i++){
                target.setUint8(offset,sourceView[i]);
                offset++;
            }
            return offset;
        }
        else if(buffer instanceof Float32Array){
            for(let i=0,len = buffer.length;i< len;i++){
                target.setFloat32(offset,buffer[i],true);
                offset +=4;
            }
            return offset;
        }else if(buffer instanceof Uint16Array){
            for(let i=0,len = buffer.length;i< len;i++){
                target.setUint16(offset,buffer[i]);
                offset +=2;
            }
            return offset;
        }
        else{
            throw new Error('not implemented');
        }

        return 0;
    }

    public static TypeSize(type:GLDataType):number{

        if(type == GLConst.FLOAT || type == GLConst.UNSIGNED_INT){
            return 4;
        }
        if(type == GLConst.SHORT || type == GLConst.UNSIGNED_SHORT){
            return 2;
        }
        if(type == GLConst.BYTE || type == GLConst.UNSIGNED_BYTE){
            return 1;
        }
        return 0;
    }
}