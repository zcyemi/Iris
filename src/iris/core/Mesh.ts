import { GL, GLConst, GLDataType } from "../gl/GL";
import { GLContext } from "../gl/GLContext";
import { vec3 } from "../math/GLMath";
import { AttrSemantic } from "./ShaderFX";
import { GraphicsContext } from "./GraphicsContext";
import { GameContext } from "./GameContext";

export enum MeshTopology {
    Triangles = 4,
    TriangleFan = 6,
    TriangleStrip = 5,
    Points = 0,
    Lines = 1,
    LineStrip = 3,
    LineLoop = 2
}

export class MeshVertexAttrDesc {
    public type: GLDataType;
    /** Component size [1,2,3,4] */
    public size: number;
    public totalbytes: number;
    public offset: number = 0;


    /**
     * constructor of MeshVertexAttrDesc
     * @param type data type
     * @param size componsnet length [1,2,3,4]
     * @param bytes total size in bytes
     * @param offset offset in bytes
     */
    public constructor(type: GLDataType, size: number, bytes: number, offset: number = 0) {
        this.type = type;
        this.size = size;
        this.totalbytes = bytes;
        this.offset = 0;
    }

    public get length(): number {
        return this.totalbytes / this.size / MeshBufferUtility.TypeSize(this.type);
    }
}

export class MeshVertexDesc {
    public POSITION_0: MeshVertexAttrDesc;
    public TEXCOORD_0: MeshVertexAttrDesc;
    public TEXCOORD_1: MeshVertexAttrDesc;
    public NORMAL_0: MeshVertexAttrDesc;
    public COLOR_0: MeshVertexAttrDesc;
    public COLOR_1: MeshVertexAttrDesc;
    public get totalByteSize() {
        let bytes = 0;
        for (const key in this) {
            if (this.hasOwnProperty(key)) {
                const desc: any = this[key];
                bytes += (<MeshVertexAttrDesc>desc).totalbytes;
            }
        }
        return bytes;
    }
}

export class MeshIndicesDesc {
    public topology: MeshTopology;
    public indiceCount: number = 0;
    public type: GLDataType;
    public totalbytes: number;
    public offset: number;

    public constructor(topology: MeshTopology = MeshTopology.Triangles, indices: number = 0, type: GLDataType = GL.UNSIGNED_SHORT, offset: number = 0) {
        this.topology = topology;
        this.indiceCount = indices;
        this.type = type;
        this.offset = offset;
        this.totalbytes = indices * MeshBufferUtility.TypeSize(type);
    }

    public set(topology: MeshTopology = MeshTopology.Triangles, indices: number = 0, type: GLDataType = GL.UNSIGNED_SHORT, offset: number = 0) {
        this.topology = topology;
        this.indiceCount = indices;
        this.type = type;
        this.offset = offset;
        this.totalbytes = indices * MeshBufferUtility.TypeSize(type);
    }
}

export type MeshDataBufferIndices = Uint16Array | Uint32Array | Uint8Array;
export type MeshDataBuffer = ArrayBuffer | DataView | Float32Array | Float64Array | Int32Array | Int16Array | Int8Array | Uint16Array | Uint32Array | Uint8Array;

export class Mesh {
    public bufferVertices: WebGLBuffer; //Compound or Position
    public bufferIndices: WebGLBuffer;

    public bufferSeperated: { [attr: string]: WebGLBuffer } = {};
    public dataVertices: { [attr: string]: MeshDataBuffer } = {};
    public dataIndices: MeshDataBufferIndices;

    public name: string;
    public readonly vertexDesc: MeshVertexDesc = new MeshVertexDesc();
    public readonly indiceDesc: MeshIndicesDesc = new MeshIndicesDesc();

    protected m_bufferInited: boolean = false;
    protected m_seperatedBuffer: boolean = false;

    public get seperatedBuffer(): boolean { return this.m_seperatedBuffer; }

    public constructor(name?: string, serperatedBuffer: boolean = false) {
        this.name = name;
        this.m_seperatedBuffer = serperatedBuffer;
    }

    public get bufferInited(): boolean {
        return this.m_bufferInited;
    }

    public setVerticesData(attr: AttrSemantic | string, databuffer: MeshDataBuffer) {
        this.dataVertices[attr] = databuffer;
    }
    public getVerticesData(attr: AttrSemantic) {
        return this.dataVertices[attr]
    }

