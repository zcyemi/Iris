import { ShaderSource } from "./ShaderSource";
import { GLProgram } from "wglut";

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

    private m_programDef:GLProgram;

    public tags:ShaderTags;

    public constructor(source:ShaderSource,program:GLProgram){
        this.m_source =source;
        this.m_programDef = program;
    }
    public get source():ShaderSource{
        return this.m_source;
    }
    public get defaultProgram():GLProgram{
        return this.m_programDef;
    }
}


