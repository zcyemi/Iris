import { RenderNodeList } from "./RenderNodeList";
import { GLContext, GLProgram, GLFrameBuffer } from "wglut";
import { Mesh } from "./Mesh";
import { Scene } from "./Scene";
import { GameObject } from "./GameObject";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { ShadowMapInfo } from "./pipeline/RenderTaskShadowMap";
import { GraphicsRender, GraphicsRenderCreateInfo } from "./GraphicsRender";
import { ShaderDataUniformShadowMap } from "./shaderfx/ShaderFXLibs";
import { Transform } from "./Transform";
import { ShaderTags } from "./shaderfx/Shader";


export class PipelineStateCache{

    private m_curtags:ShaderTags;

    private m_deftags:ShaderTags;
    private m_lastTags:ShaderTags;

    private gl:WebGL2RenderingContext;

    public constructor(glctx:GLContext){
        this.gl = glctx.gl;
        this.m_curtags = new ShaderTags();
    }

    public reset(tags:ShaderTags){
        this.m_lastTags = null;

        let curtags = this.m_curtags;
        let gl = this.gl;
        if(tags.ztest!= null){
            let ztest = tags.ztest;
            if(curtags.ztest != ztest){
                curtags.ztest = ztest;
                gl.depthFunc(ztest);
            }
        }

        if(tags.culling != null){
            let culling = tags.culling;
            if(curtags.culling != culling){
                curtags.culling = culling;
                gl.cullFace(culling);
            }
        }

        if(tags.zwrite != null){
            let zwrite = tags.zwrite;
            if(curtags.zwrite != zwrite){
                curtags.zwrite =zwrite;
                gl.depthMask(zwrite);
            }
        }

        if(tags.blendOp != null){
            let blendop = tags.blendOp;
            if(curtags.blendOp != blendop){
                curtags.blendOp = blendop;
                if(blendop == null){
                    gl.disable(gl.BLEND);
                }
                else{
                    gl.enable(gl.BLEND);

                    let op = tags.blendOp;
                    let srcf = tags.blendFactorSrc;
                    let dstf = tags.blendFactorDst;

                }
            }
        }

        this.m_deftags= tags;
    }

    public apply(tags:ShaderTags){
        if(this.m_lastTags == tags) return;

        this.m_lastTags = tags;
    }
}

export abstract class RenderPipeline{

    protected tasks:RenderTask[] = [];
    private m_tasksDirty:boolean = false;


    protected glctx:GLContext;
    protected gl:WebGL2RenderingContext;


    public shadowMapInfo: ShadowMapInfo[];
    public shadowMapEnabled:boolean = false;


    public ubufferIndex_PerObj:number = 0;
    public ubufferIndex_PerCam:number = 1;
    public ubufferIndex_Light:number = 2;
    public ubufferIndex_ShadowMap:number =3;


    public utex_sm:number[];
    public utex_sm_slot:number[];

    protected m_sharedBuffer_PerObj:WebGLBuffer;
    protected m_sharedBuffer_PerCam:WebGLBuffer;
    protected m_sharedBuffer_ShadowMap:WebGLBuffer;

    protected m_taskSetup:boolean = false;

    public graphicRender:GraphicsRender;

    private m_mainFrameBuffer:GLFrameBuffer;
    private m_mainFrameBufferInfo:GraphicsRenderCreateInfo;
    protected m_mainFrameBufferBinded:boolean= false;

    public get mainFrameBufferWidth():number{
        return this.m_mainFrameBufferWidth;

    }
    public get mainFrameBufferHeight():number{
        return this.m_mainFrameBufferHeight;
    }
    public get mainFrameBufferAspect():number{
        return this.m_mainFrameBufferAspect;
    }

    private m_mainFrameBufferAspect:number = 1.0;
    private m_mainFrameBufferWidth:number = 0;
    private m_mainFrameBufferHeight:number = 0;

    public constructor(){

    }

    public onInitGL(glctx:GLContext){
        this.glctx = glctx;
        this.gl= glctx.gl;

        let gl = this.gl;

        let utex_sm = [];
        let utex_sm_slot = GraphicsRender.TEXID_SHADOW_MAP;
        utex_sm.push(gl.TEXTURE15);
        utex_sm.push(gl.TEXTURE16);
        utex_sm.push(gl.TEXTURE17);
        utex_sm.push(gl.TEXTURE18);
        this.utex_sm = utex_sm;
        this.utex_sm_slot = utex_sm_slot;
    }

    /**
     * render setup process, create main framebuffer
     * custom render can override this function
     * @param bufferinfo 
     */
    public onSetupRender(bufferinfo:GraphicsRenderCreateInfo){
        this.m_mainFrameBufferInfo = bufferinfo;

        let fb = this.glctx.createFrameBuffer(true,bufferinfo.colorFormat,bufferinfo.depthFormat);
        this.m_mainFrameBuffer = fb;

        let gl = this.glctx.gl;
        gl.depthMask(true);
        gl.depthFunc(gl.LEQUAL);
        gl.enable(gl.DEPTH_TEST);
    }

    public resizeFrameBuffer(width:number,height:number){
        let bufferInfo = this.m_mainFrameBufferInfo;
        this.m_mainFrameBuffer = this.glctx.createFrameBuffer(false,bufferInfo.colorFormat,bufferInfo.depthFormat,width,height,this.m_mainFrameBuffer);
        this.m_mainFrameBufferWidth =width;
        this.m_mainFrameBufferHeight = height;
        this.m_mainFrameBufferAspect = width/ height;
    }

