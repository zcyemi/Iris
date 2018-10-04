import { RenderNodeList } from "./RenderNodeList";
import { GLContext, GLProgram, GLFrameBuffer } from "wglut";
import { Mesh } from "./Mesh";
import { Scene } from "./Scene";
import { GameObject } from "./GameObject";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { ShadowMapInfo } from "./pipeline/RenderTaskShadowMap";

export abstract class RenderPipeline{

    protected tasks:RenderTask[] = [];
    private m_tasksDirty:boolean = false;


    protected glctx:GLContext;
    protected gl:WebGL2RenderingContext;

    protected m_targetFrameBuffer:GLFrameBuffer;
    protected m_targetFrameBufferBinded:boolean= false;

    public shadowMapInfo: ShadowMapInfo[];


    public ubufferIndex_PerObj:number = 0;
    public ubufferIndex_PerCam:number = 1;
    public ubufferIndex_Light:number = 2;

    protected m_sharedBuffer_PerObj:WebGLBuffer;
    protected m_sharedBuffer_PerCam:WebGLBuffer;

    protected m_taskSetuped:boolean

    public constructor(glctx:GLContext){
        this.glctx = glctx;
        this.gl= glctx.gl;
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


    public registerTask(task:RenderTask){
        task.pipeline = this;
        this.tasks.push(task);
        if(!task.isInited){
            task.init();
        }
        this.m_tasksDirty = true;
    }

    public sortTasks(){
        if(this.m_tasksDirty) return;
        this.tasks.sort((a,b)=>{return a.order - b.order;});
        this.m_tasksDirty =false;
    }



    public exec(scene:Scene,glctx:GLContext,glfb:GLFrameBuffer){
        this.m_targetFrameBuffer = glfb;
        this.m_targetFrameBufferBinded = false;

        let nodeList = this.generateDrawList(scene);

        //exec task
        this.sortTasks();
        let tasks = this.tasks;

        for(let i=0,len = tasks.length;i<len;i++){
            let t = tasks[i];
            t.render(nodeList,scene,glctx);
        }

        this.UnBindTargetFrameBuffer();
        this.m_targetFrameBuffer = null;
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

    public bindTargetFrameBuffer(){
        if(this.m_targetFrameBufferBinded) return;
        this.m_targetFrameBuffer.bind(this.gl);
        this.m_targetFrameBufferBinded = true;

        //TODO
        this.gl.viewport(0,0,400,300);
    }

    public UnBindTargetFrameBuffer(){
        if(!this.m_targetFrameBufferBinded) return;

        let gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        this.m_targetFrameBufferBinded = false;
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
}



export class RenderTaskDeferredShading extends RenderTask{

    public init(){
    }

    public render(nodelist:RenderNodeList,scene:Scene){

    }

    public release(glctx:GLContext){

    }
}



export class RenderTaskOpaqueImageEffect extends RenderTask{

    public init(){

    }

    public render(nodelist:RenderNodeList,scene:Scene){

    }

    public release(glctx:GLContext){
        
    }
}

export class RenderTaskSkybox extends RenderTask{

    public init(){
        
    }


    public render(nodelist:RenderNodeList,scene:Scene){

    }

    public release(glctx:GLContext){
        
    }
}

export class RenderTaskTransparencies extends RenderTask{

    public init(){
        
    }


    public render(nodelist:RenderNodeList,scene:Scene){

    }

    public release(glctx:GLContext){
        
    }
}

export class RednerTaskImageEffect extends RenderTask{

    public init(){
        
    }


    public render(nodelist:RenderNodeList,scene:Scene){

    }

    public release(glctx:GLContext){
        
    }
}


