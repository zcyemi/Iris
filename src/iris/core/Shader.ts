import { GLProgram } from "../gl";
import { RenderQueue } from "../pipeline/RenderQueue";
import { GraphicsContext } from "./GraphicsContext";
import { SFXShaderTechnique, SFXTechnique, ShaderTags } from "./ShaderFX";


export class Shader{


    public tags:ShaderTags;

    private m_source:SFXShaderTechnique;

    private m_defProgram:GLProgram;

    public constructor(source:SFXShaderTechnique){
        this.m_source = source;
        this.tags = this.getTags(source.technique);
    }

    public compile():GLProgram{
        if(this.m_defProgram !=null) return this.m_defProgram;

        let ctx = GraphicsContext.currentRender.glctx;

        let source = this.m_source;

        const prefixProfile = '#version 300 es\n';

        let program = ctx.createGLProgram(prefixProfile+source.glsl_vs,prefixProfile+source.glsl_ps);
        program.MarkPropertySemantic(source.technique.properties);
        program.name = this.m_source.technique.name;
        this.m_defProgram = program;
        return this.m_defProgram;
    }

    private getTags(technique:SFXTechnique):ShaderTags{
        let tag = new ShaderTags();

        let pipeline = technique.pipeline;
        let queue = pipeline.queue;
        tag.queue = RenderQueue[queue == null? 'queue':queue];
    
        return tag;
    }

}