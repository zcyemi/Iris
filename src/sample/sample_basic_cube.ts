import { Component, GameObject, MeshRender, Mesh, Material, Color } from "../iris/core";
import { MeshPrimitive } from "../iris/core/MeshPrimitive";
import { vec4 } from "../iris/math";
import { ShaderFX } from "../iris/core/ShaderFX";
import { AssetsDataBase } from "../iris/core/AssetsDatabase";
import { SampleBase } from "./sampleBase";

export class SampleBasicCube extends SampleBase{

    private m_cube:GameObject;

    onInit(){
        var g = new GameObject("Cube");

        let bundle = AssetsDataBase.getLoadedBundle("iris");
        let shader = ShaderFX.findShader(bundle,'@shaderfx/default');


        let mat = new Material(shader);
        mat.setColor('uColor',vec4.one);

        let meshrender = new MeshRender(MeshPrimitive.Cube,mat);
        g.render = meshrender;
        this.m_cube = g;
    }

    onDestroy(){
    }
}

