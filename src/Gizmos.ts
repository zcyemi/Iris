import { vec3, f32, quat, vec4 } from "./math/GLMath";

export enum GizmosCmdType{
    none,
    color,
    mark,
    sphere,
    box,
    frustum,
}

export class GizmosCmd{
    public type:GizmosCmdType = GizmosCmdType.none;
    public param0:vec4 = vec4.zero;
    public param1:vec4 = vec4.zero;
    public extra:any;
}

export class Gizmos{

    private m_cmdlist:GizmosCmd[] = [];
    private m_cmdCount:number = 0;
    
    public onframe(){
        this.m_cmdCount =0;
    }

    private getNewCmd():GizmosCmd{
        let cmdlist = this.m_cmdlist;
        if(cmdlist.length <= this.m_cmdCount){
            let newcmd = new GizmosCmd();
            cmdlist.push(newcmd);
            this.m_cmdCount ++;
            return newcmd;
        }
        else{
            let newcmd = cmdlist[this.m_cmdCount];
            this.m_cmdCount ++;
            return newcmd;
        }
    } 

    public drawMark(origin:vec3){
        let newcmd = this.getNewCmd();
        newcmd.type = GizmosCmdType.mark;
        newcmd.param0.setRaw(origin.raw);
    }

    public drawColor(col:vec4){
        let newcmd = this.getNewCmd();
        newcmd.type = GizmosCmdType.color;
        newcmd.param0.setRaw(col.raw);
    }

    public drawSphere(origin:vec3,rad:f32){
        let newcmd = this.getNewCmd();
        newcmd.type = GizmosCmdType.sphere;
        newcmd.param0.setValue(origin.x,origin.y,origin.z,rad);
    }
    public drawBox(origin:vec3,size:vec3,rota:quat){
        let newcmd = this.getNewCmd();
        newcmd.type = GizmosCmdType.box;
        newcmd.param0.setRaw(origin.raw);
        newcmd.param1.setRaw(size.raw);
        newcmd.extra = rota.clone();
    }

    public drawFrustum(){
        throw new Error('not implemented');
    }
}
