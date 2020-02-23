import { glmath, vec3, vec4 } from "../math/GLMath";
import { Component } from "./Component";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { ObjectUtil } from './Utility';

export enum LightType{
    direction = 0,
    point = 1
}

const KEY_m_paramDirty = "m_lightParamDirty";

export class Light extends Component{
    private m_lightParamDirty:boolean = true;

    public lightType:LightType = ObjectUtil.initProperty(this,"lightType",LightType.point,KEY_m_paramDirty);
    public intensity:number = ObjectUtil.initProperty(this,"intensity",1.0,KEY_m_paramDirty);
    public lightColor:vec3 = ObjectUtil.initProperty(this,"lightColor",vec3.one,KEY_m_paramDirty);
    public lightRange:number = ObjectUtil.initProperty(this,"lightRange",10.0,KEY_m_paramDirty);
    public castShadow:boolean = false;

    public get lightPosData():vec3{
        if(this.lightType == LightType.direction){
            return this.transform.forward;
        }
        else{
            return this.transform.localPosition;
        }
    }

    public get isDirty():boolean{
        return this.transform.isDirty && this.m_lightParamDirty;
    }

    public set isDirty(v:boolean){
        if(v){
            this.m_lightParamDirty =true;
        }
        else{
            this.m_lightParamDirty = false;
        }
    }

    public constructor(type:LightType,intensity?:number,color?:vec3){
        super();
        this.lightType = type;
        if(intensity) this.intensity = intensity;
        if(color) this.lightColor = color;

        GameContext.current.registerLight(this);
    }

    public static createPointLight(gobj:GameObject,range:number = 10,position?:vec3,intensity?:number,color?:vec3){
        let light = new Light(LightType.point,intensity,color);
        gobj.addComponent(light);
        if(position) light.transform.localPosition = position;
        light.lightRange = range;
        return light;
    }

    public static creatDirctionLight(gobj:GameObject,intensity:number = 1.0,dir:vec3 = vec3.down,color:vec3 = vec3.one){
        let light = new Light(LightType.direction,intensity,color);
        gobj.addComponent(light);
        light.transform.forward = dir.Normalize();
        light.castShadow = true;
        return light;
    }
    public onUpdate(){
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
