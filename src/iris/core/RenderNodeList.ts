import { BaseRender } from "./BaseRender";
import { IndexedBuffer } from "../collection/IndexedBuffer";
import { RenderQueue } from "../pipeline/RenderQueue";

export class RenderNodeList{

    public nodeOpaque:IndexedBuffer<BaseRender> = new IndexedBuffer();
    public nodeTransparent:IndexedBuffer<BaseRender> = new IndexedBuffer();
    public nodeImage:IndexedBuffer<BaseRender> = new IndexedBuffer();
    public nodeOverlay:IndexedBuffer<BaseRender> = new IndexedBuffer();
    
    public reset(){
        this.nodeOpaque.empty();
        this.nodeTransparent.empty();
        this.nodeImage.empty();
        this.nodeOverlay.empty();
    }
    public pushRenderNode(rnode:BaseRender){
        let queue = rnode.renderQueue;
        if(queue == null){
            if(rnode.material == null || rnode.material.shaderTags == null) return;
            queue= rnode.material.shaderTags.queue;
        }

        switch(queue){
            case RenderQueue.opaque:
                this.nodeOpaque.push(rnode);
                break;
            case RenderQueue.transparent:
                this.nodeTransparent.push(rnode);
                break;
            case RenderQueue.image:
                this.nodeImage.push(rnode);
                break;
            case RenderQueue.overlay:
                this.nodeOverlay.push(rnode);
                break;
        }
    }
    public sort(){
        
    }
}
