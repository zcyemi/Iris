import { Component } from "./Component";
import { Transform } from "./Transform";
import { Input } from "./Input";
import { quat } from "wglut";


export class CameraFreeFly extends Component{
    private m_trs:Transform;
    public onStart(){
        this.m_trs = this.gameobject.transform;
    }

    public onUpdate(){
        let trs = this.m_trs;
        if(Input.getKey('w')){
            trs.translate(trs.forward.mulToRef(-0.3));
        }
        else if(Input.getKey('s')){
            trs.translate(trs.forward.mulToRef(0.3))
        }
  
        if(Input.getKey('d')){
            trs.translate(trs.right.mulToRef(-0.3));
        }
        else if(Input.getKey('a')){
            trs.translate(trs.right.mulToRef(0.3));
        }

        if(Input.isMouseWheel()){
            const q= quat.fromEulerDeg(0,3,0);
            const p = q.conjugate();
            trs.rotate(Input.getMouseWheelDelta() > 0? q: p);
        }
    }
}