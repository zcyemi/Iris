import { MeshTopology, Mesh } from "./Mesh";
import { vec3 } from "wglut";
import { GLConst } from "./GL";


export class MeshBuilder{

    private m_topology:MeshTopology;

    private m_positions:Array<number>;
    private m_indiecs:Array<number>;

    private m_indicesCount:number =0;

    public constructor(topology:MeshTopology){
        this.m_topology = topology;

        this.m_positions = [];
        this.m_indiecs = [];
    }

    public addLine(p0:vec3,p1:vec3){
        const pos = this.m_positions;
        pos.push(p0.x,p0.y,p0.z,1.0,p1.x,p1.y,p1.z,1.0);

        const indice = this.m_indiecs;

        let indiceCount = this.m_indicesCount;
        indice.push(indiceCount,indiceCount+1);
        this.m_indicesCount +=2;
    }

    public addPoint(p:vec3){

    }

    public addTri(p0:vec3,p1:vec3,p2:vec3){
        const pos =this.m_positions;

        pos.push(p0.x,p0.y,p0.z,1.0);
        pos.push(p1.x,p1.y,p1.z,1.0);
        pos.push(p2.x,p2.y,p2.z,1.0);

        let index = this.m_indicesCount;
        this.m_indiecs.push(index,index+1,index+2);
        this.m_indicesCount = index+3;
    }


    public genMesh():Mesh{

        let topo = this.m_topology;
        let mesh =new Mesh();
        
        mesh.setPosition(new Float32Array(this.m_positions),GLConst.FLOAT,4);
        mesh.setIndices(new Uint16Array(this.m_indiecs),GLConst.UNSIGNED_SHORT,topo);

        return mesh;
    }
}