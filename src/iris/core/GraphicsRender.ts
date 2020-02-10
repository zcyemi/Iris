import { ShadowConfig } from "../rendering/Shadow";
import { Delayter } from "./Utility";
import { Texture2D } from "./Texture2D";
import { Material } from "./Material";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";
import { GLContext } from "../gl/GLContext";
import { GL } from "../gl/GL";
import { vec2 } from "../math/GLMath";
import { Gizmos } from "./Gizmos";
import { GLCmdData, GLCmdRecord } from "../gl/GLCmdRecord";

export class GraphicsRenderCreateInfo{
    public colorFormat:number = 0x8058;
    public depthFormat:number = 0x81A6;
    public frameBufferResizeDelay:number = 250;
}

export class GraphicsRender{
    private m_glctx:GLContext;
    private canvas:HTMLCanvasElement;
    private m_creationInfo:GraphicsRenderCreateInfo;
    private m_defaultTexture:Texture2D;

    public readonly gizmos:Gizmos;

    public static globalRender:GraphicsRender;

    public static readonly TEXID_FB:number = 0;
    public static readonly TEXID_TEMP:number = 2;
    public static readonly TEXID_DEFAULT_TEX:number = 3;
    public static readonly TEXID_SHADER_TEX:number[] = [4,5,6,7,8,9,10,11];
    public static readonly TEXID_SHADOW_MAP:number[] = [15,16,17,18];

    private m_renderPipeline:IRenderPipeline;
    public shadowConfig:ShadowConfig = new ShadowConfig();

    public pause:boolean = false;
    private m_frameBufferInvalid:boolean = false;

    public get isFrameBufferInvalid():boolean{ return this.m_frameBufferInvalid;}

    private m_valid:boolean = false;


    private m_screenWidth:number;
    private m_screenHeight:number;

    public get screenWidth():number{ return this.m_screenWidth;}
    public get screenHeight():number{ return this.m_screenHeight;}

    private m_glCmdRecord:GLCmdRecord;
    private m_glCmdDebug:boolean = false;
    public get lastGLCmdRecord():GLCmdRecord{ return this.m_glCmdRecord;}

    public get pipeline():IRenderPipeline{
        return this.m_renderPipeline;
    }


    public get glctx():GLContext{
        return this.m_glctx;
    }

    public get defaultTexture():Texture2D{
        return this.m_defaultTexture;
    }


    public constructor(canvas:HTMLCanvasElement,pipeline?:IRenderPipeline,creationInfo?:GraphicsRenderCreateInfo){
        GraphicsRender.globalRender = this;

        let canvas_parent = canvas.parentElement;
        if(canvas_parent!=null){
            canvas.width = canvas_parent.clientWidth;
            canvas.height= canvas_parent.clientHeight;
        }
        
        this.canvas = canvas;
        this.gizmos = new Gizmos();

        this.m_screenWidth = canvas.clientWidth;
        this.m_screenHeight = canvas.clientHeight;

        if(creationInfo == null){
            creationInfo = new GraphicsRenderCreateInfo();
            this.m_creationInfo = creationInfo;
        }
        var glctx = <GLContext>GLContext.createFromCanvas(canvas, {
            antialias: true,
            alpha: false,
            depth: false,
            stencil:false
        });
        this.m_glctx = glctx;

        //default texture
        Material.DEF_TEXID_NUM = GraphicsRender.TEXID_DEFAULT_TEX;
        Texture2D.TEMP_TEXID = GL.TEXTURE2;
        
        this.m_defaultTexture = Texture2D.crateEmptyTexture(2,2,glctx);
        glctx.activeTexture(GL.TEXTURE3);
        glctx.bindTexture(GL.TEXTURE_2D,this.m_defaultTexture.getRawTexture());
        glctx.frontFace(GL.CCW);
        this.setPipeline(pipeline);
    }

    public debugNextFrameGL(){
        this.m_glCmdDebug = true;

        console.log('start debug');
    }


    public setPipeline(pipeline:IRenderPipeline){
        if(pipeline == null) return;
        let curpipeline = this.m_renderPipeline;
        if(curpipeline != null){
            curpipeline.release();
            curpipeline = null;
        }
        pipeline.graphicRender = this;
        pipeline.onSetupRender(this.glctx,this.m_creationInfo);
        this.m_renderPipeline = pipeline;
        this.resizeCanvas(this.glctx.canvasWidth,this.glctx.canvasHeight);

        this.m_valid = true;
    }

    public reload(){
        let renderpipeline = this.m_renderPipeline;
        if(renderpipeline != null) renderpipeline.reload();
    }

    public release(){
        let renderpipe = this.m_renderPipeline;
        if(renderpipe !=null){
            renderpipe.release();
            this.m_renderPipeline = null;
        }
        this.m_valid = false;
    }

    private m_resizeDelayter: Delayter = new Delayter();
    public resizeCanvas(w:number,h:number){
        let canvas = this.canvas;
        if(canvas.width == w && canvas.width == h) return;

        if(w <=0 || h <=0){
            this.m_frameBufferInvalid = true
            return;
        }
        else{
            this.m_frameBufferInvalid = false;
        }

        if(!this.m_valid) return;

        const self =this;

        
        let delay = this.m_creationInfo.frameBufferResizeDelay;
        if(delay == 0){
            canvas.width = w;
            canvas.height = h;
            self.doResizeFrameBuffer(w,h);
            return;
        }
        else{
            let delayter=  this.m_resizeDelayter;
            delayter.delaytime = delay;
            delayter.emit(()=>{
                canvas.width = w;
                canvas.height = h;
                self.doResizeFrameBuffer(w,h);
            })
        }
    }

    private doResizeFrameBuffer(w:number,h:number){
        this.m_screenWidth = w;
        this.m_screenHeight = h;
        this.m_renderPipeline.resizeFrameBuffer(w,h);
    }


    public render(){
        if(this.pause || this.m_frameBufferInvalid) return;

        if(this.m_glCmdDebug) this.glctx.beginDebug();

        let p = this.pipeline;
        if(p != null){
            p.exec();
        }

        //this.lateRender();

        if(this.m_glCmdDebug){
            this.m_glCmdRecord = this.glctx.endDebug();
            this.m_glCmdDebug = false;
        }
    }

    private lateRender(){
        this.gizmos.onframe();
    }

    /**
     * return GLES view coord [-1,1]
     */
    public canvasCoordToViewCoord(pointerx:number,pointery:number):vec2{
        let x = pointerx / this.screenWidth *2.0 -1.0;
        let y = 1.0 - 2.0 *pointery / this.screenHeight;
        return new vec2([x,y]);
    }

    public renderToCanvas(){
        this.pipeline.onRenderToCanvas();
    }
}
