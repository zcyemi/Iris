import { BaseEditorGUI } from "./BaseEditorGUI";
import { GLCmdType } from "../../iris/gl/GLCmdRecord";
import { GameContext } from "../../iris/core/GameContext";


export class DrawCallViewEditorGUI extends BaseEditorGUI{

    public showDrawCall:boolean = false;

    public onInit() {
    }    
    
    
    
    public onGUI() {

        if(!this.showDrawCall) return;

        const ui = this.ui;
        ui.contextBegin('view-drawcall',"mask");

        ui.cardBegin('DrawCall View').classes('center').style({height:'70%',width:'80%'});

        ui.button('Close',()=>this.showDrawCall = false);

        ui.divider();

        let data = GameContext.current.graphicsRender.lastGLCmdRecord;
        if(data == null){
            ui.alert('No FrameData');
            ui.button('Refresh',()=>{});
        }
        else{

            ui.listBegin(false);

            data.commands.forEach(cmd=>{
                ui.bandage(GLCmdType[cmd.type]);
                ui.text(cmd.parameter,'span');
                ui.listItemNext();
            })
            ui.listEnd();
        }

        ui.cardEnd();

        ui.contextEnd('view-drawcall');
    }

    
}