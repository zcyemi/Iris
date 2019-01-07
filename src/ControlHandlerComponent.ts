import { Component } from "./Component";
import { Scene } from "./Scene";
import { Input } from "./Input";
import { GraphicsContext } from "./GraphicsContext";
import { glmath, vec3 } from "./math/GLMath";


export class ControlHandlerComponent extends Component{

    private m_selected:boolean = false;

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
            
        }
    }
}
