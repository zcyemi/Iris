import { AssetsDataBase, BundleFileEntry } from "./AssetsDatabase";
import { BinaryBuffer } from "ts-binary-serializer/dist/src/BinaryBuffer";
import { ShaderFXSource } from "./ShaderFX";
import { GLProgram, GLContext } from "../gl";
import { GraphicsContext } from "./GraphicsContext";


export class Shader{

    private m_source:ShaderFXSource;

    private m_defProgram:GLProgram;

    public constructor(source:ShaderFXSource){
        this.m_source = source;
    }

    public compile():GLProgram{
        if(this.m_defProgram !=null) return this.m_defProgram;

        let ctx = GraphicsContext.currentRender.glctx;

        let source = this.m_source;
        let program = ctx.createGLProgram(source.vertex,source.fragment);
        program.MarkAttributeSemantic(source.technique.attr_vs);
        program.MarkUniformSemantic(source.technique.uniform_semantic);
        program.name = this.m_source.technique.name;
        this.m_defProgram = program;
        return this.m_defProgram;
    }

    


}