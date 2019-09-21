import { RenderPass } from "./RenderPass";
import { IRenderPipeline } from "../pipeline";
import { Scene, MeshRender } from "../core";


export class PassOverlay extends RenderPass{

    public constructor(pipeline:IRenderPipeline){
        super(pipeline);
    }

    public render(scene:Scene){
        let queue = this.pipeline.nodeList.nodeOverlay;
        if(queue.size == 0) return;
        const pipe = this.pipeline;
        const glctx = pipe.glctx;

        const model = pipe.model;

        const mainfb = pipe.mainFrameBuffer;
        glctx.viewport(0,0,mainfb.width,mainfb.height);
        glctx.bindGLFramebuffer(mainfb);

        const len = queue.size;
        const queueary = queue.array;
        for(let t=0;t<len;t++){
            const node = queueary[t];
            if(node instanceof MeshRender){
                model.drawMeshRender(node,node.object.transform.objMatrix);
            }
            else{
                node.draw(glctx,model);
            }
        }

    }
    
}