    /**
     * draw main framebuffer to canvas buffer
     */
    public onRenderToCanvas(){
        this.glctx.drawTexFullscreen(this.m_mainFrameBuffer.colorTex0,false,false);
    }

    public get GLCtx():GLContext{
        return this.glctx;
    }
    public get GL():WebGL2RenderingContext{
        return this.gl;
    }

    public get sharedBufferPerCam():WebGLBuffer{
        let buf = this.m_sharedBuffer_PerCam;
        if(buf!= null) return buf;

        let gl = this.gl;
        buf = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER,buf);
        gl.bindBufferBase(gl.UNIFORM_BUFFER,this.ubufferIndex_PerCam,buf);
        this.m_sharedBuffer_PerCam = buf;
        return buf;
    }

    public get sharedBufferPerObj():WebGLBuffer{
        let buf = this.m_sharedBuffer_PerObj;
        if(buf!= null) return buf;

        let gl =this.gl;
        buf = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER,buf);
        gl.bindBufferBase(gl.UNIFORM_BUFFER,this.ubufferIndex_PerObj,buf);
        this.m_sharedBuffer_PerObj = buf;
        return buf;
    }

    public get sharedBufferShadowMap():WebGLBuffer{
        let buf = this.m_sharedBuffer_ShadowMap;
        if(buf != null) return buf;
        
        let gl =this.gl;
        buf = gl.createBuffer();
        gl.bindBuffer(gl.UNIFORM_BUFFER,buf);
        gl.bufferData(gl.UNIFORM_BUFFER,new ShaderDataUniformShadowMap().rawBuffer,gl.DYNAMIC_DRAW);
        gl.bindBufferBase(gl.UNIFORM_BUFFER,this.ubufferIndex_ShadowMap,buf);
        this.m_sharedBuffer_ShadowMap = buf;
        return buf;
    }


    public registerTask(task:RenderTask){
        task.pipeline = this;
        this.tasks.push(task);
        this.m_tasksDirty = true;
    }

    public sortTasks(){
        if(this.m_tasksDirty) return;
        this.tasks.sort((a,b)=>{return a.order - b.order;});
        this.m_tasksDirty =false;
    }

    private setupTasks(){
        let tasks = this.tasks;
        for(let i=0,len = tasks.length;i<len;i++){
            let t = tasks[i];
            if(!t.isInited){
                t.init();
            }
        }

    }


    public exec(scene:Scene){
        let glctx = this.glctx;
        this.m_mainFrameBufferBinded = false;

        let nodeList = this.generateDrawList(scene);

        //exec task
        this.sortTasks();

        if(!this.m_taskSetup){
            this.setupTasks();
            this.m_taskSetup = true;
        }

        let tasks = this.tasks;

        for(let i=0,len = tasks.length;i<len;i++){
            let t = tasks[i];
            t.render(nodeList,scene,glctx);
        }

        this.UnBindTargetFrameBuffer();
    }

    public release(){
        let glctx = this.glctx;
        let task = this.tasks;
        for(let i=0,len = task.length;i<len;i++){
            let t = task[i];
            t.release(glctx);
        }
        task = [];
    }

    public reload(){
        let glctx = this.glctx;
        let task = this.tasks;
        for(let i=0,len = task.length;i<len;i++){
            let t = task[i];
            t.reload(glctx);
        }
    }

    public bindTargetFrameBuffer(){
        if(this.m_mainFrameBufferBinded) return;
        let mainfb = this.m_mainFrameBuffer;
        mainfb.bind(this.gl);
        this.m_mainFrameBufferBinded = true;

        //TODO
        this.gl.viewport(0,0,mainfb.width,mainfb.height);
    }

    public UnBindTargetFrameBuffer(){
        if(!this.m_mainFrameBufferBinded) return;

        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        this.m_mainFrameBufferBinded = false;
    }

    private m_nodelist:RenderNodeList[] = [new RenderNodeList(),new RenderNodeList()];
    private m_nodelistIndex:number = 0;

    public generateDrawList(scene:Scene):RenderNodeList{
        let nodelistIndex = this.m_nodelistIndex;
        let nodelist = this.m_nodelist[nodelistIndex];
        nodelist.reset();

        this.traversalRenderNode(nodelist,scene.transform);

        nodelist.sort();

        this.m_nodelistIndex = nodelistIndex == 0?1:0;

        return nodelist;
    }
    private traversalRenderNode(drawlist:RenderNodeList,obj:Transform){
        let children = obj.children;
        if(children == null) return;
        for(let i=0,len = children.length;i< len;i++){
            let c = children[i];

            let cobj = c.gameobject;

            if(!cobj.active) continue;
            let crender = cobj.render;

            if(crender != null && crender.mesh !=null){
                drawlist.pushRenderNode(crender);
            }
            this.traversalRenderNode(drawlist,c);
        }
    }
}

export abstract class RenderTask{
    public order:number = 0;
    public name:string;
    public pipeline:RenderPipeline;

    protected m_inited:boolean = false;
    public get isInited():boolean{
        return this.m_inited;
    }

    public constructor(o:number,pipeline:RenderPipeline){
        this.order = o;
        this.pipeline = pipeline;
    }

    public init():void{
        this.m_inited = true;
    }

    public abstract render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext):void;
    public abstract release(glctx:GLContext):void;
    public abstract reload(glctx:GLContext):void;
}


