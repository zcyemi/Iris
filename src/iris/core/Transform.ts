import { mat3, mat4, quat, vec3 } from "../math/GLMath";
import { GameContext } from "./GameContext";
import { GameObject } from "./GameObject";
import { ObjectUtil } from "./Utility";

const KEY_setLocalDirty:string = 'setLocalDirty';

export class Transform{
    //flag for need to recalculate localmtx
    public isLocalTRSDirty:boolean = true;
    //flag for need to recalculate objmtx
    public isObjDirty:boolean = true;

    //mark for any local mtx change, keeps til next frame
    public isDataLocalDirty:boolean = true;
    //mark for any obj mtx change, keep til next frame
    public isDataObjDirty:boolean = true;   

    public get isDirty():boolean{ return this.isDataLocalDirty || this.isDataObjDirty;}

    public localPosition:Readonly<vec3> = ObjectUtil.initPropertyFn(this,"localPosition",vec3.zero,KEY_setLocalDirty);
    public localRotation:Readonly<quat> = ObjectUtil.initPropertyFn(this,"localRotation",quat.Identity,KEY_setLocalDirty);
    public localScale:Readonly<vec3> = ObjectUtil.initPropertyFn(this,"localScale",vec3.one,KEY_setLocalDirty);

    private m_localMtx:mat4 =  mat4.TRS(vec3.zero,quat.Identity,vec3.one);
    private m_objMtx:mat4 = mat4.Identity;
    private m_objMtxInv:mat4;

    private m_worldTRSneedDecomp:boolean= true;
    
    private m_worldPos:vec3;
    private m_worldRota:quat;
    private m_worldScale:vec3;

    private m_right:vec3;
    private m_forward:vec3;
    private m_up:vec3;

    private m_worldRight:vec3;
    private m_worldForward:vec3;
    private m_worldUp:vec3;

    private setLocalDirty(){
        this.isLocalTRSDirty = true;
        this.isDataLocalDirty = true;
    }

    public setObjDirty(){
        this.isObjDirty = true;
        this.isDataObjDirty = true;
    }

    public get localMtx():mat4{
        if(this.isLocalTRSDirty){
            this.isLocalTRSDirty = false;
            this.setObjDirty();
            this.m_localMtx.setTRS(this.localPosition,this.localRotation,this.localScale);
        }
        return this.m_localMtx;
    }

    public set localMtx(mtx:mat4){
        this.m_localMtx = mtx;
        mat4.DecomposeTRS(mtx,this.localPosition,this.localRotation,this.localScale);

        this.m_right = null;
        this.m_forward = null;
        this.m_up = null;

        this.isDataLocalDirty = true;
        this.setObjDirty();
    }

    private updateLocalMtx(){
        if(this.isLocalTRSDirty){
            this.isLocalTRSDirty = false;
            this.setObjDirty();
            this.m_localMtx.setTRS(this.localPosition,this.localRotation,this.localScale);
            this.m_right = null;
            this.m_forward = null;
            this.m_up = null;
        }
    }

    private updateObjMtx(){
        this.updateLocalMtx();
        if(this.isObjDirty){
            this.isObjDirty = false;
            if(this.parent == null){
                this.m_objMtx.set(this.localMtx);
                this.m_worldPos = this.localPosition.clone();
                this.m_worldRota = this.localRotation.clone();
                this.m_worldScale = this.localScale.clone();

                this.m_worldUp = null;
                this.m_worldForward = null;
                this.m_worldRight = null;

                this.m_worldTRSneedDecomp = false;
            }
            else{
                let objMTX = this.parent.objMatrix.mul(this.localMtx);
                this.m_objMtx.set(objMTX);
                this.m_worldTRSneedDecomp = true;
            }
            this.m_objMtxInv = null;
        }
    }

    public get objMatrix():mat4{
        this.updateObjMtx();
        return this.m_objMtx;
    }

    public get worldToLocalMatrix():mat4{
        this.updateObjMtx();
        if(this.m_objMtxInv == null){
            this.m_objMtxInv = this.m_objMtx.inverse();
        }
        return this.m_objMtxInv;
    }

    private decomposeObjMtx(){
        let mtx = this.objMatrix;
        if(!this.m_worldTRSneedDecomp) return;
        let rotamtx = new mat3();
        mat4.DecomposeAffine(mtx,this.m_worldPos,rotamtx,this.m_worldScale);
        this.m_worldRota = quat.MtxToQuat(rotamtx);
        this.m_worldTRSneedDecomp= false;

        this.m_worldUp = null;
        this.m_worldForward = null;
        this.m_worldRight = null;
    }

    public get worldPosition():vec3{
        this.decomposeObjMtx();
        return this.m_worldPos;
    }

    public get worldRotation():quat{
        this.decomposeObjMtx();
        return this.m_worldRota;
    }

