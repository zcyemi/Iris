import { GameObject } from "./GameObject";
import { vec4, vec3, mat4 } from "wglut";


export enum LightType{
    direction = 0,
    point = 1
}

export class Light extends GameObject{
    public lightType:LightType = LightType.point;
    public intensity:number = 1.0;
    public lightColor:vec3 = vec3.one;

    private m_range:number = 10;
    private m_direction:vec3;

    private m_paramDirty:boolean = true;

    public castShadow:boolean = false;

    public get range():number{
        return this.m_range;
    }

    public get direction():vec3{
        return this.m_direction;
    }

    public get lightPosData():vec3{
        if(this.lightType == LightType.direction){
            return this.m_direction.mulToRef(-1.0);
        }
        else{
            return this.transform.position;
        }
    }

    public get isDirty():boolean{
        return this.transform.isDirty && this.m_paramDirty;
    }

    public set isDirty(v:boolean){
        if(v){
            this.m_paramDirty =true;
        }
        else{
            this.m_paramDirty = false;
            this.transform.setDirty(false);
        }
    }

    private constructor(type:LightType,intensity?:number,color?:vec3){
        super();
        this.lightType = type;
        if(intensity) this.intensity = intensity;
        if(color) this.lightColor = color;
    }

    public static createPointLight(range:number = 10,position?:vec3,intensity?:number,color?:vec3){
        let light = new Light(LightType.point,intensity,color);
        if(position) light.transform.position = position;
        light.m_range = range;
        return light;
    }

    public static creatDirctionLight(dir:vec3 = vec3.right,intensity?:number,color?:vec3){
        let light = new Light(LightType.direction,intensity,color);
        light.m_direction = dir.normalized();
        light.castShadow = true;
        return light;
    }
}