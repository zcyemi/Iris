import { vec3, glmath } from "wglut";
import { MapStr } from "./Utility";


class InputSnapShot{
    public key:MapStr<boolean> = {};
    public keyDown:{} = {};
    public keyUp:{} = {};
    public mouse:Array<boolean> = new Array(4);
    public mouseDown:Array<boolean> = new Array(4);
    public mouseUp:Array<boolean> = new Array(4);
    public mousepos:vec3 = new vec3();

    public mousewheel:boolean = false;
    public mousewheelDelta:number = 0;
    public mouseMove:boolean = false;
}

class InputCache{
    private mousepos:vec3 = new vec3();
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
        mp.x = e.offsetX;
        mp.y = e.offsetY;
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

        if(this.m_keydirty){

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
    private static s_snapshot:InputSnapShot = new InputSnapShot();

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

    public static onFrame(){
        let c = Input.s_cache;
        c.applytoSnapShot(Input.s_snapshot);
        c.reset();
    }

    public static getKeyDown(key:string):boolean{
        return Input.s_snapshot.keyDown[key] == true;
    }

    public static getKeyUp(key:string):boolean{
        return Input.s_snapshot.keyUp[key] == true;
    }

    public static getKey(key:string):boolean{
        return Input.s_snapshot.key[key];
    }

    public static getMouseBtn(btn:number):boolean{
        return Input.s_snapshot.mouse[btn];
    }
    public static getMouseDown(btn:number):boolean{
        return Input.s_snapshot.mouseDown[btn];
    }
    public static getMouseUp(btn:number):boolean{
        return Input.s_snapshot.mouseUp[btn];
    }

    public static getMousePos():vec3{
        return Input.s_snapshot.mousepos;
    }

    public static isMouseWheel():boolean{
        return Input.s_snapshot.mousewheel;
    }
    public static getMouseWheelDelta():number{
        return Input.s_snapshot.mousewheelDelta;
    }

    public static isMouseMove():boolean{
        return Input.s_snapshot.mouseMove;
    }
}