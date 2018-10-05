import { RenderTask } from "../RenderPipeline";
import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { GLContext } from "wglut";



export class RenderTaskDebugBuffer extends RenderTask{
    

    public init(){

    }
    
    public render(nodelist:RenderNodeList,scene:Scene,glctx:GLContext){
        return;
        let pipeline = this.pipeline;
        let sm = pipeline.shadowMapInfo[0].texture;
        if(sm == null) return;

        pipeline.bindTargetFrameBuffer();

        glctx.drawTexFullscreen(sm,false,false);
    }

    public release(glctx:GLContext){
        
    }

}