import { SampleBase } from "./sampleBase";
import { SceneManager, vec4, Mesh, MeshBuilder, MeshTopology, GL, Material } from "../iris";
import { CommandBufferEvent, CommandBuffer } from "../iris/core/CommandBuffer";
import { GameContext } from "../iris/core/GameContext";
import { MeshPrimitive } from "../iris/core/MeshPrimitive";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";
import { ShaderFX } from "../iris/core/ShaderFX";

export class SampleTriangle extends SampleBase{

    onInit(){
        var cam = GameContext.current.mainCamera;
        var cmdbuffer:CommandBuffer = new CommandBuffer("Draw Triangle");

        let mesh =new Mesh("Triangle");
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

        let bundle = AssetsDataBase.getLoadedBundle("iris");
        let shader = ShaderFX.findShader(bundle,'@shaderfx/vertex_color_raw');
        let material = new Material(shader);

        cmdbuffer.drawMesh(mesh,material);

        cmdbuffer.submit();

        cam.cmdList.add(CommandBufferEvent.beforeOpaque,cmdbuffer);
    }
}