import { GraphicsRender, GLContext, GraphicsContext } from "../iris";

export abstract class SampleBase{

    protected glrender:GraphicsRender;
    protected glctx:GLContext;

    public static sampleEntry:Map<string,new()=>SampleBase> = new Map();

    public constructor(){
        this.glrender= GraphicsContext.currentRender;
        this.glctx = GraphicsContext.glctx;
    }

    public abstract onInit();


    public abstract onDestroy();

    public static registerSample(name:string,type:new()=>SampleBase){
        SampleBase.sampleEntry.set(name,type);
    }

    public static getSample(name:string):SampleBase{
        let type= SampleBase.sampleEntry.get(name);
        return new type();
    }
}
