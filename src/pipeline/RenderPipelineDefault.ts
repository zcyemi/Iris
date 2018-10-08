import { RenderPipeline, RenderTaskOpaqueImageEffect, RenderTaskSkybox, RenderTaskTransparencies, RednerTaskImageEffect } from "../RenderPipeline";
import { GLContext } from "wglut";
import { RenderTaskForwardShading } from "./RenderTaskForwardShading";
import { RenderTaskShadowMap } from "./RenderTaskShadowMap";
import { RenderTaskDebugBuffer } from "./RenderTaskDebugBuffer";

export class RenderPipelineDefault extends RenderPipeline{

    public constructor(){
        super();

        let tasks = this.tasks;

        this.registerTask(new RenderTaskShadowMap(0, this))
        this.registerTask(new RenderTaskForwardShading(100, this));
        this.registerTask(new RenderTaskOpaqueImageEffect(1000, this));
        this.registerTask(new RenderTaskSkybox(1500, this));
        //tasks.push(new RenderTaskDrawCoord(1700,this));
        this.registerTask(new RenderTaskTransparencies(2000, this));
        this.registerTask(new RednerTaskImageEffect(3000, this));
        this.registerTask(new RenderTaskDebugBuffer(4000,this));
    }


}
