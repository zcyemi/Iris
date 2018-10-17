import { Scene } from "./Scene";

export class SceneManager{
    
    public onFrame(scene:Scene){

        scene.onFrameStart();
        let strs = scene.transform;
        strs.setLocalDirty(false);
        strs.setObjMatrixDirty(false);
        scene.update(scene);
        scene.onFrameEnd();
    }
}