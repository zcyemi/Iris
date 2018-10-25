import { PipelineBase } from "../pipeline/PipelineBase";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";
import { RenderPass } from "./RenderPass";


export class PassDebug extends RenderPass{

    public render(scene?:Scene){
        const pipeline = this.pipeline;
        const glctx = pipeline.GLCtx;
        let debugInfo = pipeline.bufferDebugInfo;

        for(let i=0,len = debugInfo.length;i<len;i++){
            let info = debugInfo[i];
            let rawtex =info.rawTexture;
            if(rawtex != null){
                glctx.drawTex(rawtex,false,false,info.drawRect);
            }
        }
    }

}