    public get worldScale():vec3{
        this.decomposeObjMtx();
        return this.m_worldScale;
    }

    public get position():vec3{
        return this.worldPosition;
    }
    public get rotation():quat{
        return this.worldRotation;
    }

    //up forward right vec

    public get up():vec3{
        if(this.m_up == null){
            this.m_up = this.localRotation.rota(vec3.up);
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
        let right =vec3.SafeCross(up,this.forward).normalized;
        let forward = right.cross(up).normalized;
        this.localRotation = quat.Coordinate(forward,up);
        this.m_up = up;
        this.m_forward.set(forward);
        this.m_right = right;
    }

    public get right():vec3{
        if(this.m_right == null){
            this.m_right = this.localRotation.rota(vec3.right);
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
        let forward = vec3.SafeCross(right,this.up).normalized;
        let up = forward.cross(right);
        this.localRotation = quat.Coordinate(forward,up);
        this.m_up.set(up);
        this.m_forward = forward;
        this.m_right = right;
    }

    public get forward():vec3{
        if(this.m_forward == null){
            this.m_forward = this.localRotation.rota(vec3.forward);
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
        let right = vec3.SafeCross(forward,up).normalized;
        up = forward.cross(right).normalized;

        this.localRotation = quat.Coordinate(forward,up);
        this.m_forward = forward;
        this.m_up.set(up);
        this.m_right =right;
    }

    public get worldForward():vec3{
        this.decomposeObjMtx();
        if(this.m_worldForward==null){
            this.m_worldForward = this.worldRotation.rota(vec3.forward);
        }
        return this.m_worldForward;
    }

    public get worldUp():vec3{
        this.decomposeObjMtx();
        if(this.m_worldUp == null){
            this.m_worldUp = this.worldRotation.rota(vec3.up);
        }
        return this.m_worldUp;
    }

    public get worldRight():vec3{
        this.decomposeObjMtx();
        if(this.m_worldRight == null){
            this.m_worldRight = this.worldRotation.rota(vec3.right);
        }
        return this.m_worldRight;
    }

    /** localToWorld mtx */
    /** worldToLocal mtx */

    private m_children:Transform[];
    private m_parent:Transform;
    private m_gameobj:GameObject;

    public constructor(gobj:GameObject){
        if(gobj == null) throw new Error('show always create transform from gameobj')
        this.m_gameobj = gobj;
    }

    public get gameobject():GameObject{
        return this.m_gameobj;
    }

    public get parent():Transform{
        return this.m_parent;
    }
    public set parent(p:Transform){
        GameContext.current.resolveTransformModify(this,p);
    }

    public update(){
    }

    public get children():Transform[]{
        return this.m_children;
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


    public setLookAt(target:vec3,worldup?:vec3){
        this.setLookDir(target.subToRef(this.localPosition),worldup);
    }

    public setLookDir(forward:vec3,worldup:vec3){
        let f = forward.Normalize();
        if(worldup == null) worldup = this.up;
        let right = vec3.SafeCross(worldup,f).normalized;
        let up = f.cross(right).normalized;
        this.m_up.set(up);
        this.m_right= right;
        this.m_forward = f;
        this.localRotation = quat.Coordinate(f,up);
    }

    /**
     * Apply translate to current transform.
     * @param offset 
     */
    public applyTranslate(offset:vec3,local:boolean = true){
        if(local){
            this.localPosition.add(offset);
        }
        else{
            let p = this.m_parent;
            if(p == null){
                this.localPosition.add(offset);
            }
            else{
                let m = p.worldToLocalMatrix;
                let localoff = m.mulvec(offset.vec4(0));
                this.localPosition.add(localoff);
            }
        }
        this.setLocalDirty();
    }

    /**
     * Apply rotation to current transform.
     * @param q 
     */
    public applyRotate(q:quat){
        this.localRotation.selfRota(q);
        this.forward.mul(q);
        this.up.mul(q);
        this.up.mul(q);
        this.setLocalDirty();
    }
    
    /**
     * Apply scale to current transform.
     * @param scale 
     */
    public applyScale(scale:vec3){
        this.localScale.mul(scale);
        this.setLocalDirty();
    }

    public setPosition(val:vec3){
        this.localPosition.set(val);
        this.setLocalDirty();
    }

    public setPositionRaw(val:number[]){
        this.localPosition.setRaw(val);
        this.setLocalDirty();
    }

    public setRotation(rota:quat){
        this.localRotation.set(rota);
        this.setLocalDirty();
    }

    public setScale(scal:vec3){
        this.localScale.set(scal);
        this.setLocalDirty();
    }

    public setScaleRaw(scal:number[]){
        this.localScale.setRaw(scal);
        this.setLocalDirty();
    }


}
