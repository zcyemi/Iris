import { Scene } from '../core/Scene';
import { MeshRender } from '../core/MeshRender';
import { Material } from '../core/Material';
import { Mesh, Color, Utility, Shader } from '../core/index';
import { Camera, ClearType } from '../core/Camera';
import { Light } from '../core/Light';
import { DebugEntry } from '../DebugEntry';
import { SceneManager } from '../core/SceneManager';
import { CameraFreeFly } from '../misc/CameraUtility';
import { Skybox } from '../core/Skybox';
import { vec3, glmath, quat, vec4 } from '../math/GLMath';
import { GL } from '../gl/GL';
import { StackedPipeline } from '../pipeline/StackedPipeline';
import { SceneBuilder } from '../core/SceneBuilder';
import { PassOpaque,PassSkybox,PassGizmos,PassDebug,PassShadow } from '../rendering/index';
import { GLTFSceneBuilder } from '../misc/GLTFSceneBuilder';
import { GLTFtool } from '../gl/GLTFtool';
import { ControlHandlerComponent } from '../misc/index';
import { GraphicsContext } from '../core/GraphicsContext';
import { ProgramBase } from '../misc/ProgramBase';
import { PassOverlay } from '../rendering/PassOverlay';
import { UIRender } from '../core/UIRender';
import { MultiViewPipeline } from '../pipeline/MultiViewPipeline';
import { IRenderPipeline } from '../pipeline';
import { AssetsDataBase } from '../core/AssetsDatabase';
import { ShaderFX } from '../core/ShaderFX';

export class SampleGame extends ProgramBase{
    private static Instance:SampleGame;
    private m_pipeline:IRenderPipeline;
    private m_scene:Scene;
    private m_sceneMgr:SceneManager;

    public constructor(canvas:HTMLCanvasElement){
        super(canvas);
        SampleGame.Instance = this;
        let grender = this.m_graphicsRender;
        GraphicsContext.activeRender(grender);
        let sc = grender.shadowConfig;
        sc.shadowDistance = 20;
        
        // let pipeline= new StackedPipeline({
        //     passes: [
        //         // PassShadow,
        //         PassOpaque,
        //         // PassSkybox,
        //         // PassGizmos,
        //         // PassDebug,
        //         // PassOverlay
        //     ],
        //     clearinfo: {
        //         clearMask: GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT,
        //         color: glmath.vec4(1,0,0,1),
        //         depth: 1000
        //     }
        // });

        let pipeline = new MultiViewPipeline();

        grender.setPipeline(pipeline);
        this.m_pipeline = pipeline;

        this.m_scene = SceneBuilder.Build({
            "children":{
                "camera":{
                    comp:[
                        Camera.persepctive(null,60.0,1.0,0.1,50),
                        new CameraFreeFly()
                    ],
                    oncreate:(g)=>{
                        g.transform.applyTranslate(glmath.vec3(0,1.0,5));
                        let camera = g.getComponent(Camera);
                        // camera.clearType = ClearType.Background;
                        // camera.background = new vec4( Color.WHITE);
                        camera.clearType = ClearType.Skybox;
                        camera.skybox = Skybox.createFromProcedural();
                    }
                },
                "ui":{
                    oncreate:(g)=>{
                        g.render = new UIRender(grender);
                    }
                },
                "cube":{
                    trs: {pos:[2,1,-5]},
                    oncreate:(g)=>{
                        g.transform.applyRotate(quat.Random());

                        let cmat =new Material(ShaderFX.findShader("iris","@shaderfx/unlit_color"));
                        cmat.setColor("Color",glmath.vec4(0.5,0.5,0.5,1));
                        g.render = new MeshRender(Mesh.Cube,cmat)
                    }
                },
                // "cube_1":{
                //     trs: {pos:[-1,1,3]},
                //     oncreate:(g)=>{
                //         g.transform.applyRotate(quat.Random());
                //         let cmat =new Material(grender.shaderLib.shaderDiffuse);
                //         cmat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0.7,0.7,0.7,1.0));
                //         g.render = new MeshRender(Mesh.Cube,cmat)
                //     }
                // },
                // "plane": {
                //     oncreate:(g)=>{
                //         g.transform.applyRotate(quat.fromEulerDeg(90,0,0));
                //         g.transform.applyScale(glmath.vec3(10,10,1));
                //         let cmat = new Material(grender.shaderLib.shaderShadowSample);
                //         cmat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(1,1,1,1.0));
                //         g.render = new MeshRender(Mesh.Quad,cmat);
                //     }
                // },
                // "pointlight_1":{
                //     trs:{ pos:[3,3,3]},
                //     oncreate:(g)=>{
                //         let light = Light.createPointLight(g,10.0,null,1.0,glmath.vec3(1.0,0,0));
                //     }
                // },
                // "pointlight_2":{
                //     trs:{ pos:[-3,5,-5]},
                //     oncreate:(g)=>{
                //         let light = Light.createPointLight(g,10.0,null,1.0,glmath.vec3(0,1.0,0));
                //     }
                // },
                // "pointlight_3":{
                //     trs:{ pos:[-3,4,5]},
                //     oncreate:(g)=>{
                //         let light = Light.createPointLight(g,10.0,null,1.0,glmath.vec3(0,0,1.0));
                //     }
                // },
                // "directionalLight":{
                //     comp:[
                //         new ControlHandlerComponent()
                //     ],
                //     oncreate:(g)=>{
                //         Light.creatDirctionLight(g,1.0,vec3.down,glmath.vec3(1,0,0));
                //         g.transform.setPosition(glmath.vec3(0,5,0));
                //     }
                // }
            }
        });

                
        var scene = this.m_scene;

        // (async function(){
        //     let model = await GLTFtool.LoadGLTFBinary("res/gltf/blender.glb");

        //     let builder = new GLTFSceneBuilder(model,grender.glctx,grender.shaderLib);
        //     let g = builder.createScene();
        //     g.transform.setPosition(glmath.vec3(0,1,0));
        //     g.transform.parent = scene.transform;
        // })();
        this.m_sceneMgr = new SceneManager();

        this.loadResBundle();


        this.onResize();
    }

    public async loadResBundle(){

        let bundle = await AssetsDataBase.loadBundle('res/iris.resbundle');
        console.log(bundle);


    }


    public onFrame(ts:number){

        super.onFrame(ts);

        this.m_sceneMgr.onFrame(this.m_scene);

        let gredner = this.m_graphicsRender;
        gredner.render(this.m_scene,ts);
        gredner.renderToCanvas();

    }


    @DebugEntry('cmd.reload')
    public static cmdReload(target:SampleGame){
    }

    @DebugEntry('cmd.passDebug')
    public static cmdPassDebug(){
    }
}

window['SampleGame'] = SampleGame;
