import { Transform } from "./Transform";
import { MeshRender } from "./MeshRender";

export class GameObject{

    public transform:Transform;
    public children: GameObject[];

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
}
