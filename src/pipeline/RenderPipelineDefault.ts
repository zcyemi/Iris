import { RenderPipeline } from "../RenderPipeline";
import { RenderTaskForwardShading } from "./RenderTaskForwardShading";
import { RenderTaskShadowMap } from "./RenderTaskShadowMap";
import { RenderTaskDebugBuffer } from "./RenderTaskDebugBuffer";
import { RenderTaskSkybox } from "./RenderTaskSkybox";
import { RenderTaskTransparent } from "./RenderTaskTransparent";

export class RenderPipelineDefault extends RenderPipeline{

    public constructor(){
        super();

        let tasks = this.tasks;

        this.registerTask(new RenderTaskShadowMap(0, this))
        this.registerTask(new RenderTaskForwardShading(100, this));
        //this.registerTask(new RenderTaskOpaqueImageEffect(1000, this));
        this.registerTask(new RenderTaskSkybox(1500, this));
        //tasks.push(new RenderTaskDrawCoord(1700,this));
        //this.registerTask(new RenderTaskTransparent(2000, this));
        //this.registerTask(new RednerTaskImageEffect(3000, this));
        this.registerTask(new RenderTaskDebugBuffer(4000,this));
    }


}
