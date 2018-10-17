import { Scene } from "./Scene";

export class SceneManager{
    
    public onFrame(scene:Scene){

        scene.onFrameStart();
        scene.update(scene);
        scene.onFrameEnd();
    }
}