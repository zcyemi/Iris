import { vec3, glmath, vec4 } from "../math/GLMath";
import { MapStr } from "../core/Utility";


export class InputSnapShot{
    public key:MapStr<boolean> = {};
    public keyDown:{} = {};
    public keyUp:{} = {};
    public hasKeyPressEvent:boolean = false;

    public mouse:Array<boolean> = new Array(4);
    public mouseDown:Array<boolean> = new Array(4);
    public mouseUp:Array<boolean> = new Array(4);
    /**
     * [posx,posy,deltax,deltay]
     */
    public mousepos:vec4 = new vec4();

    public mousewheel:boolean = false;
    public mousewheelDelta:number = 0;
    public mouseMove:boolean = false;

    public deltaTime:number = 0;

    public getKeyDown(key:string):boolean{
        return this.keyDown[key] == true;
    }
    public getKeyUp(key:string):boolean{
        return this.keyUp[key] == true;
    }
    public getKey(key:string):boolean{
        return this.key[key];
    }
    public getMouseBtn(btn:number):boolean{
        return this.mouse[btn];
    }
    public getMouseDown(btn:number):boolean{
        return this.mouseDown[btn];
    }
    public getMouseUp(btn:number):boolean{
        return this.mouseUp[btn];
    }
}

class InputCache{
    private mousepos:vec4 = new vec4();
    private mousebtn:Array<boolean> = new Array<boolean>(4);

    private mousedown:Array<boolean> = new Array<boolean>(4);
    private mouseup:Array<boolean> = new Array<boolean>(4);

    private mousewheel:boolean = false;
    private mousewheelDelta:number =0;

    private keyPress:{};

    private keyDown:{} = {};
    private keyUp:{} = {};

    private m_keydirty:boolean = false;
    private m_mousedirty:boolean = false;
    private m_mousePosDirty:boolean = false;

    public setKeyDown(e:KeyboardEvent){
        let kp = this.keyPress;
        if(kp == null) {
            kp = {};
            this.keyPress = kp;
        }
        kp[e.key] = true;

        this.keyDown[e.key] = true;
        
        this.m_keydirty= true;
    }

    public setKeyUp(e:KeyboardEvent){
        let kp = this.keyPress;
        if(kp == null) {
            kp = {};
            this.keyPress = kp;
        }
        kp[e.key] = false;

        this.keyUp[e.key] = true;

        this.m_keydirty= true;
    }

    public setMousePos(e:MouseEvent){
        let mp = this.mousepos;
        let x = e.offsetX;
        let y = e.offsetY;
        mp.z = x - mp.x;
        mp.w = y - mp.y;
        mp.x = x;
        mp.y = y;
        this.m_mousePosDirty = true;
    }

    public setButtonDown(e:MouseEvent){
        let btn = e.button;
        this.mousebtn[btn] = true;
        this.mousedown[btn] = true;

        this.m_mousedirty = true;
    }

    public setButtonUp(e:MouseEvent){
        let btn = e.button;
        this.mousebtn[btn] = false;
        this.mouseup[btn] = true;

        this.m_mousedirty = true;
    }

    public setMouseWheel(delta:number){
        this.mousewheel = true;
        this.mousewheelDelta += delta;
    }

    public reset(){

        this.mousewheel = false;
        this.mousewheelDelta = 0;

        if(this.m_mousedirty){
            let mouseup = this.mouseup;
            let mousedown = this.mousedown;
            mouseup.fill(false);
            mousedown.fill(false);
            this.m_mousedirty= false;
        }

        if(this.m_keydirty){
            this.keyDown = [];
            this.keyUp = [];
            this.m_keydirty = false;

            this.keyPress = {};
        }
    }
    
