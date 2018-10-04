import { ShaderSource } from "./ShaderSource";
import { GLProgram } from "wglut";
import { RenderQueue } from "./ShaderFX";

export class ShaderTags{
    public queue:RenderQueue;
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
