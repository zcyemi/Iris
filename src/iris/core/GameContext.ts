import { Camera } from "./Camera";
import { Light } from "./Light";
import { GraphicsRender } from "./GraphicsRender";
import { GameObject } from "./GameObject";
import { Transform } from "./Transform";
import { EventListener } from "../misc/EventListener";
import { Utility } from "./Utility";

export class GameContext{

    public gamePause:boolean = false;

    public evtOnSceneUpdate:EventListener = new EventListener();

    private static s_current:GameContext = new GameContext();
    public static get current():GameContext{
        return this.s_current;
    }

    public graphicsRender:GraphicsRender;

    public sceneCameras:Camera[] = [];
    public sceneLight:Light[] =[];


    public sceneTRS:Transform[] = [];
    private m_sceneChanged:boolean = false;

    public mainCamera:Camera;

    public activeContext(){
        GameContext.s_current = this;
    }

    public inactiveContext(){
        GameContext.s_current = null;
    }

    public registerCamera(camera:Camera){
        if(this.sceneCameras.length  == 0){
            this.mainCamera = camera;
        }
        this.sceneCameras.push(camera);
    }

    public unregisterCamera(camera:Camera){
        throw new Error('not impl');
    }
    
    public registerLight(light:Light){
        this.sceneLight.push(light);
    }

    public registerNewGameObject(g:GameObject){
        this.sceneTRS.push(g.transform);
        this.m_sceneChanged =true;
    }

    public setSceneChanged(){
        this.m_sceneChanged = true;
    }

    public destroy(gameobj:GameObject){
        throw new Error('not impl');
    }

    public onFrame(dt:number){
        const rootTRS = this.sceneTRS;
        for(let t= 0;t<rootTRS.length;t++){
            rootTRS[t].gameobject.update();
        }

        if(this.m_sceneChanged){
            this.m_sceneChanged =false;
            this.evtOnSceneUpdate.Invoke();
        }
    }

    public resolveTransformModify(trs:Transform,target:Transform){
        let curp = trs.parent;
        if(curp == null){
            if(target !=null){

                if(!Utility.ListRemove(this.sceneTRS,trs)){
                    throw new Error('transform intern error');
                }
                target.addChild(trs);
            }
        }
        else{
            if(target == null){
                curp.removeChild(trs);

                Utility.ListRemove(this.sceneTRS,trs);
            }
            else{
                curp.removeChild(trs);
                target.addChild(trs);
            }
        }
        this.m_sceneChanged =true;
    } 

}