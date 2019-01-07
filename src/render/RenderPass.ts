import { Scene } from "../Scene";
import { IRenderPipeline } from "../pipeline/IRenderPipeline";

export abstract class RenderPass {

    protected pipeline:IRenderPipeline;

    constructor(pipeline:IRenderPipeline) {
        this.pipeline = pipeline;
    }

    public render(scene?:Scene){
    }

    public release(){
        this.pipeline = null;
    }

    public static Release<T extends IRenderPipeline>(pass:RenderPass):null{
        if(pass == null) return;
        pass.release();
        return null;
    }
}
