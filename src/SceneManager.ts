import { Scene } from "./Scene";

export class SceneManager{
    
    public onFrame(scene:Scene){
        scene.camera.update();
        scene.update();
    }
}