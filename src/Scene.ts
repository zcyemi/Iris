import { GameObject } from "./GameObject";
import { Camera } from "./Camera";
import { Light } from "./Light";

export class Scene extends GameObject{
    public camera:Camera;

    private m_lightList:Light[] = [];

    public get lights():Light[]{
        return this.m_lightList;
    }

    public constructor(){
        super();
    }


    public onFrameStart(){
        this.m_lightList = [];
    }

    public onFrameEnd(){

    }

    public addLight(light:Light){
        this.m_lightList.push(light);
    }

   
}
