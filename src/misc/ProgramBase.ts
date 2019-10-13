import { GraphicsRender } from "../core/GraphicsRender";
import { Input } from "./Input";
import { GLUtility } from "../gl/GLUtility";
import { WindowUtility } from "../core/Utility";
import { FrameTimer } from "../core/FrameTimer";

export class ProgramSetupConfig{
    targetFPS:number = 60;
    setupInput:boolean = true;
}

/**
 * Convinent setup program class
 */
export class ProgramBase{
    private m_canvas: HTMLCanvasElement;
    public get canvas():HTMLCanvasElement{ return this.m_canvas;}
    private m_config:ProgramSetupConfig = new ProgramSetupConfig();
    public get config():ProgramSetupConfig{return this.m_config;}
    protected m_graphicsRender:GraphicsRender;
    private m_timer:FrameTimer;
    
    public constructor(canvas:HTMLCanvasElement,config?:ProgramSetupConfig){
        this.m_canvas =canvas;
        this.m_timer=  new FrameTimer(false);
        
        if(config != null) this.m_config = config;
        let cfg = this.m_config;

        if(cfg.setupInput){
            Input.init(canvas);
        }
        GLUtility.setTargetFPS(cfg.targetFPS);
        GLUtility.registerOnFrame(this.onFrame.bind(this));
        this.m_graphicsRender = new GraphicsRender(canvas);
        WindowUtility.setOnResizeFunc(this.onResize.bind(this));
    }

    public onResize(){
        const canvas = this.m_canvas;
        const grender = this.m_graphicsRender;
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        grender.resizeCanvas(width,height);
    }
    public onFrame(ts:number){
        let delta = this.m_timer.tick(ts);
        let dt = delta/ 1000;
        const setupInput = this.m_config.setupInput;
        if(setupInput) Input.onFrame(dt);
    }
}