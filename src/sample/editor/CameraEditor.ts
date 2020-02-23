import { BaseComponentEditor, ComponentEditor } from "./BaseComponentEditor";
import { Camera, ClearType } from "../../iris";
import { UIUtility } from "./UIutil";

const SEL_CLEARTYPE = UIUtility.getEnumSelector(ClearType);

export class CameraEditor extends BaseComponentEditor<Camera>{


    public onGUI(comp: Camera) {

        const ui = this.ui;

        ui.formNumber("FOV",comp.fov,val=>comp.fov = val);
        ui.formNumber("Near",comp.near,val=>comp.near = val);
        ui.formNumber("Far",comp.far,val=>comp.far = val);

        ui.formNumber("Aspect",comp.aspect,val=>comp.aspect = val);
        ui.formTextArea("ProjMtx",comp.ProjMatrix.raw+"",3);

        ui.divider();

        ui.formSelect("ClearType",SEL_CLEARTYPE,ClearType[comp.clearType],val=>{
            comp.clearType = ClearType[val];
        });


        ui.divider();

        ui.formTextArea("ViewMtx",comp.ViewMatrix.raw+"",3);
        

        
    }
}

