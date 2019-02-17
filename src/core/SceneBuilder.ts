import { Component } from "./Component";
import { BaseRender } from "./BaseRender";
import { quat, vec3 } from "../math/index";
import { Scene } from "./Scene";
import { GameObject } from "./GameObject";


export interface SceneBuilderTRS{
    pos?:number[];
    rota?:quat;
    scal?:number[];
}

export interface SceneBuildNodeBase{
    comp?: Component[];
    render?:BaseRender;
    trs?:SceneBuilderTRS;
    children?:SceneBuildNodes;
    oncreate?:(g:GameObject)=>void;
}

export type SceneBuildNodes = {[name:string]:SceneBuildNodeBase};


export class SceneBuilder{

    private constructor(){

    }

    private static applyTRS(gobj:GameObject,trs:SceneBuilderTRS){
        const pos = trs.pos;
        const gtrs = gobj.transform;
        if(pos != null){
            gtrs.setPosition(new vec3(pos));
        }
        const rota = trs.rota;
        if(rota != null){
            gtrs.setRotation(rota);
        }
        const scale = trs.scal;
        if(scale != null){
            gtrs.setScale(new vec3(scale));
        }
    }

    private static ParseNode(node:SceneBuildNodeBase,gobj?:GameObject){
        if(gobj == null) gobj = new GameObject();
        
        let comp = node.comp;
        if(comp != null)comp.forEach(c=>gobj.addComponent(c));
        if(node.trs!= null) SceneBuilder.applyTRS(gobj,node.trs);

        let render = node.render;
        if(render != null){
            gobj.render = render;
        }

        if(node.oncreate != null) node.oncreate(gobj);

        let children = node.children;
        if(children != null){
            for (const key in children) {
                if (children.hasOwnProperty(key)) {
                    const cnode = children[key];
                    var cobj = SceneBuilder.ParseNode(cnode);
                    if(cobj != null) cobj.name = key;
                    cobj.transform.parent = gobj.transform;
                }
            }
        }
        return gobj;
    }

    public static Build(rootnode:SceneBuildNodeBase):Scene{
        let scene = new Scene();
        if(rootnode == null) return scene;
        SceneBuilder.ParseNode(rootnode,scene);
        return scene;
    }
}

