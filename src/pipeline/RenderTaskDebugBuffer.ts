import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { GLContext, glmath } from "wglut";



export class RenderTaskDebugBuffer extends RenderTask{
    

    private m_vp = glmath.vec4(0,200,100,100);

    public init(){
    }
    
    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        let pipeline = this.pipeline;

        if(!pipeline.shadowMapEnabled) return;

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