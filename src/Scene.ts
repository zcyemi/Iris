import { GameObject } from "./GameObject";
import { Camera } from "./Camera";
import { Light } from "./Light";

export class Scene extends GameObject{
    public camera:Camera;

    private readonly m_lightList:Light[] = [];

    public get lights():Light[]{
        return this.m_lightList;
    }

    public constructor(){
        super();
        this.transform= null;
    }

    public addChild(obj:GameObject):boolean{
        if(!super.addChild(obj)) return false;

        if(obj instanceof Light){
            this.m_lightList.push(obj);
        }
        return true;
    }

    public removeChild(obj:GameObject):boolean{
        if(!super.removeChild(obj)) return false;
        if(obj instanceof Light){
            this.m_lightList.push(obj);
        }
        return true;
    }
}
