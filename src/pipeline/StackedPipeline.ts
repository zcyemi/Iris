import { IRenderPipeline } from "./IRenderPipeline";
import { GraphicsRender, GraphicsRenderCreateInfo } from "../GraphicsRender";
import { GLContext } from "../gl/GLContext";
import { RenderPass } from "../render/RenderPass";
import { PassDebug } from "../render/PassDebug";
import { PassDepth } from "../render/PassDepth";
import { type } from "os";
import { PassShadowMap } from "../render/PassShadowMap";
import { PassSkybox } from "../render/PassSkybox";

type PassCtor<T> = new(pipeline:IRenderPipeline)=>T;


class StackedPipelineBuildOptions{
    passes: PassCtor<any>[];
}

export class StackedPipeline implements IRenderPipeline{
    public graphicRender:GraphicsRender;

    private m_buildopt:StackedPipelineBuildOptions;

    public constructor (buildopt:StackedPipelineBuildOptions){
        this.m_buildopt = buildopt;
    }

    onSetupRender(glctx:GLContext, info:GraphicsRenderCreateInfo){

    }

    
    resizeFrameBuffer(width: number, height: number) {
        throw new Error("Method not implemented.");
    }
    exec(data: any) {
        throw new Error("Method not implemented.");
    }
    onRenderToCanvas() {
        throw new Error("Method not implemented.");
    }

    init() {
        throw new Error("Method not implemented.");
    }
    reload() {
        throw new Error("Method not implemented.");
    }
    release() {
        throw new Error("Method not implemented.");
    }

}