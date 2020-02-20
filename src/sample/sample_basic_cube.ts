import { GameObject, Material, MeshRender, ClearType, Skybox } from "../iris/core";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";
import { GameContext } from "../iris/core/GameContext";
import { MeshPrimitive } from "../iris/core/MeshPrimitive";
import { ShaderFX } from "../iris/core/ShaderFX";
import { vec4, vec3 } from "../iris/math";
import { SampleBase } from "./sampleBase";

export class SampleBasicCube extends SampleBase{

    private m_cube:GameObject;
    private m_skybox:Skybox;

    onInit(){

        if(this.m_cube == null){
            var g = new GameObject("Cube");
            this.m_cube = g;
    
            g.transform.setPosition(new vec3([0,0,10]));
    
            
    
            let bundle = AssetsDataBase.getLoadedBundle("iris");
            let shader = ShaderFX.findShader(bundle,'@shaderfx/default');
    
            let mat = new Material(shader);
            mat.setColor('uColor',vec4.one);
    
            let mesh = MeshPrimitive.Quad;
            let meshRender = new MeshRender(mesh,mat);
    
            g.render = meshRender;

            this.m_skybox = Skybox.createFromProcedural();
        }
        else{
            this.m_cube.active = true;
        }

        let camera = GameContext.current.mainCamera;
        camera.clearType = ClearType.Skybox;
        camera.background = vec4.Random();
        camera.skybox = this.m_skybox;

    }

    onDestroy(){
        this.m_cube.active =false;
    }
}

