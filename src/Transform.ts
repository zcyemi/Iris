import { vec3, quat, mat4 } from "wglut";

export class Transform{
    public position:vec3 = vec3.zero;
    public rotation:quat = quat.Identity;
    public scale:vec3 = vec3.one;

    private m_dirty:boolean = true;

    private m_mtx:mat4 = mat4.Identity;

    private m_right:vec3 = null;
    private m_forward:vec3 = null;
    private m_up:vec3 = null;

    public constructor(){
    }

    public get forward():vec3{
        if(this.m_forward == null){
            this.m_forward = this.rotation.rota(vec3.forward).normalize();
        }
        return this.m_forward;
    }

    public get up():vec3{
        if(this.m_up == null){
            this.m_up = vec3.Cross(this.forward,this.right).normalize();

        }
        return this.m_up;
    }

    public get right():vec3{
        if(this.m_right == null){
            this.m_right = this.rotation.rota(vec3.right);
        }
        return this.m_right;
    }

    public setDirty(dirty:boolean =true){
        this.m_dirty = dirty;
        if(dirty){
            this.m_up = null;
            this.m_forward = null;
            this.m_right = null;
        }

    }

    public isDirty():boolean{ return this.m_dirty;}

    public get ObjMatrix():mat4{
        if(this.m_dirty){
            this.m_mtx.setTRS(this.position,this.rotation,this.scale);
            this.m_dirty =false;
        }
        return this.m_mtx;
    }

    public setLookAt(target:vec3,worldup:vec3 = vec3.up){
        this.m_dirty= true;
        this.m_forward = target.clone().sub(this.position).normalize();
        this.m_right = vec3.Cross(worldup.normalized(),this.m_forward);
        this.m_up = vec3.Cross(this.m_forward,this.m_right);
        this.rotation = quat.FromTo(vec3.forward,this.m_forward);
    }

    public setLookDir(forward:vec3,worldup:vec3 = vec3.up){
        this.m_dirty= true;
        this.m_forward = forward.normalized();
        this.m_right = vec3.Cross(worldup.normalized(),this.m_forward);
        this.m_up = vec3.Cross(this.m_right,this.m_forward);
    }

    public translate(offset:vec3){
        this.position.add(offset);
    }

    public rotate(q:quat){
        this.rotation.selfRota(q);
        this.setDirty();
    }

}
