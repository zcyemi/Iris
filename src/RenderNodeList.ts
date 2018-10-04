import { MeshRender } from "./MeshRender";
import { RenderQueue } from "./shaderfx/ShaderFX";


export class RenderNodeList{

    
    public nodeOpaque:MeshRender[] = [];
    public nodeTransparent:MeshRender[] = [];
    public nodeImage:MeshRender[] = [];
    
    public reset(){
        if(this.nodeOpaque.length != 0) this.nodeOpaque = [];
        if(this.nodeTransparent.length != 0) this.nodeTransparent = [];
        if(this.nodeImage.length != 0) this.nodeImage = [];
    }

    public pushRenderNode(rnode:MeshRender){

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