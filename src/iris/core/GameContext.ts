import { EventListener } from "../misc/EventListener";
import { Camera } from "./Camera";
import { GameObject } from "./GameObject";
import { GraphicsRender } from "./GraphicsRender";
import { Light } from "./Light";
import { RenderNodeList } from "./RenderNodeList";
import { Transform } from "./Transform";
import { Utility } from "./Utility";

export class GameContext{

    public gamePause:boolean = true;

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

    public nodeList:RenderNodeList = new RenderNodeList();

    public activeContext(){ GameContext.s_current = this;}
    public inactiveContext(){ GameContext.s_current = null;}

    public registerCamera(camera:Camera){
        if(this.sceneCameras.length == 0){
            this.mainCamera = camera;
        }
        this.sceneCameras.push(camera);
    }

    public unregisterCamera(camera:Camera){
        if(camera == null) return;
        if(this.mainCamera == camera){
            this.mainCamera = null;

            let cameras = this.sceneCameras;
            Utility.ListRemove(cameras,camera);
            if(cameras.length >0){
                this.mainCamera = cameras[0];
            }
            else{
                this.mainCamera = null;
            }
        }
        else{
            Utility.ListRemove(this.sceneCameras,camera);
        }

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
        if(gameobj == null) return;

        console.log("Destroy:" + gameobj.name);
        const components = gameobj.components;
        if(components !=null){
            components.forEach(c=>{
                if(c.onDestroy) c.onDestroy();
                c.gameobject = null;
            });
        }

        gameobj.components = null;
        gameobj.active = false;

        const render = gameobj.render;
        if(render!=null){
            render.release(this.graphicsRender.glctx);
            gameobj.render = null;
        }
        const transform = gameobj.transform;
        if(transform.parent!=null){
            transform.parent.removeChild(transform);
        }

        Utility.ListRemove(this.sceneTRS,transform);
        transform.onDestroy();

        gameobj.transform = null;
    }

    public onFrame(dt:number){
        var rootTRS = this.sceneTRS;
        for(let t= 0;t<rootTRS.length;t++){
            rootTRS[t].gameobject.update();
        }

        //Generate RenderNodeList
        this.generateRnederList();


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

    private generateRnederList(){
        const nodeList= this.nodeList;
        nodeList.reset();
        const rootTRS = this.sceneTRS;
        const len = rootTRS.length;
        for(let t=0;t<len;t++){
            let trs = rootTRS[t];
            if(!trs.gameobject.active) continue;
            this.traversalRenderNode(nodeList,trs);
        }

        nodeList.sort();
    }

    private traversalRenderNode(drawlist: RenderNodeList, obj: Transform) {
        let cobj = obj.gameobject;
        if (!cobj.active) return;
        let crender = cobj.render;
        if (crender != null) {
            drawlist.pushRenderNode(crender);
        }

        let children = obj.children;
        if (children == null) return;
        for (let i = 0, len = children.length; i < len; i++) {
            let c = children[i];
            
            this.traversalRenderNode(drawlist, c);
        }
    }


}