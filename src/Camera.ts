import { Transform } from "./Transform";
import { mat4, vec3, vec4, glmath } from "wglut";


export enum AmbientType{
    Background,
    AmbientColor
}


export enum ProjectionType{
    perspective,
    orthographic,
}

export class Camera{

    public enabled:boolean = true;
    public order:number = 0;

    public transform:Transform;

    private m_fov:number = 60;
    private m_aspectratio:number;
    private m_near:number;
    private m_far:number;

    public orthosize:number = 10.0;
    public m_projectionType:ProjectionType;

    private m_projMtx:mat4;
    private m_worldMtx:mat4;


    private m_background:vec4 = vec4.zero;
    private m_ambientColor:vec4 = glmath.vec4(0.1,0.1,0.1,1.0);
    private m_ambientType:AmbientType = AmbientType.AmbientColor;


    public get far():number{
        return this.m_far;
    }
    public get near():number{
        return this.m_near;
    }

    public ambientDataDirty:boolean = true;
    public get ambientColor():vec4{
        return this.m_ambientColor;
    }
    public set ambientColor(v:vec4){
        this.m_ambientColor = v;
        this.ambientDataDirty = true;
    }
    public get background():vec4{
        return this.m_background;
    }
    public set background(v:vec4){
        this.m_background = v;
        if(this.m_ambientType == AmbientType.Background){
            this.ambientDataDirty = true;
        }
    }
    public get ambientType():AmbientType{
        return this.m_ambientType;
    }
    public set ambientType(t:AmbientType){
        if(this.m_ambientType == t) return;
        this.m_ambientType = t;
        this.ambientDataDirty =true;
    }


    public worldRHS:boolean = true;

    public get WorldMatrix():mat4{
        let trs = this.transform;
        if(trs.isDirty){
            trs.setDirty(false);
            this.m_worldMtx = mat4.coordCvt(trs.position,trs.forward,trs.up);
        }
        return this.m_worldMtx;
    }

    public get ProjMatrix():mat4{
        return this.m_projMtx;
    }

    public constructor(){
        this.transform= new Transform();
        this.m_projMtx = mat4.perspectiveFoV(60,1,0.01,100);
        this.m_projectionType = ProjectionType.perspective;
    }

    public static persepctive(fov:number,aspectratio:number,near:number,far:number):Camera{
        let camera = new Camera();
        camera.m_fov = fov;
        camera.m_aspectratio = aspectratio;
        camera.m_near= near;
        camera.m_far = far;

        camera.transform = new Transform();
        camera.m_projMtx = mat4.perspectiveFoV(fov,aspectratio,near,far);
        camera.m_projectionType = ProjectionType.perspective;

        return camera;
    }

    public static orthographic(size:number,aspectratio:number,near:number,far:number){
        let camera = new Camera();
        camera.m_aspectratio = aspectratio;
        camera.m_near =near;
        camera.m_far = far;

        camera.transform =new Transform();
        camera.orthosize = size;
        let w = size *aspectratio;
        camera.m_projMtx = mat4.orthographic(w,size,near,far);
        camera.m_projectionType = ProjectionType.orthographic;

        return camera;
    }
}
