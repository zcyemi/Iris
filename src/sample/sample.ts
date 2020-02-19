import { AssetsDataBase } from '../iris/core/AssetsDatabase';
import { GameTime } from '../iris/core/GameTime';
import { GraphicsContext } from '../iris/core/GraphicsContext';
import { Camera, ClearType, Color, FrameTimer, GameObject, GraphicsRender, WindowUtility } from '../iris/core/index';
import { ShaderFX } from '../iris/core/ShaderFX';
import { GLUtility } from '../iris/gl';
import { vec4 } from '../iris/math';
import { Input } from '../iris/misc/index';
import { InternalPipeline } from '../iris/pipeline/InternalPipeline';

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

    private async loadResource(){

        let bundle = await AssetsDataBase.loadBundle('resource/iris.resbundle');

        let shader = ShaderFX.findShader("iris","@shaderfx/skybox");


        const grender = this.m_graphicsRender;

        var pipeline = new InternalPipeline();


        grender.setPipeline(pipeline);


        this.setupScene();


        this.m_resoruceLoaded = true;
    }

    private setupScene(){

        var camobj = new GameObject("camera");
        let camera = camobj.addComponent(new Camera());
        camera.clearType = ClearType.Background;
        camera.background = new vec4(Color.RED);

        // camobj.addComponent(new SampleBasicCube());
        // camobj.addComponent(new CameraFreeFly());
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

        // SceneManager.onFrame(dt);

        const grender =this.m_graphicsRender;
        grender.render();
        grender.renderToCanvas();
    }
}

window['SampleGame'] = SampleGame;
