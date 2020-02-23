import { mat4, vec3, vec4 } from "../math/GLMath";
import { Ray } from "../math/Ray";
import { CommandBuffer, CommandBufferEvent } from "./CommandBuffer";
import { Component } from "./Component";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { Skybox } from "./Skybox";
import { ObjectUtil } from "./Utility";


export enum AmbientType{
    Background,
    AmbientColor
}

export enum ClearType{
    Background,
    Skybox,
    None,
}


export enum ProjectionType{
    perspective,
    orthographic,
}


export class CameraCommandList{
    public beforeOpaque:CommandBuffer[] = [];
    public afterOpaque:CommandBuffer[] = [];
    public beforeTransparent:CommandBuffer[] = [];
    public afterTransparent:CommandBuffer[] = [];
    public beforePostProcess:CommandBuffer[] = [];
    public afterPostProcess:CommandBuffer[] = [];
    
    public beforeGBuffer:CommandBuffer[] = [];
    public afterGBuffer:CommandBuffer[] = [];

    public add(evt:CommandBufferEvent,cmdbuf:CommandBuffer){
        let cmdlist:CommandBuffer[] = this[CommandBufferEvent[evt]];
        if(cmdlist.includes(cmdbuf)) return;
        cmdlist.push(cmdbuf);
    }

    public remove(evt:CommandBufferEvent,cmdbuf:CommandBuffer){
        let cmdlist:CommandBuffer[] = this[CommandBufferEvent[evt]];
        let index = cmdlist.indexOf(cmdbuf);
        if(index >=0){
            this[CommandBufferEvent[evt]] = cmdlist.splice(index,1);
        }
    }

    public clear(evt:CommandBufferEvent){
        this[CommandBufferEvent[evt]] = [];
    }
}


const KEY_isCmdClearDirty = 'isCmdClearDirty';
const KEY_isProjDirty = 'isProjDirty';

export class Camera extends Component{
    //flag for needs to rebuild clear command buffer
    public isCmdClearDirty:boolean = true;
    //flag for any projmtx parameter changed
    public isProjDirty:boolean = true;
    //flag for needs to update camera uniform buffer with proj data
    public isDataProjChanged:boolean = true;
    //flag for needs to update camera uniform buffer with view data

    private m_isDataViewChanged:boolean = true;
    public get isDataViewChanged():boolean{
        let value = this.m_isDataViewChanged;
        if(!value && this.transform.isDirty){
            value = true;
            this.m_isDataViewChanged = true;
        }
        return value;
    }
    public set isDataViewChanged(val:boolean){
        this.m_isDataViewChanged = val;
    }

    //Clear Data
    public skybox:Skybox = ObjectUtil.initProperty(this,'skybox',null,KEY_isCmdClearDirty);
    public clearType:ClearType = ObjectUtil.initProperty(this,'clearType',ClearType.Background,KEY_isCmdClearDirty);
    public background:vec4 = ObjectUtil.initProperty(this,'background',vec4.zero,KEY_isCmdClearDirty);
    public clearDepth:boolean = ObjectUtil.initProperty(this,'clearDepth',true,KEY_isCmdClearDirty);
    public depthValue:number =  ObjectUtil.initProperty(this,'depthValue',0,KEY_isCmdClearDirty);

    //Projection
    public far:number = ObjectUtil.initProperty(this,'far',500,KEY_isProjDirty);
    public near:number = ObjectUtil.initProperty(this,'near',0.001,KEY_isProjDirty);
    public fov:number = ObjectUtil.initProperty(this,'fov',60,KEY_isProjDirty);
    
    public projectionType:ProjectionType = ObjectUtil.initProperty(this,'projectionType',ProjectionType.perspective,KEY_isProjDirty);
    public orthoSize:number = ObjectUtil.initProperty(this,'orthoSize',10.0,KEY_isProjDirty);

    private m_aspectValue:number = 1.0;
    private m_onTraceAspectRatio:boolean = false;
    public get aspect():number{
        return this.m_aspectValue;
    }

    public set aspect(val:number){
        if(val == null){
            if(this.m_onTraceAspectRatio) return;
            this.m_onTraceAspectRatio = true;
            GameContext.current.graphicsRender.evtOnScreenResize.register(this.onAspectRatioChange.bind(this));
        }
        else{
            if(this.m_onTraceAspectRatio){
                this.m_onTraceAspectRatio = false;
                GameContext.current.graphicsRender.evtOnScreenResize.remove(this.onAspectRatioChange);
            }
            
            this.m_aspectValue = val;
            this.isProjDirty = true;
        }
    }

