import { RenderNodeList } from "../RenderNodeList";
import { Scene } from "../Scene";
import { PipelineForwardZPrepass } from "../pipeline/PipelineForwardZPrepass";

export abstract class RenderPass {

    protected pipeline:PipelineForwardZPrepass;

    constructor(pipeline:PipelineForwardZPrepass) {
        this.pipeline = pipeline;
    }

    public render(nodelist:RenderNodeList,scene:Scene){

    }
}