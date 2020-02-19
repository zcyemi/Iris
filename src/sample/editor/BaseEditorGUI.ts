import { UIContainer } from "@zcyemi/entangui";
import { EventListener } from "../../iris/misc/EventListener";
import { GameObject } from "../../iris";


export var EditorGUIEvent:EventListener = new EventListener();

export abstract class BaseEditorGUI{
    protected ui:UIContainer;

    public constructor(ui:UIContainer){
        this.ui = ui;
    }

    public abstract onInit();
    public abstract onGUI();

    public sendMsg(cmd:string,data:any){
        EditorGUIEvent.Invoke(cmd,data);
    }

    public msgSelectionObj(data:GameObject){
        if(data == null) return;
        this.sendMsg('sel',data);
    }
}