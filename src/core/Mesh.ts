import { GL, GLDataType, GLConst } from "../gl/GL";
import { vec3 } from "../math/GLMath";
import { GLContext } from "../gl/GLContext";

export enum MeshTopology{
    Triangles = 4,
    TriangleFan = 6,
    TriangleStrip = 5,
    Points = 0,
    Lines = 1,
    LineStrip = 3,
    LineLoop = 2
}

export class MeshVertexAttrDesc{
    public type:GLDataType;
    /** Component size [1,2,3,4] */
    public size:number;
    public totalbytes:number;
    public offset:number = 0;
    

    /**
     * constructor of MeshVertexAttrDesc
     * @param type data type
     * @param size componsnet length [1,2,3,4]
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
        return this.totalbytes / this.size / MeshBufferUtility.TypeSize(this.type);
    }
}

export class MeshVertexDesc{
    public position : MeshVertexAttrDesc;
    public uv: MeshVertexAttrDesc;
    public normal: MeshVertexAttrDesc;
    public get totalByteSize(){
        let bytes = this.position.totalbytes;
        if(this.uv != null){
            bytes += this.uv.totalbytes;
        }
        if(this.normal != null){
            bytes += this.normal.totalbytes;
        }
        return bytes;
    }
}

export class MeshIndicesDesc{
    public topology: MeshTopology;
    public indiceCount:number = 0;
    public type:GLDataType;
    public totalbytes:number;
    public offset:number;

    public constructor(topology:MeshTopology = MeshTopology.Triangles,indices:number = 0,type:GLDataType = GL.UNSIGNED_SHORT,offset:number = 0){
        this.topology = topology;
        this.indiceCount = indices;
        this.type= type;
        this.offset = offset;
        this.totalbytes = indices *MeshBufferUtility.TypeSize(type);
    }

    public set(topology:MeshTopology = MeshTopology.Triangles,indices:number = 0,type:GLDataType = GL.UNSIGNED_SHORT,offset:number = 0){
        this.topology = topology;
        this.indiceCount = indices;
        this.type= type;
        this.offset = offset;
        this.totalbytes = indices *MeshBufferUtility.TypeSize(type);
    }
}

export type MeshDataBufferIndices = Uint16Array | Uint32Array | Uint8Array;
export type MeshDataBuffer = ArrayBuffer | DataView | Float32Array | Float64Array | Int32Array | Int16Array | Int8Array | Uint16Array | Uint32Array | Uint8Array;

export class Mesh{
    public bufferVertices:WebGLBuffer; //Compound or Position
    public bufferIndices:WebGLBuffer;
    public bufferUV:WebGLBuffer;
    public bufferNormal:WebGLBuffer;

    public name:string;
    public readonly vertexDesc:MeshVertexDesc = new MeshVertexDesc();
    public readonly indiceDesc:MeshIndicesDesc = new MeshIndicesDesc();

    private static s_quad:Mesh;
    private static s_cube:Mesh;
    private static s_sphere:Mesh;

    protected m_dataPosition:MeshDataBuffer;
    protected m_dataUV:MeshDataBuffer;
    protected m_dataNormal:MeshDataBuffer;
    protected m_dataIndices:MeshDataBufferIndices;

    public get dataPosition():MeshDataBuffer{ return this.m_dataPosition;}
    public get dataUV():MeshDataBuffer{ return this.m_dataUV;}
    public get dataNormal():MeshDataBuffer{ return this.m_dataNormal;}
    public get dataIndices():MeshDataBufferIndices{ return this.m_dataIndices;}

    protected m_bufferInited:boolean =false;
    protected m_seperatedBuffer:boolean = false;
    
    public get seperatedBuffer():boolean { return this.m_seperatedBuffer;}
    

    public constructor(name?:string,serperatedBuffer:boolean = false){
        this.name = name;
        this.m_seperatedBuffer= serperatedBuffer;
    }

    public get bufferInited():boolean{
        return this.m_bufferInited;
    }

    public setNormal(data:MeshDataBuffer,type:GLDataType,size:number){
        this.m_dataNormal = data;
        this.vertexDesc.normal = new MeshVertexAttrDesc(type,size,data.byteLength);
    }

    public setUV(data:MeshDataBuffer,type:GLDataType,size:number){
        this.m_dataUV = data;
        this.vertexDesc.uv = new MeshVertexAttrDesc(type,size,data.byteLength);
    }

    /**
     * 
     * @param data 
     * @param type data type
     * @param size component size
     */
    public setPosition(data:MeshDataBuffer,type:GLDataType,size:number,bufferByteLen:number = undefined){
        this.m_dataPosition = data;
        this.vertexDesc.position = new MeshVertexAttrDesc(type,size,bufferByteLen == undefined ? data.byteLength: bufferByteLen);
    }

    public setIndices(data:MeshDataBufferIndices,type:GLDataType,mode:MeshTopology){
        this.m_dataIndices = data;
        
        let inddesc = this.indiceDesc;
        inddesc.indiceCount =data.length;
        inddesc.topology = mode;
        inddesc.offset = 0;
        inddesc.type = type;
        inddesc.totalbytes = data.byteLength;
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
        quad.indiceDesc.set(MeshTopology.Triangles,dataIndices.length,GL.UNSIGNED_SHORT,0);

        quad.calculateNormal();
        return quad;
    }