    private setDataBuffer(semantic: string, index: number, data: MeshDataBuffer, type: GLDataType, size: number, bufferByteLen: number = undefined) {
        let indexstr = `${semantic}_${index}`;
        this.setVerticesData(indexstr, data);
        this.vertexDesc[indexstr] = new MeshVertexAttrDesc(type, size, bufferByteLen == undefined ? data.byteLength : bufferByteLen);
    }

    public setNormal(index: number, data: MeshDataBuffer, type: GLDataType, size: number, bufferByteLen: number = undefined) {
        this.setDataBuffer("NORMAL", index, data, type, size, bufferByteLen);
    }



    /**
     * 
     * @param data 
     * @param type 
     * @param size component size [1,2,3,4]
     * @param bufferByteLen 
     */
    public setUV(index: number, data: MeshDataBuffer, type: GLDataType, size: number, bufferByteLen: number = undefined) {
        this.setDataBuffer("TEXCOORD", index, data, type, size, bufferByteLen);
    }

    /**
     * 
     * @param data 
     * @param type 
     * @param size component size [1,2,3,4]
     * @param bufferByteLen 
     */
    public setColor(index: number, data: MeshDataBuffer, type: GLDataType, size: number, bufferByteLen: number = undefined) {
        this.setDataBuffer("COLOR", index, data, type, size, bufferByteLen);
    }

    /**
     * 
     * @param data 
     * @param type data type
     * @param size component size
     */
    public setPosition(index: number, data: MeshDataBuffer, type: GLDataType, size: number, bufferByteLen: number = undefined) {
        this.setDataBuffer("POSITION", index, data, type, size, bufferByteLen);
    }

    public setIndices(data: MeshDataBufferIndices, type: GLDataType, mode: MeshTopology, indicesCount: number = undefined) {
        this.dataIndices = data;

        let inddesc = this.indiceDesc;
        inddesc.indiceCount = indicesCount == undefined ? data.length : indicesCount;
        inddesc.topology = mode;
        inddesc.offset = 0;
        inddesc.type = type;
        inddesc.totalbytes = data.byteLength;
    }

    public setIndicesCount(indices: number) {
        let indicesdesc = this.indiceDesc;
        indicesdesc.indiceCount = indices;
    }

    public calculateNormal() {
        if (this.indiceDesc.topology != MeshTopology.Triangles) {
            console.warn(`${MeshTopology[this.indiceDesc.topology]} is not supported.`);
            return;
        }

        let normal = this.getVerticesData(AttrSemantic.NORMAL_0);
        let position = this.getVerticesData(AttrSemantic.POSITION_0);
        if (position == null) {
            console.warn('vertices position is needed for normal calculation.');
            return;
        }
        let indics = this.dataIndices;
        if (indics == null) {
            console.warn('indices data is needed for normal calculation.');
            return;
        }

        let positionattr = this.vertexDesc.POSITION_0;
        let floatLength = positionattr.totalbytes / MeshBufferUtility.TypeSize(positionattr.type);
        let normaldata = new Float32Array(floatLength);
        let verticesLen = floatLength / positionattr.size;
        let normalVec: vec3[] = new Array<vec3>(verticesLen);
        let normalAcc: Uint16Array = new Uint16Array(verticesLen);
        let tricount = indics.length / 3;

        for (let i = 0; i < tricount; i++) {
            let off = i * 3;
            let i1 = indics[off];
            let i2 = indics[off + 1]
            let i3 = indics[off + 2];

            let i1v = i1 * 4;
            let i2v = i2 * 4;
            let i3v = i3 * 4;
            let v1 = new vec3([position[i1v], position[i1v + 1], position[i1v + 2]]);
            let v2 = new vec3([position[i2v], position[i2v + 1], position[i2v + 2]]);
            let v3 = new vec3([position[i3v], position[i3v + 1], position[i3v + 2]]);

            let n = vec3.Cross(v1.sub(v2), v3.sub(v2)).normalized;
            normalAcc[i1]++;
            if (normalVec[i1] == null) normalVec[i1] = vec3.zero;
            normalVec[i1].add(n);

            normalAcc[i2]++;
            if (normalVec[i2] == null) normalVec[i2] = vec3.zero;
            normalVec[i2].add(n);

            normalAcc[i3]++;
            if (normalVec[i3] == null) normalVec[i3] = vec3.zero;
            normalVec[i3].add(n);
        }

        for (let i = 0; i < verticesLen; i++) {
            let v = normalVec[i].div(normalAcc[i]).raw;
            normaldata.set([v[0], v[1], v[2], 0], i * 4);
        }

        this.setVerticesData(AttrSemantic.NORMAL_0, normaldata);
        this.vertexDesc.NORMAL_0 = new MeshVertexAttrDesc(GL.FLOAT, 4, normaldata.length * 4);
    }

