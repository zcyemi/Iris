import { Scene } from "../Scene";
import { RenderPass } from "./RenderPass";


export class PassDebug extends RenderPass{

    public render(scene?:Scene){
        // const pipeline = this.pipeline;
        // const glctx = pipeline.glctx;
        // let debugInfo = pipeline.bufferDebugInfo;

        // for(let i=0,len = debugInfo.length;i<len;i++){
        //     let info = debugInfo[i];
        //     let rawtex =info.rawTexture;
        //     if(rawtex != null){
        //         //TODO
        //         //glctx.drawTex(rawtex,false,false,info.drawRect);
        //     }
        // }
    }

}
