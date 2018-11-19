import { ShaderSource } from "./ShaderSource";
import { ShaderOptionsConfig } from "./ShaderVariant";
import { GLProgram } from "../gl/GLProgram";
import { GLContext } from "../gl/GLContext";

export enum RenderQueue{
    Opaque,
    Transparent,
    Skybox,
    Image,
    Other
}

export enum Comparison{
    NEVER = 512,
    LESS = 513,
    EQUAL = 514,
    LEQUAL = 515,
    GREATER = 516,
    NOTEQUAL = 517,
    GEQUAL = 518,
    ALWAYS = 519
}

export enum BlendOperator{
    ADD = 32774,
    MIN = 32775,
    MAX = 32776,
    SUBTRACT = 32778,
    RESERVE_SUBSTRACT = 32779,
}

export enum BlendFactor{
    ONE = 1,
    ZERO = 0,
    SRC_COLOR = 768,
    ONE_MINUS_SRC_COLOR = 769,
    SRC_ALPHA = 770,
    ONE_MINUS_SRC_ALPHA = 771,
    DST_ALPHA = 772,
    ONE_MINUS_DST_ALPHA = 773,
    DST_COLOR = 774,
    ONE_MINUS_DST_COLOR = 775,
    SRC_ALPHA_SATURATE = 776,
    
    CONSTANT_ALPHA = 32771,
    ONE_MINUS_CONSTANT_ALPHA = 32772,
    CONSTANT_COLOR = 32769,
    ONE_MINUS_CONSTANT_COLOR = 32770,
}

export enum CullingMode{
    Front = 0x0404,
    Back = 0x0405,
    FRONT_AND_BACK = 0x0408,
    None = 0x0B44,
}

export class ShaderTags{
    public queue?:RenderQueue;
    public ztest?:Comparison;
    public zwrite?:boolean;
    public blend:boolean = false;
    public blendOp?:BlendOperator;
    public blendFactorSrc?:BlendFactor;
    public blendFactorDst?:BlendFactor;
    public culling?:CullingMode;

    public clone(){
        let tags = new ShaderTags();
        tags.queue= this.queue;
        tags.ztest = this.ztest;
        tags.zwrite = this.zwrite;
        tags.blendOp = this.blendOp;
        tags.blendFactorDst = this.blendFactorDst;
        tags.blendFactorSrc = this.blendFactorSrc;
        tags.culling = this.culling;

        return tags;
    }

    public fillDefaultVal(){
        if(this.queue == null) this.queue = RenderQueue.Opaque;
        if(this.zwrite == null) this.zwrite = true;
        if(this.ztest == null) this.ztest = Comparison.LEQUAL;
        if(this.culling == null) this.culling = CullingMode.Back;

        if(this.blendOp == null) this.blendOp = BlendOperator.ADD;
        if(this.blendFactorSrc == null) this.blendFactorSrc = BlendFactor.SRC_ALPHA;
        if(this.blendFactorDst == null) this.blendFactorDst = BlendFactor.ONE_MINUS_SRC_ALPHA;
    }

    public toString():string{
        return `
            queue:${RenderQueue[this.queue]}
            ztest:${Comparison[this.ztest]}
            zwrite:${this.zwrite}
            blend:${this.blend}
            blendOp:${BlendOperator[this.blendOp]}
            blendSrc:${BlendFactor[this.blendFactorSrc]}
            blendDst:${BlendFactor[this.blendFactorDst]}
            culling:${CullingMode[this.culling]}
        `
    }
}

export class ShaderProgram{
    public hash:string;

    private glprogram:GLProgram;

    public get glProgram():WebGLProgram{
        return this.glprogram.Program;
    }
}

export class ShaderPass{
    public name:string;
    public program:ShaderProgram;
}

export class Shader{
    
    private m_source:ShaderSource;

    private m_defaultProgram:GLProgram;
    
    private m_compiledPrograms:{[hash:number]:GLProgram} = {};
    public tags:ShaderTags;

    public m_defaultOptionsConfig:ShaderOptionsConfig;

    private m_glctx:GLContext;

    public constructor(source:ShaderSource,defaultProgram:GLProgram,defOptConfig:ShaderOptionsConfig,glctx:GLContext){
        this.m_source =source;
        this.m_defaultProgram = defaultProgram;
        this.m_defaultOptionsConfig = defOptConfig;
        this.m_compiledPrograms[defOptConfig.hashCode] = defaultProgram;
        this.m_glctx = glctx;
    }
    public get source():ShaderSource{
        return this.m_source;
    }
    public get defaultProgram():GLProgram{
        return this.m_defaultProgram;
    }

    public getVariantProgram(optconfig:ShaderOptionsConfig):GLProgram{
        if(optconfig == null) throw new Error('optconfig is null');
        
        let hash = optconfig.hashCode;
        let cachedProgram = this.m_compiledPrograms[hash];
        if(cachedProgram != null){
            return cachedProgram;
        }
        else{
            let source= this.source;
            let [vs,ps] =source.injectCompileFlags(optconfig.compileFlag);
            let program =  Shader.CreateProgram(this.m_glctx,vs,ps);
            if(program == null) throw new Error(`compile program failed`);
            this.m_compiledPrograms[hash] = program;
            console.log(`program hash ${hash}`);
            return program;
        }
    }

    public release(){
        this.m_glctx = null;
    }
    
    public static ParseShaderInfo(source:string,info:string){
        const regexp = /ERROR: 0:([\d]+):/g;
        let split = source.split(/\r\n|\r|\n/);
        let ary:RegExpExecArray = null;
        while((ary = regexp.exec(info)) !== null){
            console.error(split[Number(ary[1])-1]);
        }
    }

    public static CreateProgram(glctx:GLContext,vsource:string,psource:string){
        let gl = glctx.gl;
        let vs = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vs, vsource);
        gl.compileShader(vs);

        if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
            console.error(vsource);
            let infolog =  gl.getShaderInfoLog(vs);
            console.error('compile vertex shader failed: ' +infolog);
            Shader.ParseShaderInfo(vsource,infolog);
            gl.deleteShader(vs);
            return null;
        }

        let ps = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(ps, psource);
        gl.compileShader(ps);

        if (!gl.getShaderParameter(ps, gl.COMPILE_STATUS)) {
            console.error(psource);
            let infolog =  gl.getShaderInfoLog(ps);
            console.error('compile fragment shader failed: ' + infolog);
            Shader.ParseShaderInfo(psource,infolog);
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

        if (program == null){
            throw new Error('compile shader error');
        }

        let p = new GLProgram(gl, program);
        return p;
    }
}


