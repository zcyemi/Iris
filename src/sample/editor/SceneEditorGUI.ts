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

        let cameras = gamectx.sceneCameras;
        ui.bandage("Cameras: "+ cameras.length);

        cameras.forEach(item => {
            let g = item.gameobject;
            if(g == null) return;
            ui.button(g.name,()=>this.msgSelectionObj(g));
        });

        ui.divider();

        ui.bandage("Lights");

        gamectx.sceneLight.forEach(item=>{
            ui.text(item.gameobject.name,'p');
        })

        ui.divider();

        ui.bandage("Root: "+ gamectx.sceneTRS.length);
        this.DrawTRS(gamectx.sceneTRS);
        ui.cardEnd();
        
    }

    private DrawTRS(trs:Transform[]){
        const ui = this.ui;

        ui.listBegin(true);
        trs.forEach(item => {
            let children = item.children;

            let gobj = item.gameobject;
            
            let gobjName = gobj == null ? "[null]": gobj.name;
            if(children == null || children.length == 0){
                ui.button(gobjName,()=>this.msgSelectionObj(gobj));
            }
            else{
                ui.cardBegin(gobjName);
                this.DrawTRS(children);
                ui.cardEnd();
            }

            ui.listItemNext();
        });

        ui.listEnd();
    }
}