import { Component } from "./Component";
import { Scene } from "./Scene";
import { Input } from "./Input";


export class ControlHandlerComponent extends Component{

    private m_selected:boolean = false;

    public onStart(){

    }

    public onUpdate(scene:Scene){

        let camera = scene.mainCamera;
        if(camera == null) return;

 
        let trs = this.gameobject.transform;
        
        let pos = trs.position;


        let snapshot = Input.snapshot;
        if(snapshot.getMouseDown(0)){
            console.log(pos.raw);
            

        }
        
    }
}