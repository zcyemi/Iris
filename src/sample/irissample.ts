import { UIContainer, UIRenderer, UIRenderingBind, UISourceLocal } from '@zcyemi/entangui';
import { FrameTimer, GLUtility, GraphicsContext, GraphicsRender, Input, WindowUtility, GL, vec3, Color, vec4, GLContext, SceneManager, GameObject, CameraFreeFly, Camera, ClearType, Skybox } from '../iris';
import { InternalPipeline } from '../iris/pipeline/InternalPipeline';
import { AssetsDataBase } from '../iris/core/AssetsDatabase';
import { GLCmdType } from '../iris/gl/GLCmdRecord';
import { SampleBasicCube } from './sample_basic_cube';
import { SampleBase } from './sampleBase';
import { GameTime } from '../iris/core/GameTime';




export class IrisSample extends UIContainer{
    private m_selectSampleId:string;
    private canvas:IrisCanvas;
    private grender:GraphicsRender;
    
    constructor(){
        super();
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
            this.FlexItemBegin(null,1);
            this.DrawMainCanvas();
            this.flexItemEnd();
        }
        this.flexEnd();
    }

    private DrawSampleList(){
        this.sidebarBegin('sampleList','Iris',item=>{
            if(this.m_selectSampleId == item) return;
            this.m_selectSampleId = item;
            this.canvas.loadSample(item);
        });
        
        SampleBase.sampleEntry.forEach((val,key)=>{
            this.sidebarItem(key,key);
        });
        this.sidebarEnd();
    }

    private m_showDrawCall:boolean = false;
    private m_renderPause:boolean = true;
    

    private DrawToolKit(){

        this.buttonGroupBegin();

        this.button('Draw',()=>{
            this.grender.debugNextFrameGL();
            this.m_showDrawCall = true;
        });
        this.button(this.m_renderPause?"Start":"Pause",()=>{
            let newstatus = !this.m_renderPause;
            this.m_renderPause = newstatus;
            this.canvas.graphicsRender.pause = newstatus;
        });

        this.buttonGroupEnd();

        this.divider();

        if(this.m_showDrawCall){
            this.DrawDrawCallView();
        }
    }

    private DrawDrawCallView(){
        this.contextBegin('view-drawcall',"mask");

        this.cardBegin('DrawCall View').classes('center').style({height:'70%',width:'80%'});

        this.button('Close',()=>this.m_showDrawCall = false);

        this.divider();

        let data = this.grender.lastGLCmdRecord;
        if(data == null){
            this.alert('No FrameData');
            this.button('Refresh',()=>{});
        }
        else{

            this.listBegin(false);

            data.commands.forEach(cmd=>{
                this.bandage(GLCmdType[cmd.type]);
                this.text(cmd.parameter,'span');
                this.listItemNext();
            })
            this.listEnd();
        }

        this.cardEnd();

        this.contextEnd('view-drawcall');
    }


    private DrawMainCanvas(){
        this.element('canvas').id('iris-canvas').style({
            width:'100%',
            height:'100%',
            'background':'#FFF'
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

    public loadSample(name:string){
        let sample = SampleBase.getSample(name);
        if(sample!=null){
            let cursample = this.m_currenSample;
            if(cursample != null){
                cursample.onDestroy();
            }

            console.log('load sample',name);
            sample.onInit();
            this.m_currenSample = sample;
        }
    }

    private m_resLoaded:boolean = false;

    private async initGL(){

        SceneManager.Init();
        var camObj = new GameObject('camera');
        let camera = camObj.addComponent(new Camera());
        camera.clearType = ClearType.Skybox;
        camera.skybox = Skybox.createFromProcedural();


        await AssetsDataBase.loadBundle('iris.resbundle');

        let pipeline = new InternalPipeline({
            color:new vec4(Color.RED),
        });

        this.m_graphicsRender.setPipeline(pipeline);

        GraphicsContext.activeRender(this.m_graphicsRender);
        WindowUtility.setOnResizeFunc(this.onResize.bind(this));

        this.m_resLoaded  =true;
    }

    private onResize(){
    }


    private onFrame(ts:number){

        if(!this.m_resLoaded) return;

        let delta = this.m_timer.tick(ts);
        let dt = delta/ 1000;


        GameTime.deltaTime =dt;
        GameTime.time = ts/1000;


        Input.onFrame(dt);

        const grender = this.m_graphicsRender;

        SceneManager.onFrame(dt);
        grender.render();
        grender.renderToCanvas();
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


SampleBase.registerSample('basic_cube',SampleBasicCube);
