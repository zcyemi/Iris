import { Transform } from "../../iris";
import { GameContext } from "../../iris/core/GameContext";
import { BaseEditorGUI } from "./BaseEditorGUI";



export class SceneEditorGUI extends BaseEditorGUI{
    public onInit(){
        GameContext.current.evtOnSceneUpdate.register(()=>{
            this.ui.setDirty();
            console.log('changed');
        }); 
    }

    public onGUI(){
        const ui = this.ui;

        const gamectx = GameContext.current;

        ui.cardBegin("Scene");

        ui.bandage("Cameras");
        let cameras = gamectx.sceneCameras;

        cameras.forEach(item => {
            ui.button(item.gameobject.name,()=>this.msgSelectionObj(item.gameobject));
        });

        ui.divider();

        ui.bandage("Lights");

        gamectx.sceneLight.forEach(item=>{
            ui.text(item.gameobject.name,'p');
        })

        ui.divider();
        this.DrawTRS(gamectx.sceneTRS);
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