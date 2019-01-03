import { GLProgram } from "./GLProgram";
import { GLPipelineState } from "./GLPipelineState";
import { GLFenceSync } from "./GLFenceSync";
import { FrameBuffer } from "./FrameBuffer";
import { GL, GLSizeOrData } from "./GL";
import { MeshIndicesDesc } from "../Mesh";
import { ShaderTags, BlendOperator, BlendFactor } from "../shaderfx/Shader";
import { Utility } from "../Utility";
import { i32, f32 } from "../math/GLMath";

export class GLContext {
    private m_glFenceSynces:GLFenceSync[] = [];

    private m_curfb:FrameBuffer;
    private m_readfb:FrameBuffer;
    private m_drawfb:FrameBuffer;
    private m_viewport:number[] = [0,0,0,0];
    private m_clearDepth:number;

    private m_pipelineState:ShaderTags;

    private gl: WebGL2RenderingContext;
    private constructor(wgl: WebGL2RenderingContext) {
        this.gl = wgl;
        this.viewport(0,0,wgl.canvas.clientWidth,wgl.canvas.clientHeight);
        this.m_pipelineState = new ShaderTags();
    }

    public get canvasWidth():number{return this.gl.canvas.clientWidth;}
    public get canvasHeight():number{return this.gl.canvas.clientHeight;}
    public get bindingFBO():FrameBuffer{ return this.m_curfb;}
    public get bindingReadFBO():FrameBuffer {return this.m_readfb;}
    public get bindingDrawFBO():FrameBuffer{ return this.m_drawfb;}

    public static createFromGL(wgl: WebGL2RenderingContext): GLContext {
        return new GLContext(wgl);
    }
    
    public static createFromCanvas(canvas: HTMLCanvasElement, attrib?: WebGLContextAttributes): GLContext | null {
        let g: any = canvas.getContext('webgl2', attrib);
        if (g == null) {
            g = canvas.getContext('webgl');
        }
        if (g == null) return null;
        return new GLContext(g);
    }

    public getWebGLRenderingContext():WebGL2RenderingContext{
         return this.gl;
    }

    public createGLProgram(vsource: string, psource: string): GLProgram | null {

        let gl = this.gl;
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsource);
        gl.compileShader(vs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error(Utility.StrAddLineNum(vsource));
            console.error('compile vertex shader failed: ' + gl.getShaderInfoLog(vs));
            gl.deleteShader(vs);
            return null;
        }

        let ps = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(ps, psource);
        gl.compileShader(ps);

