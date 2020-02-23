import { UIContainer, UIRenderer, UIRenderingBind, UISourceLocal } from '@zcyemi/entangui';
import { Camera, ClearType, Delayter, FrameTimer, GameObject, GLUtility, GraphicsContext, GraphicsRender, Input, Skybox, WindowUtility } from '../iris';
import { AssetsDataBase } from '../iris/core/AssetsDatabase';
import { GameContext } from '../iris/core/GameContext';
import { GameTime } from '../iris/core/GameTime';
import { InternalPipeline } from '../iris/pipeline/InternalPipeline';
import { SampleBasisSkybox } from './basis/SampleBasisSkybox';
import { SampleBasisTriangle } from './basis/SampleBasisTriangle';
import { EditorGUIEvent } from './editor/BaseEditorGUI';
import { DrawCallViewEditorGUI } from './editor/DrawcallViewEditorGUI';
import { InspectorEditorGUI } from './editor/InspectorEditorGUI';
import { SceneEditorGUI } from './editor/SceneEditorGUI';
import { SampleBase } from './sampleBase';
import { SampleBasisCube } from './basis/SampleBasisCube';

export class IrisSample extends UIContainer{
    private m_selectSampleId:string;
    private canvas:IrisCanvas;
    private grender:GraphicsRender;

    private m_sceneGUI:SceneEditorGUI;
    private m_inspectorGUI:InspectorEditorGUI;
    private m_drawCallViewGUI:DrawCallViewEditorGUI;

    
    constructor(){
        super();

        EditorGUIEvent.register(this.onEditorGUIMessage.bind(this));
        this.setupSubGUI();
    }

    private onEditorGUIMessage(cmd:string,data:any){
        switch(cmd){
            case 'sel':
            this.m_inspectorGUI.setTargetGameObj(data);
            break;
        }
    }

    private setupSubGUI(){
        this.m_sceneGUI = new SceneEditorGUI(this);
        this.m_sceneGUI.onInit();

        this.m_inspectorGUI = new InspectorEditorGUI(this);
        this.m_inspectorGUI.onInit();

        this.m_drawCallViewGUI = new DrawCallViewEditorGUI(this);
        this.m_drawCallViewGUI.onInit();
    }


    public setIrisCanvas(canvas:IrisCanvas){
        this.canvas = canvas;
        this.grender = canvas.graphicsRender;
    }

    protected OnGUI() {
        this.flexBegin().style({height:'100%'});
        {
            this.FlexItemBegin('150px');
            this.DrawSampleList();
            this.flexItemEnd();
        }
        {
            this.FlexItemBegin('200px');
            this.DrawToolKit();
            this.flexItemEnd();
        }
        {
            this.FlexItemBegin(null,1).style({
                overflow:'hidden',
                position:'relative'
            });
            this.DrawMainCanvas();
            this.flexItemEnd();
        }
        this.flexEnd();
    }

    private DrawSampleList(){
        this.sidebarBegin('sampleList','Iris',item=>{
            if(this.m_selectSampleId == item) return;
            this.m_selectSampleId = item;
            this.m_inspectorGUI.setTargetGameObj(null);
            this.canvas.loadSample(item);
        });
        
        SampleBase.sampleEntry.forEach((val,key)=>{
            this.sidebarItem(key,key);
        });
        this.sidebarEnd();
    }


    private m_renderPause:boolean = true;

    

    private DrawToolKit(){

        this.buttonGroupBegin();

        this.button('Draw',()=>{
            this.grender.debugNextFrameGL();
            this.m_drawCallViewGUI.showDrawCall = true;
        });
        this.button(this.m_renderPause?"Start":"Pause",()=>{
            let newstatus = !this.m_renderPause;
            GameContext.current.gamePause = newstatus;
            this.m_renderPause = newstatus;
            this.canvas.graphicsRender.pause = newstatus;
        });

        this.buttonGroupEnd();

        this.divider();

        //InspectorGUI
        this.m_sceneGUI.onGUI();

        this.m_inspectorGUI.onGUI();


        this.m_drawCallViewGUI.onGUI();
    }

    private DrawMainCanvas(){
        this.element('canvas').id('iris-canvas').style({
            'background':'#FFF',
            width:'auto 400px',
            height:'auto 300px'
        });
    }
}

export class IrisCanvas{
    
    private m_cavnas:HTMLCanvasElement;
    private m_timer:FrameTimer;
    private m_graphicsRender:GraphicsRender;

    public get timer():FrameTimer{return this.m_timer;}
    public get graphicsRender():GraphicsRender{return this.m_graphicsRender;}

    private m_currenSample:SampleBase;

    public constructor(canvas:HTMLCanvasElement){
        this.m_cavnas = canvas;
        this.m_timer = new FrameTimer(false);
        
        Input.init(canvas);
        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));


        this.m_graphicsRender = new GraphicsRender(canvas);
        GraphicsContext.activeRender(this.m_graphicsRender);
        this.m_graphicsRender.pause = true;

        this.initGL();        
    }

    private m_sampleCache:{[key:string]:SampleBase} = {};

    public loadSample(name:string){

        let sample = this.m_sampleCache[name];
        if(sample == null){
            sample = SampleBase.getSample(name);
            this.m_sampleCache[name] =sample;
        }

        let cursample = this.m_currenSample;
        if(cursample != null){
            cursample.onDestroy();
        }

        console.log("-----------");
        console.log("InitSample",name);
        sample.onInit();
        this.m_currenSample = sample;
    }

    private m_resLoaded:boolean = false;

    private async initGL(){
        await AssetsDataBase.loadBundle('iris.resbundle');

        let pipeline = new InternalPipeline();

        this.m_graphicsRender.setPipeline(pipeline);

        GraphicsContext.activeRender(this.m_graphicsRender);
        WindowUtility.setOnResizeFunc(this.onResize.bind(this));

        this.m_resLoaded  =true;
        this.onResize();
    }

    private m_resizeDelayter = new Delayter()

    private onResize(){

        const canvas = this.m_cavnas;
        const canvasParent = canvas.parentElement;
        const grender = this.m_graphicsRender;
        var width = canvasParent.clientWidth;
        var height = canvasParent.clientHeight;

        this.m_resizeDelayter.emit(()=>{
            canvas.width = width;
            canvas.height= height;
            grender.resizeCanvas(width,height);
        })

    }

    private onFrame(ts:number){

        if(!this.m_resLoaded) return;

        let gamectx = GameContext.current;

        if(!gamectx.gamePause){
            let delta = this.m_timer.tick(ts);
            let dt = delta/ 1000;
    
            GameTime.deltaTime =dt;
            GameTime.time = ts/1000;
    
            Input.onFrame(dt);
    
            const grender = this.m_graphicsRender;
    
            GameContext.current.onFrame(dt);
            grender.render();
            grender.renderToCanvas();
        }
    }
}


function IrisSampleInit(){
    let dom_container = document.getElementById('sample-container');
    let render = new UIRenderer(dom_container);

    let irissample = new IrisSample();

    let source = new UISourceLocal(irissample);
    UIRenderingBind(source,render);

    //init iris
    let canvas = <HTMLCanvasElement>document.getElementById('iris-canvas');
    let iriscanvas = new IrisCanvas(canvas);
    irissample.setIrisCanvas(iriscanvas);;
    
}

window['IrisSampleInit'] = IrisSampleInit;


SampleBase.registerSample('basic/triangle',SampleBasisTriangle);
SampleBase.registerSample('basic/skybox',SampleBasisSkybox);
SampleBase.registerSample('basic/cube',SampleBasisCube);


