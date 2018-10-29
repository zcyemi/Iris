import { vec3, quat, mat4 } from "wglut";
import { GameObject } from "./GameObject";

export class Transform{
    private m_localPosition:vec3 = vec3.zero;
    private m_localRotation:quat = quat.Identity;
    private m_localScale:vec3 = vec3.one;

    private m_worldPositon:vec3;
    private m_worldRotation:quat;
    private m_worldScale:vec3;

    private m_localTRSdirty:boolean = true;
    private m_TRSDirty:boolean = false;
    /**
     * Snapshot of TRS dirty flag at the end of the last updated frame.
     */
    private m_curTRSDirty:boolean = false;

    private m_localMtx:mat4 = mat4.Identity;
    private m_objMtx:mat4 = mat4.Identity;

    private m_right:vec3 = vec3.right.clone();
    private m_forward:vec3 = vec3.forward.clone();
    private m_up:vec3 = vec3.up.clone();

    private m_children:Transform[];
    private m_parent:Transform;
    private m_gameobj:GameObject;

    public constructor(gobj:GameObject){
        this.m_gameobj = gobj;
    }

    public get gameobject():GameObject{
        return this.m_gameobj;
    }

    public get parent():Transform{
        return this.m_parent;
    }
    public set parent(p:Transform){
        if(p == null){
            let curp = this.m_parent;
            if(curp != null){
                curp.removeChild(this);
            }
        }
        else{
            p.addChild(this);
        }
    }

    public set localMatrix(mat:mat4){
        this.m_localTRSdirty = false;

        this.m_localMtx = mat;
        [this.m_localPosition,this.m_localRotation,this.m_localScale] = mat4.Decompose(mat);
        this.m_TRSDirty = true;
    }

    public get localMatrix():mat4{
        if(this.m_localTRSdirty == true){
            this.m_localMtx.setTRS(this.localPosition,this.localRotation,this.localScale);
            this.m_localTRSdirty =false;
            this.m_TRSDirty = true;
        }
        return this.m_localMtx;
    }

    /**
     * Model matrix, MATRIX_M
     */
    public get objMatrix():mat4{
        if(this.m_objMtx == null){
            this.m_objMtx = this.calObjMatrix();
        }
        return this.m_objMtx;
    }

    private calObjMatrix(decompose:boolean = false):mat4{
        let mtx:mat4 = null;
        if(this.parent == null){
            mtx = this.localMatrix.clone();
            this.m_worldPositon = this.m_localPosition.clone();
            this.m_worldRotation = this.m_localRotation.clone();
            this.m_worldScale = this.m_localScale.clone();
        }
        else{
            mtx = this.parent.objMatrix.mul(this.localMatrix);
            if(decompose){
                [this.m_worldPositon,this.m_worldRotation,this.m_worldScale] = mat4.Decompose(mtx);
            }
            else{
                this.m_worldPositon = null;
                this.m_worldRotation = null;
                this.m_worldScale = null;
            }
        }
        return mtx;
    }

    /**
     * world-space position
     */
    public get position():vec3{
        let wpos = this.m_worldPositon;
        if(wpos == null){
            this.m_objMtx = this.calObjMatrix(true);
            wpos =this.m_worldPositon;
        }
        return wpos;
    }

    /**
     * world-space rotation
     */
    public get rotation():quat{
        let wrota = this.m_worldRotation;
        if(wrota == null){
            this.m_objMtx = this.calObjMatrix(true);
            wrota= this.m_worldRotation;
        }
        return wrota;
    }

    /**
     * world-space scale
     */
    public get scale():vec3{
        let wscale = this.m_worldScale;
        if(wscale == null){
            this.m_objMtx = this.calObjMatrix(true);
            wscale = this.m_worldScale;
        }
        return wscale;
    }

    public get children():Transform[]{
        return this.m_children;
    }

    /**
     * local rotation
     */
    public get localRotation():quat{
        return this.m_localRotation;
    }
    public get localPosition():vec3{
        return this.m_localPosition;
    }
    public get localScale():vec3{
        return this.m_localScale;
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
        this.m_localRotation.set(q);
        this.m_forward = null;
        this.m_up= null;
        this.m_right = null;
        this.m_localTRSdirty =true;
        this.m_TRSDirty = true;
    }

