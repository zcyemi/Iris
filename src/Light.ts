import { GameObject } from "./GameObject";
import { vec3, vec4, glmath } from "./math/GLMath";
import { Component } from "./Component";
import { Scene } from "./Scene";


export enum LightType{
    direction = 0,
    point = 1
}

export class Light extends Component{
    public lightType:LightType = LightType.point;
    public intensity:number = 1.0;
    public lightColor:vec3 = vec3.one;

    private m_range:number = 10;

    private m_paramDirty:boolean = true;

    public castShadow:boolean = false;

    public get range():number{
        return this.m_range;
    }


    public get lightPosData():vec3{
        if(this.lightType == LightType.direction){
            return this.transform.forward;
        }
        else{
            return this.transform.localPosition;
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
            this.transform.setLocalDirty(false);
        }
    }

    public constructor(type:LightType,intensity?:number,color?:vec3){
        super();
        this.lightType = type;
        if(intensity) this.intensity = intensity;
        if(color) this.lightColor = color;
    }

    public static createPointLight(gobj:GameObject,range:number = 10,position?:vec3,intensity?:number,color?:vec3){
        let light = new Light(LightType.point,intensity,color);
        gobj.addComponent(light);
        if(position) light.transform.localPosition = position;
        light.m_range = range;
        return light;
    }

    public static creatDirctionLight(gobj:GameObject,intensity:number = 1.0,dir:vec3 = vec3.down,color:vec3 = vec3.one){
        let light = new Light(LightType.direction,intensity,color);
        gobj.addComponent(light);
        light.transform.forward = dir.normalized();
        light.castShadow = true;
        return light;
    }
    public onUpdate(scene:Scene){
        scene.addLight(this);
    }

    public getShaderLightPosData():vec4{
        if(this.lightType == LightType.direction){
            let fwd = this.transform.forward.raw;
            return glmath.vec4(-fwd[0],-fwd[1],-fwd[2],1.0);
        }
        else{
            return this.transform.position.vec4(0.0);
        }
    }
}
