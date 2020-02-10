import { Scene } from "./Scene";
import { Camera } from "./Camera";
import { Light, LightType } from "./Light";
import { GameObject } from "./GameObject";
import { Transform } from "./Transform";

export class SceneManager{


    private static s_cameras:Camera[] = [];
    private static s_lights:Light[] = [];

    private static s_rootTRS:Transform[] =[];


    private static s_currentScene:Scene;

    public static get currentScene():Scene{
        return SceneManager.s_currentScene;
    }

    public static get allCameras():Camera[]{
        return SceneManager.s_cameras;
    }



    public static Init(){
        this.s_currentScene = new Scene();
    }

    public static onFrame(dt:number){
        let rootTRS = SceneManager.s_rootTRS;

        for(let t=0;t<rootTRS.length;t++){
            rootTRS[t].gameobject.update();
        }
    }
    
    
    // public onFrame(scene:Scene){
    //     scene.onFrameStart();
    //     let strs = scene.transform;
    //     strs.localMatrix;
    //     strs.setObjMatrixDirty(false);
    //     scene.update(scene);
    //     scene.onFrameEnd();
    // }


    public static loadScene(scene:Scene){
        SceneManager.s_currentScene = scene;
    }


    public static addCamera(cam:Camera){
        let cameras = SceneManager.s_cameras;
        if(cameras.includes(cam)) return;
        cameras.push(cam);
    }

    public static removeCamera(cam:Camera){
        let cameras = SceneManager.s_cameras;
        let index = cameras.indexOf(cam);
        if(index >=0){
            SceneManager.s_cameras = cameras.splice(index,1);
        }
    }

    public static addLight(light:Light){
        let lights = SceneManager.s_lights;
        if(lights.includes(light)) return;
        lights.push(light);
    }

    public static removeLight(light:Light){
        let lights = SceneManager.s_lights;
        let index=  lights.indexOf(light);
        if(index >=0){
            SceneManager.s_lights = lights.splice(index,1);
        }
    }

    

    public static resolveNewGameObject(g:GameObject){
        SceneManager.s_rootTRS.push(g.transform);
    }

    public static resolveTransformModify(trs:Transform,target:Transform){
        let curp = trs.parent;
        if(curp == null){
            let rootTRS = SceneManager.s_rootTRS;
            if(target !=null){
                let index = rootTRS.indexOf(trs);
                if(index < 0) throw new Error('transform intern error');
                SceneManager.s_rootTRS = rootTRS.splice(index,1);
                target.addChild(trs);
            }
        }
        else{
            if(target == null){
                curp.removeChild(trs);
                SceneManager.s_rootTRS.push(trs);
            }
            else{
                curp.removeChild(trs);
                target.addChild(trs);
            }
        }
    }

}