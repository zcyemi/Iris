
import { GLContext,GLUtility, quat, glmath, vec3, GLTFtool, vec4} from 'wglut';
import { RenderPipelineDefault } from './pipeline/RenderPipelineDefault';
import { Scene } from './Scene';
import { GameObject } from './GameObject';
import { MeshRender } from './MeshRender';
import { Material } from './Material';
import { Mesh } from './Mesh';
import { Camera, AmbientType } from './Camera';
import { GraphicsRender } from './GraphicsRender';
import { ShaderFX } from './shaderfx/ShaderFX';
import { Light } from './Light';
import { RenderTaskDebugBuffer } from './pipeline/RenderTaskDebugBuffer';
import { DebugEntry } from './DebugEntry';
import { Utility } from './Utility';
import { Input } from './Input';

export class SampleGame{
    
    private m_canvas:HTMLCanvasElement;
    private glctx:GLContext;

    private m_graphicsRender:GraphicsRender;
    private m_scene:Scene;
    private m_sceneInited:boolean = false;

    public constructor(){
        let canvas = <HTMLCanvasElement>document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 300;
        canvas.style.backgroundColor = '#222';
        document.body.appendChild(canvas);
        this.m_canvas = canvas;

        var glctx = <GLContext>GLContext.createFromCanvas(canvas, {
            antialias: true,
            alpha: false,
            depth: false,
            stencil:false
        });

        this.glctx = glctx;
        let gl = glctx.gl;

        let grender = new GraphicsRender(glctx,new RenderPipelineDefault());
        let sc = grender.shadowConfig;
        sc.shadowDistance = 20;

        this.m_graphicsRender = grender;


        Input.init(canvas);

        this.m_scene = new Scene();
        this.createScene(this.m_scene);
        GLUtility.registerOnFrame(this.onFrame.bind(this));
        
        //window.addEventListener('keypress',this.onEvtkeyPress.bind(this));
        //canvas.addEventListener('mousewheel',this.onEvtMouseWheel.bind(this));
    }

    public onFrame(ts:number){
        if(!this.m_sceneInited) return;

        Input.onFrame();

        let scene = this.m_scene;
        this.update(scene);

        let gredner =this.m_graphicsRender;
        gredner.render(scene,ts);
        gredner.renderToCanvas();

    }

    private m_obj1:GameObject;
    private m_obj2:GameObject;
    private m_obj3:GameObject;
    private m_camera:Camera;
    private async createScene(scene:Scene){
        let grender = this.m_graphicsRender;

        //texture
        let tex = await this.glctx.createTextureImageAsync('res/images/tex0.png');

        //camera
        let camera = Camera.persepctive(60,400.0/300.0,0.5,100);
        camera.transform.setPosition(glmath.vec3(0,2,5));
        //camera.transform.setLookAt(glmath.vec3(0,0,0));
        camera.transform.setDirty();
        camera.ambientColor = glmath.vec4(1,0.2,0.2,0.2);
        camera.background = glmath.vec4(0,1,0,1);
        scene.camera = camera;
        this.m_camera = camera;

        //cube
        let obj1 = new GameObject();
        this.m_obj1 = obj1;
        obj1.transform.localPosition = glmath.vec3(0,5,-5);
        obj1.transform.localScale = glmath.vec3(1,1,1);
        let matDiffuse = new Material(grender.shaderLib.shaderDiffuse);
        matDiffuse.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(1,1,0,1));
        obj1.render = new MeshRender(Mesh.Cube,matDiffuse);
        scene.addChild(obj1);

        // //cube2
        let obj3 = new GameObject();
        this.m_obj3 = obj3;
        obj3.transform.setPosition(glmath.vec3(-3,3,-3));
        obj3.transform.setScale(glmath.vec3(4,1,1));
        obj3.transform.rotate(quat.fromEulerDeg(20,45,0));
        let matColor = new Material(grender.shaderLib.shaderUnlitColor);
        matColor.setColor(ShaderFX.UNIFORM_MAIN_COLOR,glmath.vec4(0,0,1,1));
        obj3.render = new MeshRender(Mesh.Cube,matColor);
        scene.addChild(obj3);

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
        scene.addChild(obj2);

        //directional light
        let light0 = Light.creatDirctionLight(1.0,glmath.vec3(0,-1,1));
        light0.lightColor = new vec3([1,1,1]);
        scene.addChild(light0);

        this.m_sceneInited = true;
    }

    private update(scene:Scene){
        const rota = quat.fromEulerDeg(1,-1,-2);
        let obj1 = this.m_obj1;
        let trs = obj1.transform;
        trs.rotate(rota);


        //keyboard move

        let c= this.m_camera;
        let ct = this.m_camera.transform;

        if(Input.getKey('w')){
            ct.translate(ct.forward.mulToRef(-0.3));
        }
        
        if(Input.getKey('s')){
            ct.translate(ct.forward.mulToRef(0.3))
        }

        if(Input.getKey('d')){
            let right = ct.right;
            ct.translate(right.mulToRef(-0.3));
        }
        else if(Input.getKey('a')){
            ct.translate(ct.right.mulToRef(0.3));
        }

        //mousewheel

        if(Input.isMouseWheel()){
            let c= this.m_camera;
            const q= quat.fromEulerDeg(0,3,0);
            const p = q.conjugate();
            c.transform.rotate(Input.getMouseWheelDelta() > 0? q: p);
        }
    }


    public static test:SampleGame;
    @DebugEntry('random.color')
    public static DebugRandomColor(){
        let obj3 = SampleGame.test.m_obj3;
        obj3.render.material.setColor(ShaderFX.UNIFORM_MAIN_COLOR,Utility.randomColor());
    }
}

let game = new SampleGame();

SampleGame.test = game;


