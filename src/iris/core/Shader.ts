import { AssetsDataBase, BundleFileEntry } from "./AssetsDatabase";
import { BinaryBuffer } from "ts-binary-serializer/dist/src/BinaryBuffer";
import { ShaderFXSource, ShaderTags, ShaderFXTechnique } from "./ShaderFX";
import { GLProgram, GLContext } from "../gl";
import { GraphicsContext } from "./GraphicsContext";
import { RenderQueue } from "../pipeline/RenderQueue";


export class Shader{


    public tags:ShaderTags;

    private m_source:ShaderFXSource;

    private m_defProgram:GLProgram;

    public constructor(source:ShaderFXSource){
        this.m_source = source;
        this.tags = this.getTags(source.technique);
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

    private getTags(technique:ShaderFXTechnique):ShaderTags{
        let tag = new ShaderTags();

        let meta = technique.meta_pipeline;
        tag.queue = RenderQueue[this.getMetaProp(meta['queue'],'opaque')];
    
        return tag;
    }

    private getMetaProp(val:any,def:any):string{
        if(val == null) return def;
        if(Array.isArray(val)){
            return val[0];
        }
    }

    


}