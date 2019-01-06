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
import { vec3, glmath, quat, vec4 } from '../math/GLMath';
import { GL } from '../gl/GL';
import { StackedPipeline } from '../pipeline/StackedPipeline';
import { SceneBuilder } from '../SceneBuilder';
import { ShaderFX } from '../shaderfx/ShaderFX';
import { PassOpaque } from '../render/PassOpaque';
import { PassSkybox } from '../render/PassSkybox';
import { PassTest } from '../render/PassTest';
import { PassGizmos } from '../render/PassGizmos';
import { GLTFSceneBuilder } from '../GLTFSceneBuilder';
import { GLTFtool } from '../gl/GLTFtool';

import ""
import { PassDebug } from '../render/PassDebug';
import { PassShadow } from '../render/PassShadow';
import { Component } from '../Component';
import { ControlHandlerComponent } from '../ControlHandlerComponent';

export class SampleGame{
    private m_canvas:HTMLCanvasElement;
    private m_graphicsRender:GraphicsRender;
    private m_timer:FrameTimer = new FrameTimer(false);

    private static Instance:SampleGame;

    private m_pipeline:StackedPipeline;
    private m_scene:Scene;
    private m_sceneMgr:SceneManager;

    public constructor(canvas:HTMLCanvasElement){
        SampleGame.Instance = this;
        this.m_canvas = canvas;
        var grender = new GraphicsRender(canvas);
        let sc = grender.shadowConfig;
        sc.shadowDistance = 20;
        this.m_graphicsRender = grender;
        Input.init(canvas);

        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));

        
        WindowUtility.setOnResizeFunc(this.resizeCanvas.bind(this));

        let pipeline= new StackedPipeline({
            passes: [
                PassShadow,
                PassOpaque,
                PassSkybox,
                PassGizmos,
                PassDebug,
            ],
            clearinfo: {
                clearMask: GL.COLOR_BUFFER_BIT | GL.DEPTH_BUFFER_BIT,
                color: glmath.vec4(0,0,0,1),
                depth: 1000
            }
        });
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
                        camera.clearType = ClearType.Skybox;
                        camera.skybox = Skybox.createFromProcedural();
                    }
                },
                // "cube":{
                //     trs: {pos:[2,1,-5]},
                //     oncreate:(g)=>{
                //         g.transform.applyRotate(quat.Random());
                //         let cmat =new Material(grender.shaderLib.shaderDiffuse);
                //         cmat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0.5,0.5,0.5,1));
                //         g.render = new MeshRender(Mesh.Cube,cmat)
                //     }
                // },
                // "cube_1":{
                //     trs: {pos:[-1,1,3]},
                //     oncreate:(g)=>{
                //         g.transform.applyRotate(quat.Random());
                //         let cmat =new Material(grender.shaderLib.shaderDiffuse);
                //         cmat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0.7,0.7,0.7,1.0));
                //         g.render = new MeshRender(Mesh.Cube,cmat)
                //     }
                // },
                "plane": {
                    oncreate:(g)=>{
                        g.transform.applyRotate(quat.fromEulerDeg(90,0,0));
                        g.transform.applyScale(glmath.vec3(10,10,1));
                        let cmat = new Material(grender.shaderLib.shaderDiffuse);
                        cmat.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(1,1,1,1.0));
                        g.render = new MeshRender(Mesh.Quad,cmat);
                    }
                },
                "pointlight_1":{
                    trs:{ pos:[3,3,3]},
                    oncreate:(g)=>{
                        let light = Light.createPointLight(g,10.0,null,1.0,glmath.vec3(1.0,0,0));
                    }
                },
                "pointlight_2":{
                    trs:{ pos:[-3,5,-5]},
                    oncreate:(g)=>{
                        let light = Light.createPointLight(g,10.0,null,1.0,glmath.vec3(0,1.0,0));
                    }
                },
                "pointlight_3":{
                    trs:{ pos:[-3,4,5]},
                    oncreate:(g)=>{
                        let light = Light.createPointLight(g,10.0,null,1.0,glmath.vec3(0,0,1.0));
                    }
                },
                "directionalLight":{
                    comp:[
                        new ControlHandlerComponent()
                    ],
                    oncreate:(g)=>{
                        Light.creatDirctionLight(g,1.0,vec3.down,glmath.vec3(1,0,0));
                        g.transform.setPosition(glmath.vec3(0,5,0));
                    }
                }
            }
        });

                
        var scene = this.m_scene;

        (async function(){
            let model = await GLTFtool.LoadGLTFBinary("res/gltf/blender.glb");

            let builder = new GLTFSceneBuilder(model,grender.glctx,grender.shaderLib);
            let g = builder.createScene();
            g.transform.setPosition(glmath.vec3(0,1,0));
            g.transform.parent = scene.transform;
        })();
        

        this.m_sceneMgr = new SceneManager();

        this.resizeCanvas();
    }

    public resizeCanvas(){
        const canvas = this.m_canvas;
        let grender =this.m_graphicsRender;
        if(grender == null) return;
        grender.resizeCanvas(canvas.clientWidth,canvas.clientHeight);
    }

    public onFrame(ts:number){

        let delta = this.m_timer.tick(ts);
        let dt = delta /1000;
        Input.onFrame(dt);
        
        this.m_sceneMgr.onFrame(this.m_scene);

        let gredner = this.m_graphicsRender;
        gredner.render(this.m_scene,dt);
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
