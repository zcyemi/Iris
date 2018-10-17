
import { GLContext,GLUtility, quat, glmath, vec3, GLTFtool, vec4} from 'wglut';
import { RenderPipelineDefault } from './pipeline/RenderPipelineDefault';
import { Scene } from './Scene';
import { GameObject } from './GameObject';
import { MeshRender } from './MeshRender';
import { Material } from './Material';
import { Mesh } from './Mesh';
import { Camera, AmbientType, ClearType } from './Camera';
import { GraphicsRender } from './GraphicsRender';
import { ShaderFX } from './shaderfx/ShaderFX';
import { Light } from './Light';
import { RenderTaskDebugBuffer } from './pipeline/RenderTaskDebugBuffer';
import { DebugEntry } from './DebugEntry';
import { Utility } from './Utility';
import { Input } from './Input';
import { SceneManager } from './SceneManager';
import { Component} from './Component';
import { CameraFreeFly } from './CameraUtility';
import { FrameTimer } from './FrameTimer';
import { TextureCubeMap } from './TextureCubeMap';
import { SceneBuilder } from './SceneBuilder';
import { ShaderFXLibs } from './shaderfx/ShaderFXLibs';

export class SampleGame{
    
    private m_canvas:HTMLCanvasElement;
    private m_glctx:GLContext;

    private m_graphicsRender:GraphicsRender;
    private m_sceneMgr:SceneManager;
    private m_scene:Scene;
    private m_sceneInited:boolean = false;
    private m_timer:FrameTimer = new FrameTimer(false);


    public constructor(canvas:HTMLCanvasElement){
        this.m_canvas = canvas;
        let grender = new GraphicsRender(canvas,new RenderPipelineDefault());
        this.m_sceneMgr = new SceneManager();
        let sc = grender.shadowConfig;
        sc.shadowDistance = 20;

        this.m_graphicsRender = grender;
        Input.init(canvas);

        this.createScene(grender.glctx);

        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));
    }

    public resizeCanvas(w:number,h:number){
        this.m_graphicsRender.resizeCanvas(w,h);
    }


    public onFrame(ts:number){
        if(!this.m_sceneInited) return;

        let delta = this.m_timer.tick(ts);
        Input.onFrame(delta/1000);
        let scene = this.m_scene;
        this.m_sceneMgr.onFrame(scene);

        let gredner = this.m_graphicsRender;
        gredner.render(scene);
        gredner.renderToCanvas();
    }

    private m_obj1:GameObject;
    private m_obj2:GameObject;
    private m_obj3:GameObject;
    private m_camera:Camera;
    private async createScene(glctx:GLContext){
        let grender = this.m_graphicsRender;

        //texture
        let tex = await glctx.createTextureImageAsync('res/images/tex0.png');

        // let cubepaths:string[] = [
        //     "res/envmap/peak/peaks_ft.jpg",
        //     "res/envmap/peak/peaks_bk.jpg",
        //     "res/envmap/peak/peaks_up.jpg",
        //     "res/envmap/peak/peaks_dn.jpg",
        //     "res/envmap/peak/peaks_rt.jpg",
        //     "res/envmap/peak/peaks_lf.jpg",
        // ];
        // let texcube = await TextureCubeMap.loadCubeMap(cubepaths,glctx);

        let texcube = await TextureCubeMap.loadCubeMapTex('res/envmap/day360.jpg',glctx);


        let gltf = await GLTFtool.LoadGLTFBinary('res/gltf/scene.glb');

        console.log(gltf);
        let sceneBuilder = new SceneBuilder(gltf,glctx,this.m_graphicsRender.shaderLib);

        //let tex = (await sceneBuilder.getImage(1));

        let scene = new Scene() //sceneBuilder.createScene();
        scene.name = "scene";
        this.m_scene = scene;
        //console.log(scene);

        //this.m_scene = new Scene();
        //let scene = this.m_scene;

        //camera
        let camera = Camera.persepctive(null,60,400.0/300.0,0.5,1000);
        camera.transform.setPosition(glmath.vec3(0,2,5));
        //camera.transform.setLookAt(glmath.vec3(0,0,0));
        camera.transform.setLocalDirty();
        camera.ambientColor = glmath.vec4(1,0.2,0.2,0.2);
        camera.clearType = ClearType.Skybox;
        camera.skybox = texcube;
        camera.background = glmath.vec4(0,1,0,1);
        camera.gameobject.addComponent(new CameraFreeFly());
        camera.transform.parent= scene.transform;
        camera.gameobject.name = "camera";
        this.m_camera = camera;

        //cube
        let obj1 = new GameObject("cube");
        this.m_obj1 = obj1;
        obj1.transform.localPosition = glmath.vec3(0,5,-5);
        obj1.transform.localScale = glmath.vec3(1,1,1);
        let matDiffuse = new Material(grender.shaderLib.shaderDiffuse);
        matDiffuse.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(1,1,0,1));
        obj1.render = new MeshRender(Mesh.Cube,matDiffuse);
        obj1.addComponent(<Component>{
            onUpdate:function(scene:Scene){
                let dt = Input.snapshot.deltaTime;
                dt *= 30.0;
                const rota = quat.fromEulerDeg(dt,-dt,-2 * dt);
                let trs = this.gameobject.transform;
                trs.rotate(rota);
            }
        })

        obj1.transform.parent = scene.transform;

        let ccube = new GameObject("ccube");
        ccube.transform.localPosition = glmath.vec3(0,5,0);
        let mat1 = matDiffuse.clone();
        mat1.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0,0,1,1));
        ccube.render = new MeshRender(Mesh.Cube,mat1);
        ccube.transform.parent = obj1.transform;

        // //cube2
        // let obj3 = new GameObject();
        // this.m_obj3 = obj3;
        // obj3.transform.setPosition(glmath.vec3(-3,3,-3));
        // obj3.transform.setScale(glmath.vec3(0.001,0.001,0.001));
        // obj3.transform.rotate(quat.fromEulerDeg(20,45,0));
        // let matColor = new Material(grender.shaderLib.shaderPbrMetallicRoughness);
        // matColor.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0,0,1,1));

        // let mesh = sceneBuilder.getMesh(4);
        // console.log(mesh);

        // obj3.render = mesh;
        // scene.addChild(obj3);

        //plane
        let obj2 = new GameObject();
        this.m_obj2 = obj2;
        obj2.transform.localPosition = glmath.vec3(0,0,-5);
        obj2.transform.localScale = glmath.vec3(20,20,1);
        obj2.transform.localRotation = quat.axisRotationDeg(vec3.right,90);
        let obj2mat = new Material(grender.shaderLib.shaderUnlitTexture)
        obj2mat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0.5,0.5,0.5,1));
        obj2mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,tex);
        obj2.render = new MeshRender(Mesh.Quad, obj2mat);
        obj2.transform.parent = scene.transform;

        //directional light
        let lightobj = new GameObject();
        let light0 = Light.creatDirctionLight(lightobj,1.0,glmath.vec3(0,-1,1));
        light0.lightColor = new vec3([1,1,1]);
        lightobj.transform.parent = scene.transform;

        this.m_sceneInited = true;
    }

    @DebugEntry('cmd.reload')
    public static cmdReload(target:SampleGame){
        if(target != null) target.m_graphicsRender.reload();
    }
}

window['SampleGame'] = SampleGame;