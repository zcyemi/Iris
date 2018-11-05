import { vec3, mat4, quat } from "wglut";
import { GameObject } from "./GameObject";

/**
 * WIP efactoring
 * substitution of class Transform.
 */
export class Trans{

    //local space
    private m_localPosition:vec3 = vec3.zero;
    private m_localRotation:quat = quat.Identity;
    private m_localScale:vec3 = vec3.one;
    private m_localMtx:mat4 = mat4.Identity;
    private m_localMtxDirty:boolean = true;

    private m_locaLTRSDirty:boolean = false;

    //world psace
    private m_worldpos:vec3 = vec3.zero;
    private m_worldRotation:quat = quat.Identity;
    private m_worldScale:vec3 = vec3.one;
    private m_worldMtx:mat4 = mat4.Identity;
    private m_worldMtxInv:mat4;

    /**
     * mark for any values changed of world.TRS
     */
    private m_worldMtxDirty:boolean= false;

    /**
     * This mark set to true when worldPosition changed.
     * For setting local/world position, accessing worldPosition should not invoke @function <updateWorldMatrix> .
     */
    private m_worldPosDirty:boolean = false;
    private m_worldScaleDirty:boolean = false;
    private m_worldRotaDirty:boolean = false;

    private m_up:vec3;
    private m_right:vec3;
    private m_forward:vec3; 

    public get up():vec3{
        return this.worldRotation.rota(vec3.up);
    }
    public get right():vec3{
        return this.worldRotation.rota(vec3.right);
    }
    public get forward():vec3{
        return this.worldRotation.rota(vec3.forward);
    }

    //nodes
    private m_children:Trans[];
    private m_parent:Trans;
    private m_gameobj:GameObject;

    //getter /setter

    public get localMtx():mat4{
        this.updateLocalMtx();
        return this.m_localMtx;
    }

    public get localPosition():vec3{ return this.m_localPosition;}
    public get localRoataion():quat{ return this.m_localRotation;}
    public get localScale():vec3{ return this.m_localScale;}
    
    public get worldPosition():vec3{
        if(this.m_worldPosDirty)this.updateWorldMatrix(false);
        return this.m_worldpos;
    }
    public get worldRotation():quat{
        if(this.m_worldRotaDirty){
            this.updateWorldMatrix(false);
        }
        return this.m_worldRotation;
    }
    public get worldScale():vec3{
        if(this.m_worldScaleDirty)this.updateWorldMatrix(false);
        return this.m_worldScale;
    }
    public get worldMtx():mat4{
        this.updateWorldMtx();
        return this.m_worldMtx;
    }
    public get objectToWorldMatrix():mat4{
        if(this.m_worldMtxInv == null){
            this.m_worldMtxInv = this.worldMtx.inverse();
        }
        return this.m_worldMtxInv;
    }
    public get parentWorldMtx(){
        const identity = mat4.Identity;
        if(this.m_parent == null) return identity;
        return this.m_parent.worldMtx;
    }
    public get parent():Trans {return this.m_parent;}
    public set parent(p:Trans){
        if(p == null){
            let curp = this.m_parent;
            if(curp != null) curp.removeChild(this);
        }
        else{
            p.addChild(this);
        }
    }
    public get children():Trans[]{ return this.m_children;}

    /**
     * set position default is world-space
     * @param pos 
     * @param worldspace @default true
     */
    public setPosition(pos:vec3,worldspace:boolean = true){
        if(worldspace){
            this.m_worldpos.set(pos);
            const p = this.m_parent;
            if(p == null){
                this.m_localPosition.set(pos);
            }
            else{
                this.m_localPosition = p.objectToWorldMatrix.mulvec(pos.vec4(1.0)).vec3();
            }
            this.m_localMtxDirty = true;
            this.m_locaLTRSDirty = true;
            this.m_worldMtxDirty = true;
        }
        else{
            this.m_localPosition.set(pos);
            this.m_localMtxDirty = true;
            this.m_locaLTRSDirty = true;
            this.m_worldMtxDirty = true;
            this.m_worldPosDirty = true;
        }
    }

    /** set local scale */
    public setScale(scale:vec3){
        this.m_localScale.set(scale);
        this.m_localMtxDirty= true;
        this.m_locaLTRSDirty = true;
        this.m_worldMtxDirty = true;
        this.m_worldScaleDirty = true;
    }

    /**
     * set rotation, world-space is default
     * @param q 
     * @param worldspace @default true
     */
    public setRotation(q:quat,worldspace:boolean = true){
        if(worldspace){
            this.m_worldRotation.set(q);
            let p =this.parent;
            if(p == null){
                this.m_localRotation.set(q);
            }
            else{
                this.m_localRotation = quat.Div(q,this.m_parent.worldRotation);
            }
            this.m_localMtxDirty = true;
            this.m_locaLTRSDirty = true;
            this.m_worldMtxDirty = true;
        }
        else{
            this.m_localRotation.set(q);
            this.m_localMtxDirty = true;
            this.m_locaLTRSDirty = true;
            this.m_worldMtxDirty = true;
            this.m_worldRotaDirty = true;
        }
    }

    private updateLocalMtx(){
        if(!this.m_localMtxDirty) return;
        this.m_localMtx.setTRS(this.m_localPosition,this.m_localRotation,this.m_localScale);
        this.m_localMtxDirty = false;
    }

    private updateWorldMtx(){
        if(this.m_worldMtxDirty){
            let p = this.parent;
            if(p == null){
                this.m_worldMtx.set(this.localMtx);
            }
            else{
                this.m_worldMtx = p.worldMtx.mul(this.localMtx);
            }
            this.m_worldMtxDirty = false;
        }
    }

    public updateWorldMatrix(pwmtxDirty:boolean){
        let needUpdate = this.m_locaLTRSDirty || pwmtxDirty;
        if(needUpdate){
            let p = this.m_parent;
            if(p == null){
                this.m_worldMtx.set(this.localMtx);
                this.m_worldpos.set(this.m_localPosition);
                this.m_worldRotation.set(this.m_localRotation);
                this.m_worldScale.set(this.m_localScale);
            }
            else{
                let wmtx = p.worldMtx.mul(this.localMtx);
                this.m_worldMtx.set(wmtx);
                mat4.DecomposeTRS(wmtx,this.m_worldpos,this.m_worldRotation,this.m_worldScale);
            }

            this.m_worldScaleDirty = false;
            this.m_worldPosDirty = false;
            this.m_worldRotaDirty = false;

        }

        this.m_locaLTRSDirty = false;
        this.m_worldMtxDirty = false;
    }

    public removeChild(trs:Trans):boolean{
        let children = this.m_children;
        if(children == null) return false;
        let index = children.indexOf(trs);
        if(index < 0) return false;

        trs.m_parent = null;
        trs.m_worldMtxDirty = true;
        trs.m_worldPosDirty = true;
        trs.m_worldRotaDirty = true;
        trs.m_worldScaleDirty = true;

        children.splice(index,1);
        return true;
    }

    public addChild(trs:Trans):boolean{
        if(trs == null) return false;
        let children = this.m_children;
        if(children == null){
            children = [];
            this.m_children = children;
        }
        let index = children.indexOf(trs);
        if(index >=0) return true;
        trs.m_parent= this;
        trs.m_worldMtxDirty = true;
        trs.m_worldPosDirty = true;
        trs.m_worldRotaDirty = true;
        trs.m_worldScaleDirty = true;

        children.push(trs);
        return true;
    }

}