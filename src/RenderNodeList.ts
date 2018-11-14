import { MeshRender } from "./MeshRender";
import { RenderQueue } from "./shaderfx/Shader";
import { BaseRender } from "./BaseRender";

export class RenderNodeList{

    public nodeOpaque:BaseRender[] = [];
    public nodeTransparent:BaseRender[] = [];
    public nodeImage:BaseRender[] = [];
    
    public reset(){
        if(this.nodeOpaque.length != 0) this.nodeOpaque = [];
        if(this.nodeTransparent.length != 0) this.nodeTransparent = [];
        if(this.nodeImage.length != 0) this.nodeImage = [];
    }
    public pushRenderNode(rnode:BaseRender){
        let material = rnode.material;
        let tag = material.shaderTags;
        if(tag == null) return;
        switch(tag.queue){
            case RenderQueue.Opaque:
                this.nodeOpaque.push(rnode);
                break;
            case RenderQueue.Transparent:
                this.nodeTransparent.push(rnode);
                break;
            case RenderQueue.Image:
                this.nodeImage.push(rnode);
                break;
        }
    }
    public sort(){
        
    }
}
