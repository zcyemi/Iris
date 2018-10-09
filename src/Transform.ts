import { vec3, quat, mat4 } from "wglut";

export class Transform{
    private m_position:vec3 = vec3.zero;
    private m_rotation:quat = quat.Identity;
    private m_scale:vec3 = vec3.one;

    private m_dirty:boolean = true;

    private m_mtx:mat4 = mat4.Identity;

    private m_right:vec3 = vec3.right.clone();
    private m_forward:vec3 = vec3.forward.clone();
    private m_up:vec3 = vec3.up.clone();

    public get localRotation():quat{
        return this.m_rotation;
    }
    public get localPosition():vec3{
        return this.m_position;
    }
    public get localScale():vec3{
        return this.m_scale;
    }

    public set localPosition(pos:vec3){
        this.setPosition(pos);
    }
    public set localScale(s:vec3){
        this.setScale(s);
    }
    public set localRotation(q:quat){
        this.setRotation(q);
    }

    public setRotation(q:quat){
        this.m_rotation.set(q);
        this.m_forward = null;
        this.m_up= null;
        this.m_right = null;
        this.m_dirty =true;
    }

    public setPosition(pos:vec3){
        this.m_position.set(pos);
        this.m_dirty = true;
    }

    public setScale(scale:vec3){
        this.m_scale.set(scale);
        this.m_dirty = true;
    }

    public constructor(){
    }

    public get forward():vec3{
        if(this.m_forward == null){
            this.m_forward = this.m_rotation.rota(vec3.forward);
        }
        return this.m_forward;
    }
    public set forward(dir:vec3){
        let len = dir.length;
        if(len == 0){
            console.warn(`can not set forward to ${dir}`);
            return;
        }
        let forward = dir.divToRef(len);

        let up = this.up;
        let right = forward.cross(up).normalize;
        up = forward.cross(right).normalize;

        this.m_rotation = quat.Coordinate(forward,up);
        this.m_forward = forward;
        this.m_up.set(up);
        this.m_right =right;
        this.m_dirty =true;
    }

    public get up():vec3{
        if(this.m_up == null){
            this.m_up = this.m_rotation.rota(vec3.up);
        }
        return this.m_up;
    }

    public set up(dir:vec3){
        let len = dir.length;
        if(len == 0 ){
            console.warn(`can not set up to ${dir}`);
            return;
        }
        let up = dir.divToRef(len);
        let right = up.cross(this.forward).normalize;
        let forward = right.cross(up).normalize;
        this.m_rotation = quat.Coordinate(forward,up);
        this.m_up = up;
        this.m_forward.set(forward);
        this.m_right = right;

        this.m_dirty =true;
    }

    public get right():vec3{
        if(this.m_right == null){
            this.m_right = this.m_rotation.rota(vec3.right);
        }
        return this.m_right;
    }

    public set right(dir:vec3){
        let len = dir.length;
        if(len == 0 ){
            console.warn(`can not set up to ${dir}`);
            return;
        }
        let right = dir.divToRef(len);
        let forward = right.cross(this.up).normalize;
        let up = forward.cross(right);
        this.m_rotation = quat.Coordinate(forward,up);
        this.m_up.set(up);
        this.m_forward = forward;
        this.right = right;

        this.m_dirty =true;
    }

    public setDirty(dirty:boolean =true){
        this.m_dirty = dirty;
    }

    public isDirty():boolean{ return this.m_dirty;}

    public get ObjMatrix():mat4{
        if(this.m_dirty){
            this.m_mtx.setTRS(this.localPosition,this.localRotation,this.localScale);
            this.m_dirty =false;
        }
        return this.m_mtx;
    }

    public setLookAt(target:vec3,worldup?:vec3){
        this.m_dirty= true;
        this.setLookDir(target.subToRef(this.m_position),worldup);
    }

    public setLookDir(forward:vec3,worldup:vec3){
        this.m_dirty= true;

        let f = forward.normalized();
        if(worldup == null) worldup = this.up;
        let right = worldup.cross(f).normalize;
        let up = f.cross(right).normalize;
        this.m_up.set(up);
        this.m_right= right;
        this.m_forward = f;
        this.m_rotation = quat.Coordinate(f,up);
    }

    public translate(offset:vec3){
        this.localPosition.add(offset);
        this.setDirty();
    }

    public rotate(q:quat){
        this.localRotation.selfRota(q);
        this.m_forward.mul(q);
        this.m_up.mul(q);
        this.m_right.mul(q);
        this.setDirty();
    }
    
    public scale(scale:vec3){
        this.m_scale.mul(scale);
        this.setDirty();
    }


}
