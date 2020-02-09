import { Component, GameObject, MeshRender, Mesh, Material, Color } from "../iris/core";
import { MeshPrimitive } from "../iris/core/MeshPrimitive";
import { vec4 } from "../iris/math";
import { ShaderFX } from "../iris/core/ShaderFX";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";

export class SampleBasicCube extends Component{

    private m_cube:GameObject;

    onStart(){
        var g = new GameObject("Cube");

        let bundle = AssetsDataBase.getLoadedBundle("iris");
        let shader = ShaderFX.findShader(bundle,'@shaderfx/default');

        console.log(shader);

        let mat = new Material(shader);
        mat.setColor('uColor',vec4.one);

        let meshrender = new MeshRender(MeshPrimitive.Cube,mat);
        g.render = meshrender;
        this.m_cube = g;
    }

    onUpdate(){

    }
}