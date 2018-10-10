import { Transform } from "./Transform";
import { MeshRender } from "./MeshRender";
import { Component } from "./Component";

export class GameObject{

    public transform:Transform;
    public children: GameObject[];

    public components:Component[];

    private m_render:MeshRender;
    public set render(r:MeshRender){
        r.object = this;
        this.m_render = r;
    }
    public get render():MeshRender{
        return this.m_render;
    }

    
    public active:boolean = true;

    public constructor(){
        this.transform = new Transform();
    }

    public addChild(obj:GameObject):boolean{
        if(obj == null) return false;
        let children = this.children;
        if(children == null ){
            children = [];
            this.children = children;
        }
        let index = children.indexOf(obj);
        if(index >=0 ) return false;
        this.children.push(obj);
        return true;
    }

    public removeChild(obj:GameObject):boolean{
        let children = this.children;
        if(children == null) return false;
        let index= children.indexOf(obj);
        if(index <0 ) return false;
        this.children = children.splice(index,1);
        return true;
    }

    public update(){
        let comp = this.components;
        if(comp != null){
            for(let i=0,len = comp.length;i<len;i++){
                let c = comp[i];
                if(c.onUpdate !=null){
                    c.onUpdate.call(c);
                }
            }
        }

        let children = this.children;
        if(children != null){
            for(let i=0,len = children.length;i<len;i++){
                children[i].update();
            }
        }
    }

    public addComponent(c:Component){
        let comps = this.components;
        if(comps == null){
            comps = [];
            this.components = comps;
        }
        c.gameobject = this;
        comps.push(c);
    }

    public getComponent<T extends Component>(t:new()=>T){
        let comps = this.components;
        for(let i=0,len = comps.length;i<len;i++){
            if(comps[i] instanceof t) return comps[i];
        }
        return null;
    }
}