    private onAspectRatioChange(val:number){
        if(this.m_onTraceAspectRatio){
            this.m_aspectValue = val;
            this.isProjDirty = true;
            this.isDataProjChanged = true;
        }
    }


    //Other
    public enabled:boolean = true;
    public order:number = 0;

    //Matrix
    private m_projMtx:mat4;
    private m_projMtxInv:mat4;
    private m_projParam:vec4;

    private updateProj(){
        if(!this.isProjDirty) return;
        this.m_projParam = null;
        this.m_projMtx= null;
        this.m_projMtxInv = null;
        this.isProjDirty=  false;
        this.isDataProjChanged = true;
    }
    public get ProjMatrix():mat4{
        this.updateProj();
        if(this.m_projMtx == null){

            if(this.projectionType == ProjectionType.perspective){
                this.m_projMtx = mat4.perspectiveFoV(this.fov,this.aspect,this.near,this.far);
            }
            else{
                let size =this.orthoSize;
                this.m_projMtx = mat4.orthographic(this.aspect * size,size,this.near,this.far);
            }
        }
        return this.m_projMtx;
    }
    public get ProjMatrixInv():mat4{
        this.updateProj();
        if(this.m_projMtxInv == null){
            this.m_projMtxInv = mat4.inverse(this.ProjMatrix);
        }
        return this.m_projMtxInv;
    }
    public get ProjParam():vec4{
        if(this.m_projParam == null){
            let near =this.near;
            let far = this.far;
            this.m_projParam = new vec4( [near,far,1.0/near,1.0/far]);
        }
        return this.m_projParam;
    }

    public get ViewMatrix():mat4{
        return this.transform.coordWorldToLocal;
    }
    public get WorldToCameraMatrix():mat4{ return this.ViewMatrix;}
    public get CameraToWorldMatrix():mat4{
        return this.transform.coordLocalToWorld;
    }
    public get ScreenToWorldMatrix():mat4{
        return this.CameraToWorldMatrix.mul(this.ProjMatrixInv);
    }

    //CommandBuffers
    private m_cmdBufferClear:CommandBuffer;
    public cmdList:CameraCommandList;

    public get CmdBufferClear():CommandBuffer{
        this.updateCommandBufferClear();
        return this.m_cmdBufferClear;
    }

    public constructor(){
        super();
        this.m_cmdBufferClear = new CommandBuffer("camera clear");
        this.cmdList = new CameraCommandList();

        GameContext.current.registerCamera(this);
    }

    public onDestroy(){
        GameContext.current.graphicsRender.evtOnScreenResize.remove(this.onAspectRatioChange);
        GameContext.current.unregisterCamera(this);
    }
    
    private updateCommandBufferClear(){
        if(!this.isCmdClearDirty) return;
        this.isCmdClearDirty = false;
        console.log("update camera cmdbuffer clear");
        let clearType =this.clearType;
        let cmdbuffer = this.m_cmdBufferClear;
        cmdbuffer.clear();
        let clearDpeth =this.depthValue;
        switch(clearType){
            case ClearType.None:
            break;
            case ClearType.Background:
            if(clearDpeth){
                cmdbuffer.clearColorDepth(this.background,this.depthValue);
            }
            else{
                cmdbuffer.clearColor(this.background);
            }
            break;
            case ClearType.Skybox:
                cmdbuffer.drawSkybox(this.skybox);
                if(clearDpeth){
                    cmdbuffer.clearDepthStencil(this.depthValue);
                }
            break;
        }
        cmdbuffer.submit();
    }

    public onUpdate(){
    }

    public static CreatePersepctive(fov:number,aspectratio:number,near:number,far:number):Camera{
        let camera = new Camera();
        camera.fov = fov;
        camera.aspect = aspectratio;
        camera.near= near;
        camera.far = far;
        camera.projectionType = ProjectionType.perspective;
        return camera;
    }

    public static CreateOrthographic(gobj:GameObject,size:number,aspectratio:number,near:number,far:number){
        let camera = new Camera();
        camera.aspect = aspectratio;
        camera.near =near;
        camera.far = far;
        camera.projectionType = ProjectionType.orthographic;
        camera.orthoSize = size;
        return camera;
    }

    public viewPointToRay(spos:vec3):Ray{
        let tarpos = this.ScreenToWorldMatrix.mulvec(spos.vec4(1.0));
        tarpos.div(tarpos.w);
        let pos = this.transform.position;
        let dir = new vec3(tarpos.raw).sub(pos).normalized;
        return Ray.fromPointDir(pos,dir);
    }
}
