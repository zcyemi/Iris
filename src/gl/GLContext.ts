import { GLProgram } from "./GLProgram";
import { GLFrameBuffer } from "./GLFrameBuffer";
import { GLPipelineState } from "./GLPipelineState";
import { vec4 } from "../math/GLMath";
import { GLFenceSync } from "./GLFenceSync";

export class GLContext {
    private m_glFenceSynces:GLFenceSync[] = [];

    public gl: WebGL2RenderingContext;
    private constructor(wgl: WebGL2RenderingContext) {
        this.gl = wgl;
    }

    public get canvasWidth():number{
        return this.gl.canvas.clientWidth;
    }

    public get canvasHeight():number{
        return this.gl.canvas.clientHeight;
    }

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

    public savePipeline(...type: number[]): GLPipelineState {
        return new GLPipelineState(this.gl, ...type);
    }

    public restorePipeline(state: GLPipelineState) {
        if (state == null) return;
        state.restore(this.gl);
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
