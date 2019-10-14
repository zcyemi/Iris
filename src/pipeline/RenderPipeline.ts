import { Scene } from "../core/Scene";
import { DoubleBuffered } from "../collection/DoubleBuffered";
import { RenderNodeList } from "../core/RenderNodeList";
import { PipelineUtility } from "./PipelineUtility";
import { mat4, vec4 } from "../math/GLMath";
import { RenderModel } from "./RenderModel";
import { IRenderPipeline } from "./IRenderPipeline";
import { GraphicsRender, GraphicsRenderCreateInfo } from "../core/GraphicsRender";
import { GLContext } from "../gl/GLContext";
import { FrameBuffer } from "../gl/FrameBuffer";
import { IRenderModel } from "./IRenderModel";


export interface PipelineClearInfo{
    color?:vec4;
    depth?:number;
    clearMask:number;
}


export interface RenderPipelineOpt{
    clearinfo?:PipelineClearInfo;
}


// /**
//  * @todo
//  * dependencies
//  * @class <GLFramebuffer>
//  * @class <RenderTexture>
//  * 
//  */
// export class RenderPipeline implements IRenderPipeline{

//     protected m_nodelist:DoubleBuffered<RenderNodeList>;
//     protected m_model:irendem;
//     protected m_graphicRender:GraphicsRender;
//     protected m_mainfb:FrameBuffer;
//     protected m_glctx:GLContext;
//     private m_clearInfo:PipelineClearInfo;

//     public get graphicRender():GraphicsRender{return this.m_graphicRender;}
//     public set graphicRender(val:GraphicsRender){this.m_graphicRender = val;}
//     public get model():IRenderModel { return this.m_model;}
//     public get nodeList():RenderNodeList{return this.m_nodelist.back;}
//     public get mainFrameBuffer():FrameBuffer{ return this.m_mainfb;}
//     public get glctx():GLContext{return this.m_glctx;}


//     public constructor(info:RenderPipelineOpt){
//         if(info != null){
//             this.m_clearInfo = info.clearinfo;
//         }
//     }

//     public onSetupRender(glctx:GLContext,info:GraphicsRenderCreateInfo){
//         this.m_nodelist = new DoubleBuffered(new RenderNodeList(),new RenderNodeList());
//         this.m_glctx = glctx;
//         this.m_model = new RenderModel(this);

//         let fb = FrameBuffer.create(glctx,glctx.canvasWidth,glctx.canvasHeight,{colFmt:info.colorFormat,depthFmt:info.depthFormat});
//         this.m_mainfb = fb;

//         this.onInitGL();
//     }

//     public onInitGL(){

//     };

//     public resizeFrameBuffer(){

//     }

//     public exec(data:any){
//         if(data == null) return;
//         if(!(data instanceof Scene)) return;
//         const camera = data.mainCamera;
//         if (camera == null) return;

//         let nodelist =this.m_nodelist;
//         nodelist.swap();

//         const model = this.m_model;
//         model.updateUniformBasis(camera);
//         const glctx = this.m_glctx;
//         //TODO
//         // model.uniformBasis.uploadBufferData(glctx);

//         let nodelistback = nodelist.back;
//         nodelistback.reset();
//         PipelineUtility.generateDrawList(data,nodelistback);


//         const mainfb = this.m_mainfb;
//         glctx.bindGLFramebuffer(mainfb);

//         model.clearFrameBufferTarget(this.m_clearInfo,mainfb);
//         //exec passes


//     }

//     public onRenderToCanvas(){
//         const glctx =this.m_glctx;
//         glctx.bindGLFramebuffer(null);
//         const mainfb = this.m_mainfb;
//         glctx.viewport(0,0,mainfb.width,mainfb.height);
//         this.m_model.drawFullScreen(this.m_mainfb.coltex);
//     }

//     public reload(){

//     }

//     public release(){

//     }

// }