    public static get Sphere():Mesh{
        if(Mesh.s_sphere != null) return Mesh.s_sphere;
        let sphere = new Mesh('sphere');
        Mesh.s_sphere = sphere;

        let slicey = 16;
        let slicer = slicey *2;

        let radstep  = Math.PI / slicey;

        let rad = -Math.PI /2.0 + radstep;

        let positions:number[] = [];
        let uvs:number[] = [];

        let pcount = (slicey - 1) * (slicer+1) +2;
        positions.push(.0,-1.0,.0,1.0);
        uvs.push(0.5,0.0);

        for(let t = 1;t <slicey;t++){
            let y = Math.sin(rad);
            let d = Math.cos(rad);
            
            let yaw = 0;

            let v = t*1.0 / slicey;

            for(let s = 0;s <= slicer;s++){
                let x = d * Math.cos(yaw);
                let z = d * Math.sin(yaw);
                positions.push(x,y,z,1.0);
                uvs.push(s*1.0/slicer,v);
                yaw += radstep;
            }
            rad += radstep;
        }
        positions.push(.0,1.0,.0,1.0);
        uvs.push(0.5,1.0);

        let indices:number[] = [];
        {
            //bottom
            for(let t=1,tbmax = slicer;t<=tbmax;t++){
                indices.push(0,t,t+1);
            }
            //center
            let slicerlayer = slicer +1;
            for(let t = 0;t <slicey-2;t++){
                let ib = 1+ t *slicerlayer;
                let it = ib + slicerlayer;
                for(let s= 0;s< slicerlayer;s++){
                    let ibs = ib + s;
                    let its = it +s;
                    indices.push(ibs,ibs+1,its+1,ibs,its+1,its);
                }
            }
            //top
            let imax = pcount-1;
            let istart = imax - slicer-1;
            for(let t=istart,ttmax = imax;t<ttmax;t++){
                indices.push(imax,t,t+1);
            }
        }

        let dataposition = new Float32Array(positions);
        sphere.m_dataPosition = dataposition;
        let dataindices = new Uint16Array(indices);
        sphere.m_dataIndices = dataindices;
        let datauv = new Float32Array(uvs);
        sphere.m_dataUV = datauv;

        sphere.m_dataNormal = dataposition;

        let vertexdesc =sphere.vertexDesc;
        vertexdesc.position= new MeshVertexAttrDesc(GL.FLOAT,4,dataposition.byteLength);
        vertexdesc.normal= new MeshVertexAttrDesc(GL.FLOAT,4,dataposition.byteLength);
        vertexdesc.uv= new MeshVertexAttrDesc(GL.FLOAT,2,datauv.byteLength);
        sphere.indiceDesc.set(MeshTopology.Triangles,indices.length,GL.UNSIGNED_SHORT,0);

        return sphere;
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

        cube.indiceDesc.set(MeshTopology.Triangles,dataIndices.length,GL.UNSIGNED_SHORT,0);

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

            let n = vec3.Cross(v1.sub(v2),v3.sub(v2)).normalized;
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

        let buffervert = glctx.createBuffer();
        glctx.bindBuffer(GL.ARRAY_BUFFER,buffervert);
        this.bufferVertices = buffervert;

        let dataTotalSize = this.vertexDesc.totalByteSize;
        let totalData = new ArrayBuffer(dataTotalSize);

        let totalDataView= new DataView(totalData,0,dataTotalSize);


        let offset = 0;
        let vertexDesc = this.vertexDesc;


        if (this.m_dataPosition != null) {
            vertexDesc.position.offset = offset;
            offset = MeshBufferUtility.copyBuffer(totalDataView,this.m_dataPosition,offset);
            offset = Math.ceil(offset/4.0)*4;
        }
        if (this.m_dataUV != null) {
            vertexDesc.uv.offset = offset;
            offset = MeshBufferUtility.copyBuffer(totalDataView,this.m_dataUV,offset);
            offset = Math.ceil(offset/4.0)*4;
        }
        if (this.m_dataNormal != null) {
            vertexDesc.normal.offset= offset;
            offset = MeshBufferUtility.copyBuffer(totalDataView,this.m_dataNormal,offset);
            offset = Math.ceil(offset/4.0)*4;
        }
        glctx.bufferData(GL.ARRAY_BUFFER,totalData,GL.STATIC_DRAW);
        glctx.bindBuffer(GL.ARRAY_BUFFER,null);

        //Indices
        let dataIndices = this.m_dataIndices;
        let hasIndices = dataIndices != null && dataIndices.length !=0;
        if(hasIndices){
            let bufferIndices = glctx.createBuffer();
            glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,bufferIndices);
            glctx.bufferData(GL.ELEMENT_ARRAY_BUFFER,dataIndices,GL.STATIC_DRAW);
            glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,null);

            this.bufferIndices = bufferIndices;
        }
        this.m_bufferInited = true;
    }
}


export class MeshBufferUtility{
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

    /**
     * Quad Order
     * v0 -- v1
     *  |    |
     * v3 -- v2
     * @param databuffer 
     * @param quadsize 
     */
    public static IndicesBufferFillQuad(databuffer:MeshDataBufferIndices,quadsize:number){
        let itemlen = quadsize *6;
        if(databuffer.length < itemlen) throw new Error('buffer size exceeded.');
        
        let index = 0;
        let vindex = 0;
        for(let i=0;i<quadsize;i++){
            databuffer[index] = vindex;
            databuffer[index+1] = vindex+1;
            databuffer[index+2] = vindex+2;
            databuffer[index+3] = vindex;
            databuffer[index+4] = vindex+2;
            databuffer[index+5] = vindex+3;
            index +=6;
            vindex+=4;
        }
    }
}
