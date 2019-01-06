import { Scene } from "../Scene";
import { RenderPass } from "./RenderPass";


export class PassDebug extends RenderPass{

    public render(scene?:Scene){
        const model = this.pipeline.model;
        let debugInfo = model.bufferDebugInfo;

        const glctx = this.pipeline.glctx;


        if(debugInfo == null || debugInfo.length ==0) return;

        glctx.bindGLFramebuffer(this.pipeline.mainFrameBuffer);

        for(let i=0,len = debugInfo.length;i<len;i++){
            let info = debugInfo[i];
            let rawtex =info.rawTexture;
            if(rawtex != null){
                model.drawsScreenTex(rawtex,info.drawRect);
            }
        }

    }

}
