import { Camera } from "./Camera";
import { Light } from "./Light";
import { GraphicsRender } from "./GraphicsRender";

export class GameContext{
    private static s_current:GameContext = new GameContext();
    public static get current():GameContext{
        return this.s_current;
    }

    public graphicsRender:GraphicsRender;

    public sceneCameras:Camera[] = [];
    public sceneLight:Light[] =[];

    public mainCamera:Camera;

    public activeContext(){
        GameContext.s_current = this;
    }

    public inactiveContext(){
        GameContext.s_current = null;
    }

    public registerCamera(camera:Camera){
        if(this.sceneCameras.length ==0){
            this.sceneCameras.push(camera);
            this.mainCamera = camera;
        }
        else{
            this.sceneCameras.push(camera);
        }
    }

    public unregisterCamera(camera:Camera){

    }
}