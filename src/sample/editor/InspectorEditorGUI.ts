import { GameObject, vec3, quat } from "../../iris";
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

    private m_trsOutput:string;

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

        ui.formVec3("Pos",trs.position.raw,val=>{
            trs.setPosition(new vec3(val));
            console.log(trs.gameobject.name,val);
        });
        ui.formVec3("Rota:",trs.localRotation.raw);
        ui.formVec3("Scale:",trs.localScale.raw,val=>trs.setScale(new vec3(val)));

        
        ui.button("objMtx",()=>this.m_trsOutput = trs.objMatrix.raw+"");

        ui.formTextArea("Output",this.m_trsOutput,3);

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