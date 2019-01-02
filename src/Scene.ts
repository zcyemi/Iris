import { GameObject } from "./GameObject";
import { Camera } from "./Camera";
import { Light } from "./Light";

export class Scene extends GameObject{
    public mainCamera:Camera;

    private m_lightList:Light[] = new Array<Light>(4);
    private m_lightCount = 0;
    private m_lightCountLast:number = 0;
    private m_lightDataDirty:boolean = true;

    public get lightDataList():Light[]{ return this.m_lightList;}
    public get lightCount():number{ return this.m_lightCount;}
    public get lightDataDirty():boolean{ return this.m_lightDataDirty;}
    public set lightDataDirty(val:boolean){ this.m_lightDataDirty =val;}

    public get lights():Light[]{
        return this.m_lightList;
    }

    public constructor(){
        super();
    }

    public onFrameStart(){
        this.m_lightCount =0;
    }

    public onFrameEnd(){
        let lightcount = this.m_lightCount;

        if(!this.m_lightDataDirty && this.m_lightCountLast != lightcount){
            this.m_lightDataDirty = true;
        }

        this.m_lightCountLast = lightcount;
    }

    public addLight(light:Light){
        let lightcount = this.m_lightCount;
        if(lightcount >=4) return;

        if(light.isDirty){
            light.isDirty = false;
            this.m_lightDataDirty = true;
        }

        this.m_lightList[lightcount] = light;
        this.m_lightCount = lightcount + 1;
    }

   
}
