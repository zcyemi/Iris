import { AssetsDataBase } from '../core/AssetsDatabase';
import { GraphicsContext } from '../core/GraphicsContext';
import { Camera, FrameTimer, GameObject, GraphicsRender, SceneManager, WindowUtility, ClearType, Color } from '../core/index';
import { ShaderFX } from '../core/ShaderFX';
import { GLUtility } from '../gl';
import { Input } from '../misc/index';
import { InternalPipeline } from '../pipeline/InternalPipeline';
import { vec4 } from '../math';
import { SampleTextureRendering } from './sample_textureRendering';
import { GameTime } from '../core/GameTime';

export class SampleGame{
    private m_canvas:HTMLCanvasElement;
    private m_timer:FrameTimer;
    private m_graphicsRender:GraphicsRender;

    private m_resoruceLoaded:boolean = false;

    public constructor(canvas:HTMLCanvasElement){
        this.m_canvas = canvas;
        this.m_timer = new FrameTimer(false);

        Input.init(canvas);
        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));

        this.m_graphicsRender = new GraphicsRender(canvas);
        GraphicsContext.activeRender(this.m_graphicsRender);
        WindowUtility.setOnResizeFunc(this.onResize.bind(this));

        this.loadResource();

    }


    private setupScene(){

        SceneManager.Init();
        var camobj = new GameObject("camera");
        let camera = camobj.addComponent(new Camera());
        camera.clearType = ClearType.Background;
        camera.background = new vec4(Color.BLACK);

        camobj.addComponent(new SampleTextureRendering());
    }

    private async loadResource(){

        let bundle = await AssetsDataBase.loadBundle('resource/iris.resbundle');

        let shader = ShaderFX.findShader("iris","@shaderfx/skybox");


        const grender = this.m_graphicsRender;

        var pipeline = new InternalPipeline();

        SceneManager.Init();

        grender.setPipeline(pipeline);


        this.setupScene();


        this.m_resoruceLoaded = true;
    }

    private onResize(){
        const canvas = this.m_canvas;
        const grender = this.m_graphicsRender;
        let width = canvas.clientWidth;
        let height = canvas.clientHeight;
        grender.resizeCanvas(width,height);
    }

    private onFrame(ts:number){
        let delta = this.m_timer.tick(ts);
        let dt = delta/ 1000;

        GameTime.deltaTime =dt;
        GameTime.time = ts/1000;

        Input.onFrame(dt);
        

        if(!this.m_resoruceLoaded) return;

        SceneManager.onFrame(dt);

        const grender =this.m_graphicsRender;
        grender.render();
    }
}

window['SampleGame'] = SampleGame;