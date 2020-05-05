import { SampleBase } from "../sampleBase";
import { Skybox, ClearType, vec2, CameraFreeFly, GameObject, Camera, Color } from "../../iris";
import { GameContext } from "../../iris/core/GameContext";

export class SampleBasisSkybox extends SampleBase {

    private m_skybox:Skybox;
    private m_camera:GameObject;

    public onInit() {

        if(this.m_skybox ==null){
            this.m_skybox = Skybox.createFromProcedural();
        }


        let c = new GameObject("Camera");
        let camera = Camera.CreatePersepctive(60,null,0.01,1000);
        camera.clearType = ClearType.Skybox;
        camera.skybox = this.m_skybox;
        c.addComponent(camera);
        c.addComponent(new CameraFreeFly());
        this.m_camera = c;
    }    
    
    public onDestroy() {

        GameContext.current.destroy(this.m_camera);
    }

}
