import { GameObject } from "./GameObject";
import { Camera } from "./Camera";
import { Light, LightType } from "./Light";

export class Scene extends GameObject{
    public mainCamera:Camera;

    private m_lightList:Light[] = new Array<Light>(4);
    private m_lightCount = 0;
    private m_lightCountPrev:number = 0;
    private m_lightDataDirty:boolean = true;
    private m_primeLight:Light;
    private m_primeLightPrev:Light;

    public get lightDataList():Light[]{ return this.m_lightList;}
    public get lightCount():number{ return this.m_lightCount;}
    public get lightDataDirty():boolean{ return this.m_lightDataDirty;}
    public set lightDataDirty(val:boolean){ this.m_lightDataDirty =val;}
    /**
     * Primary light, usually directional light.
     */
    public get lightPrime():Light{return this.m_primeLight;}

    public get lights():Light[]{
        return this.m_lightList;
    }

    public constructor(){
        super();
    }

    public onFrameStart(){
        this.m_lightCount =0;
        this.m_primeLight = null;
    }

    public onFrameEnd(){
        let lightcount = this.m_lightCount;

        if(!this.m_lightDataDirty && this.m_lightCountPrev != lightcount){
            this.m_lightDataDirty = true;
        }
        this.m_lightCountPrev = lightcount;

        let primeLight =this.m_primeLight;
        if(primeLight != this.m_primeLightPrev){
            this.m_lightDataDirty = true;
        }
        
        this.m_primeLightPrev = primeLight;
    }

    public addLight(light:Light){
        if(light.lightType == LightType.direction){
            this.m_primeLight = light;
        }
        else{
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
}
