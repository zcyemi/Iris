import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { PipelineBase } from "../pipeline/PipelineBase";

export abstract class RenderPass {

    protected pipeline:PipelineBase;

    constructor(pipeline:PipelineBase) {
        this.pipeline = pipeline;
    }

    public render(scene?:Scene){

    }

    public release(){
        this.pipeline = null;
    }

    public static Release(pass:RenderPass):RenderPass{
        pass.release();
        return null;
    }
}