import { BaseComponentEditor, ComponentEditor } from "./BaseComponentEditor";
import { Camera } from "../../iris";
export class CameraEditor extends BaseComponentEditor<Camera>{
    public onGUI(comp: Camera) {

        const ui = this.ui;

        ui.formNumber("FOV",comp.fov);
        ui.formNumber("Near",comp.near);
        ui.formNumber("Far",comp.far);

        ui.formNumber("Aspect",comp.aspect);
        
    }
}

