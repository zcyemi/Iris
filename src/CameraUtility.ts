import { Component } from "./Component";
import { Transform } from "./Transform";
import { Input } from "./Input";
import { quat, vec3 } from "wglut";


export class CameraFreeFly extends Component{
    private m_trs:Transform;
    private m_startpos:vec3 = vec3.zero;
    private m_startq: quat = quat.Identity;
    public onStart(){
        this.m_trs = this.gameobject.transform;
    }
    public onUpdate(){
        let trs = this.m_trs;

        let snapshot = Input.snapshot;


        if(snapshot.getKey('w')){
            trs.translate(trs.forward.mulToRef(-0.3));
        }
        else if(snapshot.getKey('s')){
            trs.translate(trs.forward.mulToRef(0.3))
        }
        if(snapshot.getKey('d')){
            trs.translate(trs.right.mulToRef(-0.3));
        }
        else if(snapshot.getKey('a')){
            trs.translate(trs.right.mulToRef(0.3));
        }

        if(snapshot.mousewheel){
            const q= quat.fromEulerDeg(0,3,0);
            const p = q.conjugate();
            trs.rotate(snapshot.mousewheelDelta > 0? q: p);
        }

        if(snapshot.getMouseBtn(0)){
            if(snapshot.getMouseDown(0)){
                this.m_startpos.set(snapshot.mousepos);
                this.m_startq.set(trs.localRotation);
            }
            else{
                let mpos = snapshot.mousepos;
                let spos = this.m_startpos;
                let deltax = mpos.x - spos.x;
                let deltay = mpos.y - spos.y;

                if(deltax != 0 && deltay != 0){
                    let q = quat.fromEulerDeg(-deltay,deltax,0);
                    trs.setRotation(q.mul(this.m_startq));
                }
            }
        }
    }
}