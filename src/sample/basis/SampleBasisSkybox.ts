import { SampleBase } from "../sampleBase";
import { Skybox, ClearType, vec2, CameraFreeFly } from "../../iris";
import { GameContext } from "../../iris/core/GameContext";

export class SampleBasisSkybox extends SampleBase {

    private m_skybox:Skybox;
    public onInit() {

        if(this.m_skybox ==null){
            this.m_skybox = Skybox.createFromProcedural();
        }

        let camera = GameContext.current.mainCamera;
        camera.clearType = ClearType.Skybox;
        camera.skybox = this.m_skybox;

        camera.gameobject.addComponent(new CameraFreeFly());
    }    
    
    public onDestroy() {

        let gobj = GameContext.current.mainCamera.gameobject;
        let comp = gobj.getComponent(CameraFreeFly);
        if(comp!=null){
            gobj.removeComponent(comp);
        }
    }

}
