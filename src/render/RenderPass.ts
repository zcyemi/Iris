import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { PipelineBase } from "../pipeline/PipelineBase";

export abstract class RenderPass {

    protected pipeline:PipelineBase;

    constructor(pipeline:PipelineBase) {
        this.pipeline = pipeline;
    }

    public render(nodelist:RenderNodeList,scene:Scene){

    }
}