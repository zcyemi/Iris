import { GraphicsRender, GraphicsRenderCreateInfo } from "../core/GraphicsRender";
import { RenderNodeList } from "../core/RenderNodeList";
import { FrameBuffer } from "../gl/FrameBuffer";
import { GLContext } from "../gl/GLContext";
import { IRenderModel } from "./IRenderModel";

export enum PipelineFeatureType{
    ZPrePass = 0,
}


export class PipelineFeatures{

    private m_featureEnable:{[key:number]:boolean} = {};
    private m_featureValue:{[key:string]:any} = {};

    public isEnable(t:PipelineFeatureType):boolean{
        var val = this.m_featureEnable[t];
        return val == true;
    }

    public setFeatureStatus(t:PipelineFeatureType,enable:boolean){
        this.m_featureEnable[t] = enable;
    }

    public getFeatureValue(property:string):any{
        return this.m_featureValue[property];
    }
    public setFeatureValue(property:string,value:any){
        this.m_featureEnable[property] = value;
    }
}


export interface IRenderPipeline{
    graphicRender:GraphicsRender;
    glctx:GLContext;
    nodeList:RenderNodeList;
    model:IRenderModel;
    mainFrameBuffer:FrameBuffer;

    resizeFrameBuffer(width:number,height:number);
    
    exec();
    onRenderToCanvas();

    
    onSetupRender(glctx:GLContext,info:GraphicsRenderCreateInfo);
    reload();
    release();
}


