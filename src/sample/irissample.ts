import { UIContainer, UIRenderer, UIRenderingBind, UISourceLocal } from '@zcyemi/entangui';
import { FrameTimer, GLUtility, GraphicsContext, GraphicsRender, Input, WindowUtility, GL, vec3 } from '../iris';


const SAMPLE_ENTRY:string[] = [
    'basic_cube',
    'point_light',
]

export class IrisSample extends UIContainer{
    private m_selectSampleId:string = SAMPLE_ENTRY[0];

    public canvas:IrisCanvas;

    
    constructor(){
        super();
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
        this.sidebarBegin('sampleList','Iris',item=>this.m_selectSampleId = item);
        
        SAMPLE_ENTRY.forEach(item=>{
            this.sidebarItem(item,item);
        });
        this.sidebarEnd();
    }

    private m_showDrawCall:boolean = false;
    private m_renderPause:boolean = true;

    private DrawToolKit(){

        this.buttonGroupBegin();

        this.button('Draw',()=>this.m_showDrawCall = true);
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

        this.cardBegin('DrawCall View').classes('center');


        this.divider();

        this.button('Close',()=>this.m_showDrawCall = false);

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


    public constructor(canvas:HTMLCanvasElement){
        this.m_cavnas = canvas;
        this.m_timer = new FrameTimer(false);
        
        Input.init(canvas);
        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));

        this.m_graphicsRender = new GraphicsRender(canvas);
        this.m_graphicsRender.pause = true;
        GraphicsContext.activeRender(this.m_graphicsRender);
        WindowUtility.setOnResizeFunc(this.onResize.bind(this));
    }

    private onResize(){
    }


    private onFrame(ts:number){
        const grender = this.m_graphicsRender;
        grender.render();
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
    irissample.canvas = iriscanvas;
    
}

window['IrisSampleInit'] = IrisSampleInit;


export class SampleBase{

    public onInit(){
        
    }
}