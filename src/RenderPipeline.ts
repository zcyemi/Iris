import { RenderNodeList } from "./RenderNodeList";
import { GLContext, GLProgram, GLFrameBuffer } from "wglut";
import { Mesh } from "./Mesh";
import { Scene } from "./Scene";
import { GameObject } from "./GameObject";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { ShadowMapInfo } from "./pipeline/RenderTaskShadowMap";
import { GraphicsRender, GraphicsRenderCreateInfo } from "./GraphicsRender";

export abstract class RenderPipeline{

    protected tasks:RenderTask[] = [];
    private m_tasksDirty:boolean = false;


    protected glctx:GLContext;
    protected gl:WebGL2RenderingContext;


    public shadowMapInfo: ShadowMapInfo[];


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
        let utex_sm_slot = [15,16,17,18];
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

        this.traversalRenderNode(nodelist,scene);

        nodelist.sort();

        this.m_nodelistIndex = nodelistIndex == 0?1:0;

        return nodelist;
    }
    private traversalRenderNode(drawlist:RenderNodeList,obj:GameObject){
        let children = obj.children;
        for(let i=0,len = children.length;i< len;i++){
            let c = children[i];

            if(!c.active) continue;
            let crender = c.render;

            if(crender != null && crender.mesh !=null){
                drawlist.pushRenderNode(crender);
            }
            
            let cc = c.children;
            if(cc != null && cc.length != 0){
                this.traversalRenderNode(drawlist,obj);
            }
        }
    }

    public refreshMeshBuffer(mesh:Mesh,program:GLProgram){
        let gl =this.gl;
        let attrs = program.Attributes;
        //init buffer
        let vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        mesh.m_vao = vao;

        //vertices
        let buffervert = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffervert);
        mesh.m_bufferVertices = buffervert;

        let totalData = new Float32Array(mesh.m_dateVerticesLen);
        let offset = 0;
        let offsetAry:number[] = [];

        let hasPosition: boolean = false;
        let hasUV: boolean = false;
        let hasNormal: boolean = false;

        if (mesh.m_dataPosition != null) {
            totalData.set(mesh.m_dataPosition, offset);
            hasPosition = true;
            offsetAry.push(offset);
            offset += mesh.m_dataPosition.length;
        }
        if (mesh.m_dataUV != null) {
            totalData.set(mesh.m_dataUV, offset);
            hasUV = true;
            offsetAry.push(offset);
            offset += mesh.m_dataUV.length;
        }
        if (mesh.m_dataNormal != null) {
            totalData.set(mesh.m_dataNormal, offset);
            hasNormal = true;
            offsetAry.push(offset);
            offset += mesh.m_dataNormal.length;
        }

        gl.bufferData(gl.ARRAY_BUFFER, totalData, gl.STATIC_DRAW);

        let attrIndex = 0;
        let aPostion = attrs[ShaderFX.ATTR_aPosition];
        if (hasPosition) {
            if(aPostion != null){
                gl.vertexAttribPointer(aPostion, 4, gl.FLOAT, false, 16,4*offsetAry[attrIndex]);
                gl.enableVertexAttribArray(aPostion);
            }
            attrIndex++;
        }
        let aUV = attrs[ShaderFX.ATTR_aUV];
        if(hasUV){
            if(aUV != null){
                let bufferOff = offsetAry[attrIndex];
                gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 8, 4*bufferOff);
                gl.enableVertexAttribArray(aUV);
            }
            attrIndex++;
        }
        let aNormal = attrs[ShaderFX.ATTR_aNormal];
        if(hasNormal && aNormal != null){
            if(aNormal != null){
                let bufferOff = offsetAry[attrIndex];
                gl.vertexAttribPointer(aNormal,4,gl.FLOAT,false,16, 4*bufferOff);
                gl.enableVertexAttribArray(aNormal);
            }
            attrIndex ++;
        }

        //indices
        let dataIndices = mesh.m_dataIndices;
        let hasIndices = dataIndices!= null && dataIndices.length != 0;
        if(hasIndices){
            let bufferIndices = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bufferIndices);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, dataIndices, gl.STATIC_DRAW);
            mesh.m_bufferIndices = bufferIndices;
        }
        gl.bindVertexArray(null);
        mesh.m_bufferInited = true;
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


