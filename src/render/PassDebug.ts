import { Scene } from "../Scene";
import { RenderPass } from "./RenderPass";


export class PassDebug extends RenderPass{

    public render(scene?:Scene){
        const model = this.pipeline.model;
        let debugInfo = model.bufferDebugInfo;
        if(debugInfo == null || debugInfo.length ==0) return;

        for(let i=0,len = debugInfo.length;i<len;i++){
            let info = debugInfo[i];
            let rawtex =info.rawTexture;
            if(rawtex != null){
                model.drawsScreenTex(rawtex,info.drawRect);
            }
        }
    }

}
