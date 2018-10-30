import { Component } from "./Component";
import { Transform } from "./Transform";
import { Input } from "./Input";
import { quat, vec3, glmath } from "wglut";
import { Scene } from "./Scene";


export class CameraFreeFly extends Component{
    private m_trs:Transform;
    private m_startpos:vec3 = vec3.zero;
    
    private m_rotay:number= 0;
    private m_rotax:number = 0;
    public onStart(){
        console.log('camera freefly onstart');
        this.m_trs = this.gameobject.transform;
    }
    public onUpdate(scene:Scene){
        let trs = this.m_trs;

        let snapshot = Input.snapshot;


        if(snapshot.getKey('w')){
            trs.applyTranslate(trs.forward.mulToRef(-0.3));
        }
        else if(snapshot.getKey('s')){
            trs.applyTranslate(trs.forward.mulToRef(0.3))
        }
        if(snapshot.getKey('d')){
            trs.applyTranslate(trs.right.mulToRef(-0.3));
        }
        else if(snapshot.getKey('a')){
            trs.applyTranslate(trs.right.mulToRef(0.3));
        }

        if(snapshot.mousewheel){
            let offset = trs.forward.mulNumToRef(snapshot.mousewheelDelta *0.05);
            trs.applyTranslate(offset);
        }

        if(snapshot.getMouseBtn(0)){
            if(snapshot.getMouseDown(0)){
                this.m_startpos.set(snapshot.mousepos);
                let q = trs.localRotation;
                let e = q.toEuler();
                this.m_rotax = e.x;
                this.m_rotay =e.y;
            }
            else{
                let mpos = snapshot.mousepos;
                let spos = this.m_startpos;
                let deltax = mpos.x - spos.x;
                let deltay = mpos.y - spos.y;

                if(deltax != 0 && deltay != 0){
                    const deg2rad = glmath.Deg2Rad;
                    let rotax = this.m_rotax - deltay * deg2rad *0.3;
                    let rotay = this.m_rotay + deltax * deg2rad *0.3;
                    
                    trs.setRotation(quat.fromEuler(rotax,rotay,0));
                }
            }
        }
    }
}