import { Transform } from "./Transform";
import { MeshRender } from "./MeshRender";
import { Component } from "./Component";
import { Scene } from "./Scene";
import { BaseRender } from "./BaseRender";
import { Camera } from "./Camera";
import { SceneManager } from "./SceneManager";
import { Light } from "./Light";
import { setMaxListeners } from "cluster";

export class GameObject{

    public name:string;
    public transform:Transform;
    public components:Component[];
    private m_render:BaseRender;


    public get render():BaseRender{
        return this.m_render;
    }

    public set render(v:BaseRender){
        v['m_object'] = this;
        this.m_render = v;
    }

    public addRender<T extends BaseRender>(t:new()=>T):T{
        let render = new t();
        render['m_object'] = this;
        this.m_render = render;
        return render;
    }

    
    public active:boolean = true;

    public constructor(name?:string){
        this.name = name;
        this.transform = new Transform(this);
        
        SceneManager.resolveNewGameObject(this);
    }

    public update(){
        let comp = this.components;
        if(comp != null){
            for(let i=0,len = comp.length;i<len;i++){
                let c = comp[i];
                if(c.onUpdate !=null){
                    c.onUpdate();
                }
            }
        }

        let trs = this.transform;
        let trsdirty = trs.isDirty;
        
        let children = this.transform.children;
        if(children != null){
            for(let i=0,len = children.length;i<len;i++){
                let g = children[i].gameobject;
                g.transform.setObjMatrixDirty(trsdirty);
                g.update();
            }
        }
    }

    public addComponent<T extends Component>(c:T):T{
        if(c.gameobject !=null){
            throw new Error("can not add single component to multiple objects");
        }

        let comps = this.components;
        if(comps == null){
            comps = [];
            this.components = comps;
        }

        let index= comps.indexOf(c);
        if(index >=0) return c;

        if(c instanceof Camera){
            SceneManager.addCamera(c);
        }else if(c instanceof Light){
            SceneManager.addLight(c);
        }

        c.gameobject = this;
        if(c.onStart != null) c.onStart();
        comps.push(c);

        return c;
    }

    public getComponent<T extends Component>(t:new()=>T):T{
        let comps = this.components;
        for(let i=0,len = comps.length;i<len;i++){
            if(comps[i] instanceof t) return <T>comps[i];
        }
        return null;
    }

    public getChildByName(name:string):GameObject{
        let children = this.transform.children;
        if(children == null )  return null;

        for(let i=0,len = children.length;i<len;i++){
            let ct = children[i].gameobject;
            if(ct.name === name) return ct;

            let cc = ct.getChildByName(name);
            if(cc != null) return cc;
        }
        return null;
    }
}
