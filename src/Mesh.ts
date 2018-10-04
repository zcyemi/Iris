import { vec3, vec4 } from "wglut";

export enum MeshTopology{
    Triangles,
    TriangleFan,
    TriangleStrip,
    Points,
    Lines,
    LineStrip,
    LineLoop
}

export class Mesh{

    private static s_quad:Mesh;
    private static s_cube:Mesh;

    public topology:MeshTopology = MeshTopology.Triangles;

    public m_dataPosition:Float32Array;
    public m_dataUV:Float32Array;
    public m_dataNormal:Float32Array;
    public m_dataIndices:Uint16Array;

    public m_dateVerticesLen:number;
    public m_indicesCount:number;

    public m_bufferVertices:WebGLBuffer;
    public m_bufferIndices:WebGLBuffer;
    public m_vao:WebGLVertexArrayObject;
    public m_bufferInited:boolean =false;

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
        quad.m_indicesCount = dataIndices.length;
        quad.m_dateVerticesLen = dataPosition.length + dataUV.length;

        quad.m_dataPosition = dataPosition;
        quad.m_dataUV = dataUV;
        quad.m_dataIndices = dataIndices;

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

        cube.m_indicesCount = dataIndices.length;
        cube.m_dataIndices = new Uint16Array(dataIndices);
        cube.m_dataPosition = dataPosition;
        cube.m_dataUV =dataUV;
        cube.m_dateVerticesLen = dataPosition.length + dataUV.length;

        cube.calculateNormal();

        return cube;
    }

    public calculateNormal(){

        if(this.topology != MeshTopology.Triangles){
            console.warn(`${MeshTopology[this.topology]} is not supported.`);
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

        if (normal != null && normal.length == position.length) return;

        let normaldata = new Float32Array(position.length);

        let verticesLen = position.length/4;
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

            let n = vec3.Cross(v1.sub(v2),v3.sub(v2)).normalize();
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
        this.m_dateVerticesLen += normaldata.length;
    }
}
