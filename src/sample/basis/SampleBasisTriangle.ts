import { GL, Material, Mesh, MeshTopology, ClearType, vec4, Camera, GameObject, Color } from "../../iris";
import { AssetsDataBase } from "../../iris/core/AssetsDatabase";
import { CommandBuffer, CommandBufferEvent } from "../../iris/core/CommandBuffer";
import { GameContext } from "../../iris/core/GameContext";
import { ShaderFX } from "../../iris/core/ShaderFX";
import { SampleBase } from "../sampleBase";

export class SampleBasisTriangle extends SampleBase{

    private m_cmdbuffer:CommandBuffer;
    private m_mesh:Mesh;
    private m_camera:GameObject;

    onInit(){
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

        if(this.m_cmdbuffer == null){
            let cmdbuffer:CommandBuffer = new CommandBuffer("Draw Triangle");
            let bundle = AssetsDataBase.getLoadedBundle("iris");
            let shader = ShaderFX.findShader(bundle,'@shaderfx/vertex_color_raw');
            let material = new Material(shader);
    
            cmdbuffer.drawMesh(mesh,material);
            cmdbuffer.submit();

            this.m_cmdbuffer = cmdbuffer;
        }

        if(this.m_camera == null){
            let camera = Camera.CreatePersepctive(60,1.0,0.1,300);
            camera.clearType = ClearType.Background;
            camera.background = new vec4([0.3,0.3,0.3,1.0]);
            camera.cmdList.add(CommandBufferEvent.beforeOpaque,this.m_cmdbuffer);
            let c =new GameObject("Camera");
            c.addComponent(camera);
            this.m_camera = c;
        }
    }

    onDestroy(){
        GameContext.current.destroy(this.m_camera);
        this.m_camera = null;
    }
}