    public setPosition(pos:vec3){
        this.m_localPosition.set(pos);
        this.m_localTRSdirty = true;
        this.m_TRSDirty = true;
    }

    public setScale(scale:vec3){
        this.m_localScale.set(scale);
        this.m_localTRSdirty = true;
        this.m_TRSDirty = true;
    }

    public get forward():vec3{
        if(this.m_forward == null){
            this.m_forward = this.m_localRotation.rota(vec3.forward);
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
        let right = vec3.SafeCross(forward,up).normalize;
        up = forward.cross(right).normalize;

        this.m_localRotation = quat.Coordinate(forward,up);
        this.m_forward = forward;
        this.m_up.set(up);
        this.m_right =right;
        this.m_localTRSdirty =true;
        this.m_TRSDirty = true;
    }

    public get up():vec3{
        if(this.m_up == null){
            this.m_up = this.m_localRotation.rota(vec3.up);
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
        let right =vec3.SafeCross(up,this.forward).normalize;
        let forward = right.cross(up).normalize;
        this.m_localRotation = quat.Coordinate(forward,up);
        this.m_up = up;
        this.m_forward.set(forward);
        this.m_right = right;

        this.m_localTRSdirty =true;
        this.m_TRSDirty = true;
    }

    public get right():vec3{
        if(this.m_right == null){
            this.m_right = this.m_localRotation.rota(vec3.right);
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
        let forward = vec3.SafeCross(right,this.up).normalize;
        let up = forward.cross(right);
        this.m_localRotation = quat.Coordinate(forward,up);
        this.m_up.set(up);
        this.m_forward = forward;
        this.right = right;

        this.m_localTRSdirty =true;
        this.m_TRSDirty = true;
    }

    public addChild(trs:Transform):boolean{
        if(trs == null) return false;
        let children = this.m_children;
        if(children == null){
            children = [];
            this.m_children = children;
        }
        let index = children.indexOf(trs);
        if(index >=0) return true;
        trs.m_parent= this;
        children.push(trs);
        return true;
    }

    public removeChild(trs:Transform):boolean{
        let children = this.m_children;
        if(children == null) return false;
        let index = children.indexOf(trs);
        if(index < 0) return false;
        trs.m_parent = null;
        this.m_children = children.splice(index,1);
        return true;
    }

    public setLocalDirty(dirty:boolean =true){
        this.m_localTRSdirty = dirty;
        if(dirty){
            this.m_TRSDirty = true;
        }
    }

    public setObjMatrixDirty(pmtxdirty:boolean){
        let dirty = this.m_TRSDirty || pmtxdirty;
        this.m_curTRSDirty = dirty;
        this.m_TRSDirty = false;
        if(dirty){
            this.m_objMtx = null;
            this.m_worldPositon = null;
            this.m_worldRotation = null;
            this.m_worldScale = null;
        }

    }

    public get isDirty():boolean{ return this.m_localTRSdirty || this.m_curTRSDirty;}

    public setLookAt(target:vec3,worldup?:vec3){
        this.m_localTRSdirty= true;
        this.setLookDir(target.subToRef(this.m_localPosition),worldup);
    }

    public setLookDir(forward:vec3,worldup:vec3){
        this.m_localTRSdirty= true;

        let f = forward.normalized();
        if(worldup == null) worldup = this.up;
        let right = vec3.SafeCross(worldup,f).normalize;
        let up = f.cross(right).normalize;
        this.m_up.set(up);
        this.m_right= right;
        this.m_forward = f;
        this.m_localRotation = quat.Coordinate(f,up);
    }

    /**
     * Apply translate to current transform.
     * @param offset 
     */
    public applyTranslate(offset:vec3){
        this.localPosition.add(offset);
        this.setLocalDirty();
    }

    /**
     * Apply rotation to current transform.
     * @param q 
     */
    public applyRotate(q:quat){
        this.localRotation.selfRota(q);
        this.m_forward.mul(q);
        this.m_up.mul(q);
        this.m_right.mul(q);
        this.setLocalDirty();
    }
    
    /**
     * Apply scale to current transform.
     * @param scale 
     */
    public applyScale(scale:vec3){
        this.m_localScale.mul(scale);
        this.setLocalDirty();
    }


}
