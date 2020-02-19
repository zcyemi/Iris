import { GameObject, Material, MeshRender } from "../iris/core";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";
import { GameContext } from "../iris/core/GameContext";
import { MeshPrimitive } from "../iris/core/MeshPrimitive";
import { ShaderFX } from "../iris/core/ShaderFX";
import { vec4 } from "../iris/math";
import { SampleBase } from "./sampleBase";

export class SampleBasicCube extends SampleBase{

    private m_cube:GameObject;

    onInit(){
        var g = new GameObject("Cube");
        this.m_cube = g;

        let camera = GameContext.current.mainCamera;


        let bundle = AssetsDataBase.getLoadedBundle("iris");
        let shader = ShaderFX.findShader(bundle,'@shaderfx/default');

        let mat = new Material(shader);
        mat.setColor('uColor',vec4.one);

        let mesh = MeshPrimitive.Cube;
        let meshRender = new MeshRender(mesh,mat);
        g.render = meshRender;
    }

    onDestroy(){
    }
}