    private m_shotMouseDownFalse:boolean = false;
    private m_shotMouseUpFalse:boolean = false;
    public applytoSnapShot(shot:InputSnapShot){

        let mousePosDirty = this.m_mousePosDirty;
        shot.mouseMove = mousePosDirty;
        if(mousePosDirty){
            this.m_mousePosDirty= false;
            let shotmousepos = shot.mousepos;
            shotmousepos.set(this.mousepos);
        }

        shot.mousewheelDelta = this.mousewheelDelta;
        shot.mousewheel= this.mousewheelDelta != 0 && this.mousewheel;
        
        let smdown = shot.mouseDown;
        let smup = shot.mouseUp;
        let smouse = shot.mouse;
        if(this.m_mousedirty){
            let cmdown = this.mousedown;
            for(let i=0;i<4;i++){
                smdown[i] = cmdown[i];
            }
            let cmup = this.mouseup;
            for(let i=0;i<4;i++){
                smup[i] = cmup[i];
            }
            this.m_shotMouseDownFalse = false;
            this.m_shotMouseUpFalse = false;

            let cmouse = this.mousebtn;
            for(let i=0;i<4;i++){
                smouse[i] = cmouse[i];
            }
        }
        else{
            if(!this.m_shotMouseDownFalse){
                smdown.fill(false);
                this.m_shotMouseDownFalse = true;
            }
            if(!this.m_shotMouseUpFalse){
                smup.fill(false);
                this.m_shotMouseUpFalse = true;
            }
        }

        let keydirty = this.m_keydirty;
        shot.hasKeyPressEvent = keydirty;
        if(keydirty){
            //key press
            let skey = shot.key;
            let ckey = this.keyPress;
            for(let k in ckey){
                skey[k] = ckey[k];
            }
            shot.keyDown = this.keyDown;
            shot.keyUp = this.keyUp;
        }
        else{
            shot.keyDown = null;
            shot.keyUp = null;
        }
    }
}



export class Input{

    private static s_inited:boolean = false;
    private static s_canvas:HTMLCanvasElement;

    private static s_cache:InputCache = new InputCache();
    public static snapshot:InputSnapShot = new InputSnapShot();

    public static init(canvas:HTMLCanvasElement){
        if(Input.s_inited) return;

        Input.s_canvas = canvas;
        Input.regEventListener();
        Input.s_inited = true;
    }

    public release(){
        Input.removeEventListener();
    }

    private static regEventListener(){
        window.addEventListener('keydown',Input.onEvtKeyDown);
        window.addEventListener('keyup',Input.onEvtKeyUp);

        let canvas = Input.s_canvas;
        canvas.addEventListener('mousemove',Input.onEvtMouseMove);
        canvas.addEventListener('mousedown',Input.onEvtMouseDown);
        canvas.addEventListener('mouseup',Input.onEvtMouseUp);
        canvas.addEventListener('mousewheel',Input.onEvtMouseWheel);
    }

    private static removeEventListener(){
        window.removeEventListener('keydown',Input.onEvtKeyDown);
        window.removeEventListener('keyup',Input.onEvtKeyUp);

        let canvas = Input.s_canvas;
        canvas.removeEventListener('mousemove',Input.onEvtMouseMove);
        canvas.removeEventListener('mousedown',Input.onEvtMouseDown);
        canvas.removeEventListener('mouseup',Input.onEvtMouseUp);
    }


    private static onEvtKeyDown(e:KeyboardEvent){
        const c = Input.s_cache;
        c.setKeyDown(e);
    }
    private static onEvtKeyUp(e:KeyboardEvent){
        const c = Input.s_cache;
        c.setKeyUp(e);
    }

    private static onEvtMouseMove(e:MouseEvent){
        const c = Input.s_cache;
        c.setMousePos(e);
    }

    private static onEvtMouseDown(e:MouseEvent){
        const c = Input.s_cache;
        c.setButtonDown(e);
    }
    private static onEvtMouseUp(e:MouseEvent){
        const c = Input.s_cache;
        c.setButtonUp(e);
    }

    private static onEvtMouseWheel(e:WheelEvent){
        const c = Input.s_cache;
        c.setMouseWheel(e.deltaY);
    }

    public static onFrame(dt:number){
        let c = Input.s_cache;
        let snpashot = Input.snapshot;
        snpashot.deltaTime =dt;
        c.applytoSnapShot(Input.snapshot);
        c.reset();
    }
}
