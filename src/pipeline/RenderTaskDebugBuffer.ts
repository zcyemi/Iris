import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { GLContext, glmath } from "wglut";
import { ShaderTags, Comparison, CullingMode } from "../shaderfx/Shader";



export class RenderTaskDebugBuffer extends RenderTask{
    

    private m_shadertags:ShaderTags;
    private m_vp = glmath.vec4(0,200,100,100);

    public init(){

        if(this.m_inited == true) return;

        let tags = new ShaderTags();
        tags.ztest = Comparison.LEQUAL;
        tags.blend = false;
        tags.culling = CullingMode.Back;
        tags.zwrite = true;
        this.m_shadertags =tags;
        this.m_inited = true;
    }
    
    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        let pipeline = this.pipeline;

        if(!pipeline.shadowMapEnabled) return;

        pipeline.stateCache.reset(this.m_shadertags);

        let sm = pipeline.shadowMapInfo[0].texture;
        if(sm == null) return;

        pipeline.bindTargetFrameBuffer();

        glctx.drawTex(sm,false,false,this.m_vp);
    }
    public release(glctx:GLContext){
    }

    public reload(glctx:GLContext){
        
    }

}