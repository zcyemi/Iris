import { GameObject, Material, MeshRender, ClearType, Skybox, Mesh, MeshTopology } from "../iris/core";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";
import { GameContext } from "../iris/core/GameContext";
import { MeshPrimitive } from "../iris/core/MeshPrimitive";
import { ShaderFX } from "../iris/core/ShaderFX";
import { vec4, vec3, mat4 } from "../iris/math";
import { SampleBase } from "./sampleBase";
import { GL } from "../iris";
import { CommandBuffer, CommandBufferEvent } from "../iris/core/CommandBuffer";
import { compileFunction } from "vm";

export class SampleBasicCube extends SampleBase{

    private m_cube:GameObject;
    private m_mesh:Mesh;

    private m_skybox:Skybox;

    onInit(){

        if(this.m_cube == null){
            var g = new GameObject("Cube");
            this.m_cube = g;
    
            g.transform.setPosition(new vec3([0,0,0]));
            let bundle = AssetsDataBase.getLoadedBundle("iris");
            let shader = ShaderFX.findShader(bundle,'@shaderfx/debug');

            let mat = new Material(shader);
            // mat.setColor('uColor',vec4.one);
    
            let mesh = this.m_mesh;
            if(mesh == null){
                mesh = new Mesh('TestBox');
                mesh.setPosition(0,new Float32Array([
                    -0.5,-0.5,0,
                    0.5,-0.5,0,
                    0.5,0.5,0,
                    -0.5,0.5,0,
                ]),GL.FLOAT,3);

                mesh.setIndices(new Uint16Array([0,2,1,0,2,3]),GL.UNSIGNED_SHORT,MeshTopology.Triangles);
                mesh.apply();
            }

            
            let meshRender = new MeshRender(mesh,mat);
            g.render = meshRender;

            // let cmdbuffer = new CommandBuffer("test");
            // cmdbuffer.drawMesh(mesh,mat,g.transform.objMatrix);
            // cmdbuffer.submit();

            // let camera = GameContext.current.mainCamera;
            // camera.cmdList.add(CommandBufferEvent.beforeOpaque,cmdbuffer);

            
        }
        else{
            this.m_cube.active = true;
        }

        let camera = GameContext.current.mainCamera;
        camera.clearType = ClearType.Background;

        // if(this.m_skybox == null){
        //     this.m_skybox = Skybox.createFromProcedural();
        // }
        // camera.skybox = this.m_skybox;


    }

    onDestroy(){
        this.m_cube.active =false;
    }
}



window['mat4'] = mat4;
window['vec4'] = vec4;