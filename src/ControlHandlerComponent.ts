import { Component } from "./Component";
import { Scene } from "./Scene";
import { Input } from "./Input";
import { GraphicsContext } from "./GraphicsContext";
import { glmath, vec3, quat } from "./math/GLMath";


export class ControlHandlerComponent extends Component{

    private m_selected:boolean = false;
    
    private static s_globalSel

    public onStart(){

    }

    public onUpdate(scene:Scene){
        let camera = scene.mainCamera;
        if(camera == null) return;

        let grender = GraphicsContext.currentRender;
        let trs = this.gameobject.transform;
        let pos = trs.position;

        let snapshot = Input.snapshot;
        let mpos = snapshot.mousepos;

        let mouseDown = snapshot.getMouseDown(0);
        if(mouseDown){
            let viewcoord = grender.canvasCoordToViewCoord(mpos.x,mpos.y);
            let ray = camera.viewPointToRay(glmath.vec3(viewcoord.x,viewcoord.y,0));
            if(ray.sphereIntersect(pos,0.3)){
                this.m_selected = true;
            }
            else{
                this.m_selected = false;
            }
        }

        if(this.m_selected){
            //draw

            if(snapshot.getKey('q')){
                trs.applyTranslate(glmath.vec3(0.05,0,0));
                trs.setLocalDirty(true);
            }else if(snapshot.getKey('e')){
                trs.applyTranslate(glmath.vec3(-0.05,0,0));
                trs.setLocalDirty(true);
            }
            else if(snapshot.getKey('z')){
                trs.applyTranslate(glmath.vec3(0,0,0.05));
                trs.setLocalDirty(true);
            }
            else if(snapshot.getKey('c')){
                trs.applyTranslate(glmath.vec3(0,0,-0.05));
                trs.setLocalDirty(true);
            }
            
            
            grender.gizmos.drawBox(pos,vec3.one,quat.Identity);
        }
    }
}
