import { GameObject } from "./GameObject";
import { Component } from "./Component";
import { Scene } from "./Scene";
import { Skybox } from "./Skybox";
import { mat4, vec4, glmath, f32, vec3 } from "../math/GLMath";
import { Ray } from "../math/Ray";


export enum AmbientType{
    Background,
    AmbientColor
}

export enum ClearType{
    Background,
    Skybox,
}

export enum ProjectionType{
    perspective,
    orthographic,
}

export class Camera extends Component{

    public enabled:boolean = true;
    public order:number = 0;

    private m_fov:number = 60;
    private m_aspectratio:number;
    private m_near:number;
    private m_far:number;
    private m_projDirty:boolean = false;

    public orthosize:number = 10.0;
    public m_projectionType:ProjectionType;

    private m_projMtx:mat4;
    private m_projMtxInv:mat4;
    private m_worldToCamMtx:mat4;
    private m_camToWorldMtx:mat4;
    private m_screenToWorldMtx:mat4;

    private m_worldToCamMtxCalculated:boolean = false;

    private m_background:vec4 = vec4.zero;
    private m_ambientColor:vec4 = glmath.vec4(0.1,0.1,0.1,1.0);
    private m_ambientType:AmbientType = AmbientType.AmbientColor;
    private m_clearType:ClearType = ClearType.Background;

    private m_skybox:Skybox;

    private m_dataTrsDirty:boolean = true;
    public get isDataTrsDirty():boolean{
        return this.m_dataTrsDirty || this.transform.isDirty;
    }
    public set isDataTrsDirty(v:boolean){
        this.m_dataTrsDirty = v;
    }
    
    private m_dataProjDirty:boolean = true;
    public get isDataProjDirty():boolean{
        return this.m_dataProjDirty;
    }
    public set isDataProjDirty(v:boolean){
        this.m_dataProjDirty= v;
    }

    public get far():number{
        return this.m_far;
    }
    public set far(v:number){
        if(this.m_far == v) return;
        this.m_far = v;
        this.m_projDirty = true;
        this.m_dataProjDirty = true;
    }
    public get near():number{
        return this.m_near;
    }
    public set near(v:number){
        if(this.m_near == v) return;
        this.m_near = v;
        this.m_projDirty =true;
        this.m_dataProjDirty = true;
    }
    public get fov():number{
        return this.m_fov;
    }
    public set fov(v:number){
        if(this.m_fov == v) return;
        this.m_fov = v;
        this.m_projDirty = true;
        this.m_dataProjDirty = true;
    }
    public get aspect():number{
        return this.m_aspectratio;
    }
    public set aspect(v:number){
        if(v == this.m_aspectratio) return;
        this.m_aspectratio = v;
        this.m_projDirty = true;
        this.m_dataProjDirty = true;
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

    public get skybox():Skybox{
        return this.m_skybox;
    }
    public set skybox(skybox:Skybox){
        this.m_skybox = skybox;
    }

    public get clearType():ClearType{
        return  this.m_clearType;
    }

    public set clearType(t:ClearType){
        this.m_clearType = t;
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

    /** View matrix of camera */
    public get WorldMatrix():mat4{
        let trs = this.transform;
        if(!this.m_worldToCamMtxCalculated && trs.isDirty){
            this.m_worldToCamMtx = mat4.coordCvt(trs.position,trs.worldForward,trs.worldUp);
            this.m_camToWorldMtx = null;
            this.m_screenToWorldMtx = null;
            this.m_dataTrsDirty = true;
            this.m_worldToCamMtxCalculated = true;
        }
        return this.m_worldToCamMtx;
    }
    public get WorldToCameraMatrix():mat4{ return this.WorldMatrix;}
    public get CameraToWorldMatrix():mat4{
        let camToWorld = this.m_camToWorldMtx;
        if(camToWorld == null){
            camToWorld = mat4.inverse(this.WorldToCameraMatrix);
            this.m_camToWorldMtx = camToWorld;
        }
        return camToWorld;
    }

    public get ScreenToWorldMatrix():mat4{
        let mtx = this.m_screenToWorldMtx;
        if(mtx == null){
            mtx = this.CameraToWorldMatrix.mul(this.ProjMatrixInv);
            this.m_screenToWorldMtx = mtx;
        }
        return mtx;
    }

    /** Projection matrix of camera */
    public get ProjMatrix():mat4{
        if(this.m_projDirty){
            this.m_projMtx = mat4.perspectiveFoV(this.m_fov,this.m_aspectratio,this.m_near,this.m_far);
            this.m_projMtxInv = null;
            this.m_screenToWorldMtx;
            this.m_projDirty= false;
            this.m_dataProjDirty = true;
        }
        return this.m_projMtx;
    }

    public get ProjMatrixInv():mat4{
        let inv = this.m_projMtxInv;
        if(inv != null) return inv;
        inv = mat4.inverse(this.m_projMtx);
        if(!inv.isValid){
            throw new Error("invalid proj matrix");
        }
        this.m_projMtxInv = inv;
        return inv;
    }

    public viewPointToRay(spos:vec3):Ray{
        let tarpos = this.ScreenToWorldMatrix.mulvec(spos.vec4(1.0));
        tarpos.div(tarpos.w);
        let pos = this.transform.position;

        let dir = new vec3(tarpos.raw).sub(pos).normalized;

        return Ray.fromPointDir(pos,dir);
    }

    public constructor(){
        super();
        this.m_projMtx = mat4.perspectiveFoV(60,1,0.01,100);
        this.m_projMtxInv = null;
        this.m_projectionType = ProjectionType.perspective;
    }

    public onUpdate(scene:Scene){
        scene.mainCamera = this;
        this.m_worldToCamMtxCalculated = false;
    }

    public static persepctive(gobj:GameObject | null,fov:number,aspectratio:number,near:number,far:number):Camera{
        let camera = new Camera();
        camera.m_fov = fov;
        camera.m_aspectratio = aspectratio;
        camera.m_near= near;
        camera.m_far = far;

        if(gobj == null){
            gobj = new GameObject();
        }
        gobj.addComponent(camera);

        camera.m_projMtx = mat4.perspectiveFoV(fov,aspectratio,near,far);
        camera.m_projectionType = ProjectionType.perspective;
        let trs = gobj.transform;
        camera.m_worldToCamMtx = mat4.coordCvt(trs.localPosition,trs.worldForward,trs.worldUp);

        return camera;
    }

    public static orthographic(gobj:GameObject,size:number,aspectratio:number,near:number,far:number){
        let camera = new Camera();
        camera.m_aspectratio = aspectratio;
        camera.m_near =near;
        camera.m_far = far;

        if(gobj == null){
            gobj= new GameObject();
        }
        gobj.addComponent(camera);
        
        camera.orthosize = size;
        let w = size *aspectratio;
        camera.m_projMtx = mat4.orthographic(w,size,near,far);
        camera.m_projectionType = ProjectionType.orthographic;
        let trs = gobj.transform;
        camera.m_worldToCamMtx = mat4.coordCvt(trs.localPosition,trs.worldForward,trs.worldUp);

        return camera;
    }
}