    public apply(){
        this.refreshMeshBuffer(GameContext.current.graphicsRender.glctx);
    }

    public refreshMeshBuffer(glctx: GLContext) {
        if (this.m_bufferInited) return;

        let buffervert = glctx.createBuffer();
        glctx.bindBuffer(GL.ARRAY_BUFFER, buffervert);
        this.bufferVertices = buffervert;

        let dataTotalSize = this.vertexDesc.totalByteSize;
        let totalData = new ArrayBuffer(dataTotalSize);

        let totalDataView = new DataView(totalData, 0, dataTotalSize);

        let offset = 0;
        let vertexDesc = this.vertexDesc;

        let dataVertices = this.dataVertices;
        for (const key in dataVertices) {
            if (dataVertices.hasOwnProperty(key)) {
                if (AttrSemantic[key] == null) continue;
                const dataBuffer = this.dataVertices[key];
                vertexDesc[key].offset = offset;
                offset = MeshBufferUtility.copyBuffer(totalDataView, dataBuffer, offset);
                offset = Math.ceil(offset / 4.0) * 4;
            }
        }
        glctx.bufferData(GL.ARRAY_BUFFER, totalData, GL.STATIC_DRAW);
        glctx.bindBuffer(GL.ARRAY_BUFFER, null);

        //Indices
        let dataIndices = this.dataIndices;
        let hasIndices = dataIndices != null && dataIndices.length != 0;
        if (hasIndices) {
            let bufferIndices = glctx.createBuffer();
            glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, bufferIndices);
            glctx.bufferData(GL.ELEMENT_ARRAY_BUFFER, dataIndices, GL.STATIC_DRAW);
            glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);

            this.bufferIndices = bufferIndices;
        }
        else{
            throw new Error(`indices not setup for mesh '${this.name}'`);
        }
        this.m_bufferInited = true;
    }
}

export class MeshBufferUtility {
    /**
     * 
     * @param target 
     * @param buffer 
     * @param offsetInByte 
     * @returns endpos in byte
     */
    public static copyBuffer(target: DataView, buffer: MeshDataBuffer, offsetInByte: number): number {
        let offset = offsetInByte;
        if (buffer instanceof DataView) {
            let sourceView = new Uint8Array(buffer.buffer, 0, buffer.byteLength);
            for (let i = 0, len = sourceView.byteLength; i < len; i++) {
                target.setUint8(offset, sourceView[i]);
                offset++;
            }
            return offset;
        }
        else if (buffer instanceof ArrayBuffer) {
            let sourceView = new Uint8Array(buffer, 0, buffer.byteLength);
            for (let i = 0, len = sourceView.byteLength; i < len; i++) {
                target.setUint8(offset, sourceView[i]);
                offset++;
            }
            return offset;
        }
        else if (buffer instanceof Float32Array) {
            for (let i = 0, len = buffer.length; i < len; i++) {
                target.setFloat32(offset, buffer[i], true);
                offset += 4;
            }
            return offset;
        } else if (buffer instanceof Uint16Array) {
            for (let i = 0, len = buffer.length; i < len; i++) {
                target.setUint16(offset, buffer[i]);
                offset += 2;
            }
            return offset;
        }
        else {
            throw new Error('not implemented');
        }
    }

    public static TypeSize(type: GLDataType): number {

        if (type == GLConst.FLOAT || type == GLConst.UNSIGNED_INT) {
            return 4;
        }
        if (type == GLConst.SHORT || type == GLConst.UNSIGNED_SHORT) {
            return 2;
        }
        if (type == GLConst.BYTE || type == GLConst.UNSIGNED_BYTE) {
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
    public static IndicesBufferFillQuad(databuffer: MeshDataBufferIndices, quadsize: number) {
        let itemlen = quadsize * 6;
        if (databuffer.length < itemlen) throw new Error('buffer size exceeded.');

        let index = 0;
        let vindex = 0;
        for (let i = 0; i < quadsize; i++) {
            databuffer[index] = vindex;
            databuffer[index + 1] = vindex + 1;
            databuffer[index + 2] = vindex + 2;
            databuffer[index + 3] = vindex;
            databuffer[index + 4] = vindex + 2;
            databuffer[index + 5] = vindex + 3;
            index += 6;
            vindex += 4;
        }
    }
}
