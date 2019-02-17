import { Component } from "../core/Component";
import { Transform } from "../core/Transform";
import { Input } from "./Input";
import { quat, glmath, vec4 } from "../math/GLMath";
import { Scene } from "../core/Scene";


export class CameraFreeFly extends Component{
    private m_trs:Transform;
    private m_startpos:vec4 = vec4.zero;
    
    private m_rotay:number= 0;
    private m_rotax:number = 0;
    public onStart(){
        this.m_trs = this.gameobject.transform;
    }
    public onUpdate(scene:Scene){
        let trs = this.m_trs;
        let snapshot = Input.snapshot;

        if(snapshot.getKey('w')){
            trs.applyTranslate(trs.worldForward.mulToRef(-0.3),false);
        }
        else if(snapshot.getKey('s')){
            trs.applyTranslate(trs.worldForward.mulToRef(0.3),false)
        }
        if(snapshot.getKey('d')){
            trs.applyTranslate(trs.worldRight.mulToRef(-0.3),false);
        }
        else if(snapshot.getKey('a')){
            trs.applyTranslate(trs.worldRight.mulToRef(0.3),false);
        }

        if(snapshot.mousewheel){
            let offset = trs.worldForward.mulNumToRef(snapshot.mousewheelDelta *0.05);
            trs.applyTranslate(offset,false);
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
                if(spos.z != 0 || spos.w != 0){
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
}
