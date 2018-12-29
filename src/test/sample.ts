import { Scene } from '../Scene';
import { GameObject } from '../GameObject';
import { MeshRender } from '../MeshRender';
import { Material } from '../Material';
import { Mesh } from '../Mesh';
import { Camera, AmbientType, ClearType } from '../Camera';
import { GraphicsRender } from '../GraphicsRender';
import { Light } from '../Light';
import { DebugEntry } from '../DebugEntry';
import { Utility, WindowUtility } from '../Utility';
import { Input } from '../Input';
import { SceneManager } from '../SceneManager';
import { CameraFreeFly } from '../CameraUtility';
import { FrameTimer } from '../FrameTimer';
import { TextureCubeMap } from '../TextureCubeMap';
import { PipelineBase } from '../pipeline/PipelineBase';
import { PipelineForwardZPrePass } from '../pipeline/PipelineForwardZPrePass';
import { Transform } from '../Transform';
import { SpriteRender } from '../SpriteRender';
import { Texture2D } from '../Texture2D';
import { Skybox } from '../Skybox';
import { GLContext } from '../gl/GLContext';
import { GLUtility } from '../gl/GLUtility';
import { vec3, glmath } from '../math/GLMath';
import { GL } from '../gl/GL';

export class SampleGame{
    private m_canvas:HTMLCanvasElement;
    private m_graphicsRender:GraphicsRender;
    private m_timer:FrameTimer = new FrameTimer(false);

    private static Instance:SampleGame;
    private m_pipeline:PipelineBase;

    public constructor(canvas:HTMLCanvasElement){
        SampleGame.Instance = this;
        this.m_canvas = canvas;
        let pipe = new PipelineForwardZPrePass();
        this.m_pipeline = pipe;
        let grender = new GraphicsRender(canvas,pipe);
        let sc = grender.shadowConfig;
        sc.shadowDistance = 20;
        this.m_graphicsRender = grender;
        Input.init(canvas);

        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));

        this.resizeCanvas();
        WindowUtility.setOnResizeFunc(this.resizeCanvas.bind(this));
    }

    public resizeCanvas(){
        const canvas = this.m_canvas;
        this.m_graphicsRender.resizeCanvas(canvas.clientWidth,canvas.clientHeight);
    }

    public onFrame(ts:number){

        let delta = this.m_timer.tick(ts);
        let dt = delta /1000;
        Input.onFrame(dt);

        let gredner = this.m_graphicsRender;

        let glctx = gredner.glctx;
        let gl = glctx.getWebGLRenderingContext();

        glctx.clearColor(0,1,0,1);
        glctx.clear(GL.COLOR_BUFFER_BIT);

        //gredner.render(scene,dt);
        //gredner.renderToCanvas();
    }


    @DebugEntry('cmd.reload')
    public static cmdReload(target:SampleGame){
    }

    @DebugEntry('cmd.passDebug')
    public static cmdPassDebug(){
    }
}

window['SampleGame'] = SampleGame;