        if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
            console.error(Utility.StrAddLineNum(psource));
            console.error('compile fragment shader failed: ' + gl.getShaderInfoLog(ps));
            gl.deleteShader(ps);
            return null;
        }

        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, ps);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(Utility.StrAddLineNum(vsource));
            console.error(Utility.StrAddLineNum(psource));
            console.error('link shader program failed!:' + gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            gl.deleteShader(vs);
            gl.deleteShader(ps);
            return null;
        }

        if (program == null) return null;

        let p = new GLProgram(gl, program);
        return p;
    }



    public bindGLFramebuffer(fb:FrameBuffer):boolean{
        if(this.m_curfb == fb) return false;
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER,fb != null? fb.rawobj:null);
        this.m_curfb = fb;
        return true;
    }

    public bindReadFrameBuffer(fb:FrameBuffer):boolean{
        if(this.m_readfb == fb) return false;
        const gl = this.gl;
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER,fb != null? fb.rawobj:null);
        this.m_readfb = fb;
        return true;
    }

    public bindDrawFrameBuffer(fb:FrameBuffer):boolean{
        if(this.m_drawfb == fb) return false;
        const gl = this.gl;
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER,fb != null? fb.rawobj:null);
        this.m_drawfb = fb;
        return true;
    }

    public blitFramebuffer(srcX0: number, srcY0: number, srcX1: number, srcY1: number, dstX0: number, dstY0: number,
        dstX1: number, dstY1: number, mask: number, filter: number) {
        let readfb = this.m_readfb;
        let drawfb =this.m_drawfb;
        if(readfb == drawfb){
            throw new Error('blitFrameBuffer error: read/draw framebuffer are equal!');
        }
        const gl = this.gl;
        gl.blitFramebuffer(srcX0, srcY0, srcX1, srcY1, dstX0, dstY0, dstX1, dstY1, mask, filter);
    }

    public viewport(x:number,y:number,w:number,h:number){
        let vp = this.m_viewport;
        if(vp[2] == w && vp[3] == h && vp[0] == x && vp[1] == y) return;

        const gl = this.gl;
        gl.viewport(x,y,w,h);
        vp[0] = x;
        vp[1] = y;
        vp[2] = w;
        vp[3] = h;
    }

    public savePipeline(...type: number[]): GLPipelineState {
        return new GLPipelineState(this.gl, ...type);
    }

    public restorePipeline(state: GLPipelineState) {
        if (state == null) return;
        state.restore(this.gl);
    }

    public colorMask(red: GLboolean, green: GLboolean, blue: GLboolean, alpha: GLboolean){
        this.gl.colorMask(red,green,blue,alpha);
    }
    public colorEnable(enable:boolean){
        this.gl.colorMask(enable,enable,enable,enable);
    }

    public useProgram(program:WebGLProgram | null){
        this.gl.useProgram(program);
    }

    public useGLProgram(program:GLProgram){
        this.gl.useProgram(program.Program);
    }

    public uniformBlockBinding(program: WebGLProgram, uniformBlockIndex: number, uniformBlockBinding: number):void{
        this.gl.uniformBlockBinding(program,uniformBlockIndex,uniformBlockBinding);
    }

    public createBuffer():WebGLBuffer{
        return this.gl.createBuffer();
    }

    public deleteBuffer(buffer: WebGLBuffer | null){
        this.gl.deleteBuffer(buffer);
    }

    public createBufferAndBind(target:number){
        const gl = this.gl;
        let buffer= gl.createBuffer();
        gl.bindBuffer(target,buffer);
        return buffer;
    }

    public bindBuffer(target:number,buffer:WebGLBuffer| null){
        this.gl.bindBuffer(target,buffer);
    }

    public bufferData(target:number,sizeOrData:GLSizeOrData,usage:number){
        this.gl.bufferData(target,sizeOrData,usage);
    }

    public fenceSync(condition: number, flags: number):WebGLSync{
        return this.gl.fenceSync(condition,flags);
    }
    public isSync(sync: WebGLSync | null): boolean{
        return this.gl.isSync(sync);
    }
    public deleteSync(sync: WebGLSync | null){
        this.gl.deleteSync(sync);
    }
    public clientWaitSync(sync: WebGLSync, flags: number, timeout: number): number{
        return this.gl.clientWaitSync(sync,flags,timeout);
    }
    public waitSync(sync: WebGLSync, flags: number, timeout: number){
        this.gl.waitSync(sync,flags,timeout);
    }
    public getSyncParameter(sync: WebGLSync, pname: number): any{
        return this.gl.getSyncParameter(sync,pname);
    }

    public deleteTexture(texture: WebGLTexture | null){
        this.gl.deleteTexture(texture);
    }
    public createTexture(): WebGLTexture{
        return this.gl.createTexture();
    }

    public createVertexArray(): WebGLVertexArrayObject | null{
        return this.gl.createVertexArray();
    }
    public deleteVertexArray(vertexArray: WebGLVertexArrayObject | null){
        this.gl.deleteVertexArray(vertexArray);
    }
    public isVertexArray(vertexArray: WebGLVertexArrayObject | null): boolean{
        return this.gl.isVertexArray(vertexArray);
    }
    public bindVertexArray(array: WebGLVertexArrayObject | null){
        this.gl.bindVertexArray(array);
    }
    public depthFunc(func: number){
        let state =this.m_pipelineState;
        if(state.ztest == func) return;
        state.ztest = func;
        this.gl.depthFunc(func);
    }
    public depthMask(flag: boolean){
        let state =this.m_pipelineState;
        if(state.zwrite == flag) return;
        state.zwrite = flag;
        this.gl.depthMask(flag);
    }
    public depthRange(zNear: number, zFar: number){
        this.gl.depthRange(zNear,zFar);
    }
    public enable(cap: number){
        this.gl.enable(cap);
    }

    public disable(cap:number){
        this.gl.disable(cap);
    }


    public pipelineBlend(enable:boolean){
        let state = this.m_pipelineState;
        if(state.blend == enable) return;
        state.blend = enable;
        if(enable){
            this.gl.enable(GL.BLEND);
        }
        else{
            this.gl.disable(GL.BLEND);
        }
    }

    public pipelineBlendParam(op:BlendOperator|number,srcfactor:BlendFactor |number,dstfactor:BlendFactor| number){
        const gl =this.gl;
        const state = this.m_pipelineState;
        if(state.blendOp != op){
            gl.blendEquation(op);
            state.blendOp = op;
        }
        if(state.blendFactorSrc != srcfactor || state.blendFactorDst != dstfactor){
            gl.blendFunc(srcfactor,dstfactor);
            state.blendFactorDst = dstfactor;
            state.blendFactorSrc = srcfactor;
        }
    }

    public cullFace(mode:number){
        let state = this.m_pipelineState;
        if(state.culling == mode) return;
        state.culling = mode;
        this.gl.cullFace(mode);
    }

    public pipelineState(tag:ShaderTags){
        if(tag == null) return;

        if(tag.ztest != null) this.depthFunc(tag.ztest);
        if(tag.zwrite !=null) this.depthMask(tag.zwrite);

        const blend = tag.blend;
        if(blend !=null){
            this.pipelineBlend(blend);
            if(blend){
                this.pipelineBlendParam(tag.blendOp,tag.blendFactorSrc,tag.blendFactorDst);
            }
        }
        if(tag.culling != null){
            this.cullFace(tag.culling);
        }
    }

    public clear(mask:number){
        this.gl.clear(mask);
    }
    public clearColor(r:number,g:number,b:number,a:number){
        this.gl.clearColor(r,g,b,a);
    }

    public clearColorAry(raw:number[]){
        this.gl.clearColor(raw[0],raw[1],raw[2],raw[3]);
    }

    public clearDepth(depth:number){
        if(this.m_clearDepth == depth) return;
        this.gl.clearDepth(depth);
        this.m_clearDepth = depth;
    }

    public registFenceSync(fs:GLFenceSync){
        this.m_glFenceSynces.push(fs);
    }
    public unregistFenceSync(fs:GLFenceSync):boolean{
        let syncs = this.m_glFenceSynces;

        let index = syncs.indexOf(fs);
        if(index >=0 ){
            syncs.splice(index,1);
            return true;
        }
        return false;
    }
    public checkAllFenceSync(){
        let syncs = this.m_glFenceSynces;
        let len = syncs.length;
        if(len == 0) return;
        let remains:GLFenceSync[] = [];

        let changed = false;
        for(let t=0;t< len;t++){
            let s = syncs[t];
            if(!s.checkSignaled(true)){
                changed = true;
                remains.push(s);
            }
        }
        if(changed){
            this.m_glFenceSynces = remains;
        }
    }
    public bindBufferBase(target: number, index: number, buffer: WebGLBuffer | null){
        this.gl.bindBufferBase(target,index,buffer);
    }
    public bindBufferRange(target: number, index: number, buffer: WebGLBuffer | null, offset: number, size: number){
        this.gl.bindBufferRange(target,index,buffer,offset,size);
    }
    
    public drawElementIndices(desc:MeshIndicesDesc){
        this.gl.drawElements(desc.topology,desc.indiceCount,desc.type,desc.offset);
    }

    public polygonOffset(factor:number,units:number){
        this.gl.polygonOffset(factor,units);
    }

    //texture

    public activeTexture(texture:number){
        this.gl.activeTexture(texture);
    }

    public bindTexture(target:number,tex:WebGLTexture){
        this.gl.bindTexture(target,tex);
    }
    public texStorage2D(target:number,level:number,format:number,width:number,height:number){
        this.gl.texStorage2D(target,level,format,width,height);
    }
    public texImage2D(target:i32,level:i32,internalfmt:i32,width:i32,height:i32,border:i32,format:i32,type:i32,pixels:any){
        this.gl.texImage2D(target,level,internalfmt,width,height,border,format,type,pixels);
    }
    public texParameteri(target: i32, pname: i32, param: i32){
        this.gl.texParameteri(target,pname,param);
    }
    public texParameterf(target: i32, pname: i32, param: f32){
        this.gl.texParameterf(target,pname,param);
    }

    public generateMipmap(target:i32){
        this.gl.generateMipmap(target);
    }

    public createShader(type:i32):WebGLShader{
        return this.gl.createShader(type);
    }
    public shaderSource(shader:WebGLShader,source:string){
        this.gl.shaderSource(shader,source);
    }
    public compileShader(shader:WebGLShader){
        this.gl.compileShader(shader);
    }
    public getShaderParameter(shader:WebGLShader,type:i32){
        this.gl.getShaderParameter(shader,type);
    }
    public getShaderInfoLog(shader:WebGLShader){
        this.gl.getShaderInfoLog(shader);
    }
    public deleteShader(shader:WebGLShader){
        this.gl.deleteShader(shader);
    }
    public createProgram():WebGLProgram{
        return this.gl.createProgram();
    }
    public attachShader(program:WebGLProgram,shader:WebGLShader){
        this.gl.attachShader(program,shader);
    }
    public linkProgram(program:WebGLProgram){
        this.gl.linkProgram(program);
    }
    public getProgramParameter(program:WebGLProgram,target:i32){
        return this.gl.getProgramParameter(program,target);
    }
    public getProgramInfoLog(program:WebGLProgram):string{
        return this.gl.getProgramInfoLog(program);
    }
    public deleteProgram(program:WebGLProgram){
        this.gl.deleteProgram(program);
    }

    public createFramebuffer():WebGLFramebuffer{
        return this.gl.createFramebuffer();
    }

    public deleteFramebuffer(fb:WebGLFramebuffer){
        this.gl.deleteFramebuffer(fb);
    }

    public framebufferTexture2D(target: i32, attachment: i32, textarget: i32, texture: WebGLTexture | null, level: i32){
        this.gl.framebufferTexture2D(target,attachment,textarget,texture,level);
    }

    public bindFramebuffer(target:i32,fb:WebGLFramebuffer){
        this.gl.bindFramebuffer(target,fb);
    }

}
