import { UIContainer, UIRenderer, UIRenderingBind, UISourceLocal } from '@zcyemi/entangui';
import { FrameTimer, GLUtility, GraphicsContext, GraphicsRender, Input, WindowUtility } from '../iris';


const SAMPLE_ENTRY:string[] = [
    'basic_cube',
    'point_light',
]

export class IrisSample extends UIContainer{
    private m_selectSampleId:string = SAMPLE_ENTRY[0];

    
    constructor(){
        super();

    }

    protected OnGUI() {
        this.flexBegin();
        {
            this.FlexItemBegin('250px');
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
        this.sidebarBegin('sampleList','Iris Samples',item=>this.m_selectSampleId = item);
        
        SAMPLE_ENTRY.forEach(item=>{
            this.sidebarItem(item,item);
        });
        this.sidebarEnd();
    }

    private DrawToolKit(){
        this.button('TestBtn');
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

    public constructor(canvas:HTMLCanvasElement){
        this.m_cavnas = canvas;
        this.m_timer = new FrameTimer(false);
        
        Input.init(canvas);
        GLUtility.setTargetFPS(60);
        GLUtility.registerOnFrame(this.onFrame.bind(this));

        this.m_graphicsRender = new GraphicsRender(canvas);
        GraphicsContext.activeRender(this.m_graphicsRender);
        WindowUtility.setOnResizeFunc(this.onResize.bind(this));
    }

    private onResize(){
        console.log('onresize');
    }


    private onFrame(ts:number){
    }
}


function IrisSampleInit(){
    let dom_container = document.getElementById('sample-container');
    let render = new UIRenderer(dom_container);

    let source = new UISourceLocal(new IrisSample());
    UIRenderingBind(source,render);

    //init iris
    let canvas = <HTMLCanvasElement>document.getElementById('iris-canvas');
    let iriscanvas = new IrisCanvas(canvas);
}

window['IrisSampleInit'] = IrisSampleInit;


export class SampleBase{

    public onInit(){
        
    }
}