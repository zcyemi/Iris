import { ShaderSource } from "./ShaderSource";
import { GLProgram, GLContext } from "wglut";
import { ShaderOptionsConfig } from "./ShaderVariant";
import { ShaderFX } from "./ShaderFX";

export enum RenderQueue{
    Opaque,
    Transparent,
    Skybox,
    Image,
    Other
}

export enum Comparison{
    NEVER,
    LESS,
    EQUAL,
    LEQUAL,
    GREATER,
    NOTEQUAL,
    GEQUAL,
    ALWAYS
}

export enum BlendOperator{
    ADD,
    SUBTRACT,
    RESERVE_SUBSTRACT,
    MIN,
    MAX
}

export enum BlendFactor{
    ONE,
    ZERO,
    SRC_COLOR,
    ONE_MINUS_SRC_COLOR,
    DST_COLOR,
    ONE_MINUS_DST_COLOR,
    SRC_ALPHA,
    ONE_MINUS_SRC_ALPHA,
    DST_ALPHA,
    ONE_MINUS_DST_ALPHA,
    CONSTANT_COLOR,
    ONE_MINUS_CONSTANT_COLOR,
    CONSTANT_ALPHA,
    ONE_MINUS_CONSTANT_ALPHA,
    SRC_ALPHA_SATURATE
}

export class ShaderTags{
    public queue?:RenderQueue;
    public ztest?:Comparison;
    public zwrite?:boolean;
    public blendOp?:BlendOperator;
    public blendFactorSrc?:BlendFactor;
    public blendFactorDst?:BlendFactor;

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
            let program = this.m_glctx.createProgram(vs,ps);
            if(program == null) throw new Error(`compile program failed`);
            this.m_compiledPrograms[hash] = program;
            console.log(`program hash ${hash}`);
            return program;
        }
    }

    

    public release(){
        this.m_glctx = null;
    }
}


