import { GLProgram } from "./GLProgram";
import { GLFrameBuffer } from "./GLFrameBuffer";
import { GLPipelineState } from "./GLPipelineState";
import { GLFenceSync } from "./GLFenceSync";
import { FrameBuffer } from "./FrameBuffer";
import { GL, GLSizeOrData } from "./GL";

export class GLContext {
    private m_glFenceSynces:GLFenceSync[] = [];

    private m_curfb:FrameBuffer;
    private m_readfb:FrameBuffer;
    private m_drawfb:FrameBuffer;
    private m_viewport:number[] = [0,0,0,0];

    private gl: WebGL2RenderingContext;
    private constructor(wgl: WebGL2RenderingContext) {
        this.gl = wgl;
        this.viewport(0,0,wgl.canvas.clientWidth,wgl.canvas.clientHeight);
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

    public createProgram(vsource: string, psource: string): GLProgram | null {

        let gl = this.gl;
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsource);
        gl.compileShader(vs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error(vsource);
            console.error('compile vertex shader failed: ' + gl.getShaderInfoLog(vs));
            gl.deleteShader(vs);
            return null;
        }

        let ps = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(ps, psource);
        gl.compileShader(ps);

        if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
            console.error(psource);
            console.error('compile fragment shader failed: ' + gl.getShaderInfoLog(ps));
            gl.deleteShader(ps);
            return null;
        }

        let program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, ps);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
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

    public createFrameBuffer(retain: boolean, colorInternalFormat: number, depthInternalFormat?: number, width?: number, height?: number,glfb?:GLFrameBuffer): GLFrameBuffer | null {
        return GLFrameBuffer.create(retain, this, colorInternalFormat, depthInternalFormat, width, height,glfb);
    }

    public bindFramebuffer(fb:FrameBuffer):boolean{
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
        this.gl.depthFunc(func);
    }
    public depthMask(flag: boolean){
        this.gl.depthMask(flag);
    }
    public depthRange(zNear: number, zFar: number){
        this.gl.depthRange(zNear,zFar);
    }
    public enable(cap: number){
        this.gl.enable(cap);
    }
    public clear(mask:number){
        this.gl.clear(mask);
    }
    public clearColor(r:number,g:number,b:number,a:number){
        this.gl.clearColor(r,g,b,a);
    }

    /**
     * Do not call this function explicitly
     * @param fs 
     */
    public registFenceSync(fs:GLFenceSync){
        this.m_glFenceSynces.push(fs);
    }

    /**
     * Do not call this function explicitly
     * @param fs 
     */
    public unregistFenceSync(fs:GLFenceSync):boolean{
        let syncs = this.m_glFenceSynces;

        let index = syncs.indexOf(fs);
        if(index >=0 ){
            syncs.splice(index,1);
            return true;
        }
        return false;
    }

    /**
     * check statu of all registed GLFenceScene
     */
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

}
