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
import { Texture } from '../Texture';
import { Skybox } from '../Skybox';
import { GLContext } from '../gl/GLContext';
import { GLUtility } from '../gl/GLUtility';
import { vec3, glmath } from '../math/GLMath';

export class SampleGame{
    
    private m_canvas:HTMLCanvasElement;
    private m_glctx:GLContext;

    private m_graphicsRender:GraphicsRender;
    private m_sceneMgr:SceneManager;
    private m_scene:Scene;
    private m_sceneInited:boolean = false;
    private m_timer:FrameTimer = new FrameTimer(false);

    private static Instance:SampleGame;
    private m_pipeline:PipelineBase;

    public constructor(canvas:HTMLCanvasElement){

        SampleGame.Instance = this;

        this.m_canvas = canvas;

        let pipe = new PipelineForwardZPrePass();
        this.m_pipeline = pipe;

        let grender = new GraphicsRender(canvas,pipe);
        this.m_sceneMgr = new SceneManager();
        let sc = grender.shadowConfig;
        sc.shadowDistance = 20;

        this.m_graphicsRender = grender;
        Input.init(canvas);

        this.createScene(grender.glctx);

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
        if(!this.m_sceneInited) return;

        let delta = this.m_timer.tick(ts);
        let dt = delta /1000;
        Input.onFrame(dt);
        let scene = this.m_scene;
        this.m_sceneMgr.onFrame(scene);

        let gredner = this.m_graphicsRender;
        gredner.render(scene,dt);
        gredner.renderToCanvas();
    }

    private m_obj1:GameObject;
    private m_obj2:GameObject;
    private m_obj3:GameObject;
    private m_camera:Camera;
    public async createScene(glctx:GLContext):Promise<void>{
        let grender = this.m_graphicsRender;

        let tr= new Transform(null);
        tr.forward = vec3.down;

        //texture
        let tex = await glctx.createTextureImageAsync('res/images/tex0.png');

        let skybox:Skybox = null;

        let cubepaths:string[] = [
            "res/envmap/peak/peaks_ft.jpg",
            "res/envmap/peak/peaks_bk.jpg",
            "res/envmap/peak/peaks_up.jpg",
            "res/envmap/peak/peaks_dn.jpg",
            "res/envmap/peak/peaks_rt.jpg",
            "res/envmap/peak/peaks_lf.jpg",
        ];
        let texcube = await TextureCubeMap.loadCubeMap(cubepaths,glctx);

        let tex360 = await Texture.loadTexture2D('res/envmap/day360.jpg',glctx,false);
        //skybox = Skybox.createFromTex360(tex360);
        //skybox = Skybox.createFromCubeMap(texcube);

        skybox = Skybox.createFromProcedural();

        let scene:Scene = new Scene();
        this.m_scene = scene;

        //camera
        let camera = Camera.persepctive(null, 60, 400.0 / 300.0, 0.5, 1000);
        camera.transform.setPosition(glmath.vec3(0,0, 5));
        //camera.transform.setLookAt(glmath.vec3(0,0,0));
        camera.transform.setLocalDirty();
        camera.ambientColor = Utility.colorRGBA(3, 110, 167, 15);
        camera.clearType = ClearType.Skybox;
        camera.skybox = skybox;
        camera.background = glmath.vec4(0, 1, 0, 1);
        camera.gameobject.addComponent(new CameraFreeFly());
        camera.gameobject.name = "camera";
        camera.transform.parent= scene.transform;
        this.m_camera = camera;
        
        {
            let spr = await Texture.loadTexture2D('res/images/img0.png',glctx,true);
            let sprobj = new GameObject('sprite1');
            let srender = sprobj.addRender(SpriteRender);
            srender.image = spr;
            srender.color.w = 0.5;

            sprobj.transform.setPosition(glmath.vec3(0,1,-5));
            sprobj.transform.parent = scene.transform;

            // console.log(sprobj.render.material.shaderTags);
        }

        //directional light
        let lightobj = new GameObject();
        let light0 = Light.creatDirctionLight(lightobj,1.0,glmath.vec3(0.5,-1,0.6));
        light0.lightColor = new vec3([1,1,1]);
        lightobj.transform.parent = scene.transform;

        this.m_sceneInited = true;
    }

    @DebugEntry('cmd.reload')
    public static cmdReload(target:SampleGame){
        if(target != null) target.m_graphicsRender.reload();
    }

    @DebugEntry('cmd.passDebug')
    public static cmdPassDebug(){
        let instance = SampleGame.Instance;
        if(instance != null) instance.m_pipeline.renderPassDebug = !instance.m_pipeline.renderPassDebug;
    }
}

window['SampleGame'] = SampleGame;
