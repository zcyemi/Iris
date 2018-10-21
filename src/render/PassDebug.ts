import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";
import { Scene } from "../Scene";
import { MeshRender } from "../MeshRender";


export class PassDebug{

    private pipeline:PipelineForwardZPrepass;

    public constructor(pipe:PipelineForwardZPrepass){
        this.pipeline = pipe;
    }

    public render(scene:Scene,queue:MeshRender[]){
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