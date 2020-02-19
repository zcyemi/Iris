import { GL, Material, Mesh, MeshTopology, ClearType, vec4 } from "../iris";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";
import { CommandBuffer, CommandBufferEvent } from "../iris/core/CommandBuffer";
import { GameContext } from "../iris/core/GameContext";
import { ShaderFX } from "../iris/core/ShaderFX";
import { SampleBase } from "./sampleBase";

export class SampleTriangle extends SampleBase{

    private m_cmdbuffer:CommandBuffer;
    private m_mesh:Mesh;
    private m_mat:Material;

    onInit(){
        var cam = GameContext.current.mainCamera;

        cam.clearType = ClearType.Background;
        cam.background= vec4.zero;

        var cmdbuffer:CommandBuffer = new CommandBuffer("Draw Triangle");

        let mesh:Mesh = this.m_mesh;
        if(mesh==null){
            mesh  =new Mesh("Triangle");
            mesh.setPosition(0,new Float32Array([
                -0.5,0.5,0,
                0.5,0.5,0,
                0,-0.5,0
            ]),GL.FLOAT,3);
            mesh.setColor(0,new Float32Array([
                1,0,0,1,
                0,1,0,1,
                0,0,1,1
            ]),GL.FLOAT,4);
            mesh.setIndices(new Uint16Array([0,1,2]),GL.UNSIGNED_SHORT,MeshTopology.Triangles);
            mesh.apply();

        this.m_mesh = mesh;
        }

        let bundle = AssetsDataBase.getLoadedBundle("iris");
        let shader = ShaderFX.findShader(bundle,'@shaderfx/vertex_color_raw');
        let material = new Material(shader);

        cmdbuffer.drawMesh(mesh,material);
        cmdbuffer.submit();

        cam.cmdList.add(CommandBufferEvent.beforeOpaque,cmdbuffer);

        this.m_cmdbuffer = cmdbuffer;
        this.m_mat = material;
    }

    onDestroy(){
        var cam = GameContext.current.mainCamera;
        cam.cmdList.remove(CommandBufferEvent.beforeOpaque,this.m_cmdbuffer);
        this.m_cmdbuffer.release();

        this.m_mat.release();

        console.log("destroy");
    }
}