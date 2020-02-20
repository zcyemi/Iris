import { GameObject } from "../../iris";
import { BaseEditorGUI } from "./BaseEditorGUI";


export class InspectorEditorGUI extends BaseEditorGUI{

    public target:GameObject;

    public setTargetGameObj(gobj:GameObject){
        this.target = gobj;
    }

    public onInit() {

    }    
    
    public onGUI() {
        const ui = this.ui;

        ui.cardBegin("Inspector");
        {
            this.drawTarget();
            
        }
        ui.cardEnd();
    }

    private drawTarget(){
        let tar = this.target;
        if(tar == null){
            return;
        }

        const ui = this.ui;


        ui.button('toggle active',()=>tar.active = !tar.active);

        ui.divider();

        let trs = tar.transform;

        trs.position;

        ui.text("Pos:"+trs.position.raw);
        ui.text("Rot:"+trs.localRotation.raw);
        ui.text("Sca:"+trs.localScale.raw);

        ui.divider();


        const render = tar.render;

        if(render == null){
            ui.text('Render:None');
        }
        else{
            ui.text('Render:'+ render.renderQueue);
        }

        ui.divider();

        let comp = tar.components;

        if(comp == null){
            ui.text("Components: none");   
        }
        else{
            ui.treeBegin('Components');
            ui.listBegin(true);
            comp.forEach(item=>{
                ui.text(item.compType);
            })
            ui.listEnd();
            ui.treeEnd();
        }
    }


}