import { UIContainer } from "@zcyemi/entangui";
import { SceneManager, Transform } from "../../iris";
import { BaseEditorGUI } from "./BaseEditorGUI";



export class SceneEditorGUI extends BaseEditorGUI{
    public onInit(){

        SceneManager.onSceneUpdate = ()=>{
            this.ui.setDirty();
            console.log('changed');
        };
    }

    public onGUI(){
        const ui = this.ui;

        ui.cardBegin("Scene");

        ui.bandage("Cameras");
        let cameras = SceneManager.allCameras;

        cameras.forEach(item => {
            ui.button(item.gameobject.name,()=>this.msgSelectionObj(item.gameobject));
        });

        ui.divider();

        ui.bandage("Lights");

        SceneManager.allLights.forEach(item=>{
            ui.text(item.gameobject.name,'p');
        })

        ui.divider();
        this.DrawTRS(SceneManager.rootTRS);
        ui.cardEnd();
        
    }

    private DrawTRS(trs:Transform[]){
        const ui = this.ui;

        ui.listBegin(true);
        trs.forEach(item => {
            let children = item.children;

            let gobj = item.gameobject;
            if(children == null || children.length == 0){
                ui.button(gobj.name,()=>this.msgSelectionObj(gobj));
            }
            else{
                ui.cardBegin(gobj.name);
                this.DrawTRS(children);
                ui.cardEnd();
            }

            ui.listItemNext();
        });

        ui.listEnd();
    }
}