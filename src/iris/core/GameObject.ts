import { BaseRender } from "./BaseRender";
import { Component } from "./Component";
import { GameContext } from "./GameContext";
import { Transform } from "./Transform";
import { Utility } from "./Utility";

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
        v.object = this;
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
        
        GameContext.current.registerNewGameObject(this);
    }

    public update(){

        let trs = this.transform;
        trs.isDataObjDirty = false;
        trs.isDataLocalDirty = false;

        let comp = this.components;
        if(comp != null){
            for(let i=0,len = comp.length;i<len;i++){
                let c = comp[i];
                if(c.onUpdate !=null){
                    c.onUpdate();
                }
            }
        }

        let dataDirty = trs.isDirty;

        let children = this.transform.children;
        if(children != null){
            for(let i=0,len = children.length;i<len;i++){
                let g = children[i].gameobject;
                if(dataDirty){
                    g.transform.setObjDirty();
                }
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

        c.gameobject = this;
        if(c.onStart != null) c.onStart();
        comps.push(c);

        return c;
    }

    public removeComponent<T extends Component>(c:T):T{
 
        let comps = this.components;
        if(comps == null){
            comps = [];
            this.components = comps;
        }

        let ondestroy =c.onDestroy;
        if(ondestroy) ondestroy();
        c.gameobject = null;
        
        this.components = Utility.ListRemove(comps,c);

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
