import { mat3, mat4, vec3, vec4 } from "../math/GLMath";
import { PropertyUpdater, Utility } from "./Utility";
import { GLContext, GL } from "../gl";
import { GameContext } from "./GameContext";

const TYPE_SIZE:{[key:string]:number}={
    mat4: 64,
    mat3: 36,
    mat2: 16,
    vec2: 8,
    vec3: 12,
    vec4: 16,
}

export class ShaderUniformBuffer{

    public uniformName:string;
    public uniformIndex:number;

    public glbuffer:WebGLBuffer;
    public isDirty:boolean = true;
    public data:ArrayBuffer;

    public dataView:DataView;

    private minoff:number =0;
    private maxoff:number =0;

    public constructor(unifomr_name:string,uniform_index:number,bytesize?:number){
        this.uniformIndex = uniform_index;
        this.uniformName = unifomr_name;
       
        if(bytesize!=null){
            this.initBufferSize(bytesize);
        }

        this.isDirty = false;
    }

    public initBufferSize(bytesize:number){
        this.data = new ArrayBuffer(bytesize);
        this.dataView = new DataView(this.data);

        const glctx = GameContext.current.graphicsRender.glctx;
        let buffer =glctx.createBufferAndBind(GL.UNIFORM_BUFFER);
        glctx.bufferData(GL.UNIFORM_BUFFER,this.data,GL.DYNAMIC_DRAW);
        glctx.bindBufferBase(GL.UNIFORM_BUFFER,this.uniformIndex,buffer);
        this.glbuffer = buffer;
    }

    public setFloat32(offset:number,val:number){
        this.dataView.setFloat32(offset,val,true);
        this.isDirty = true;
    }

    public dirtyOffset(offset:number,size:number){
        this.minoff = Math.min(offset,this.minoff);
        this.maxoff = Math.max(this.maxoff,offset+size);
    }

    public setmat4(offset:number,val:mat4){
        let raw = val.raw;
        const dv = this.dataView;
        
        let off = offset;
        this.dirtyOffset(off,64);
        for(let t=0;t<16;t++){

            dv.setFloat32(off,raw[t],true);
            off+=4;
        }
        this.isDirty = true;
    }

    public setvec4(offset:number,val:vec4){

        const raw = val.raw;
        const dv =this.dataView;

        let off = offset;
        this.dirtyOffset(off,16);
        for(let t=0;t<4;t++){
            dv.setFloat32(off,raw[t],true);
            off+=4;
        }
        this.isDirty=  true;
    }

    public submitData(gl:GLContext){
        if(!this.isDirty) return;

        gl.bindBuffer(GL.UNIFORM_BUFFER,this.glbuffer);
        let minoff = this.minoff;

        gl.bufferSubData(GL.UNIFORM_BUFFER,minoff,this.dataView,minoff,this.maxoff - minoff);
        gl.bindBuffer(GL.UNIFORM_BUFFER,null);

        this.minoff = this.data.byteLength;
        this.maxoff = 0;

        this.isDirty = false;

    }

}

export abstract class ShaderUniformData extends ShaderUniformBuffer{

    public constructor(unifomr_name:string,uniform_index:number,bytesize?:number){
        super(unifomr_name,uniform_index,bytesize);
    }

    public init(){
        this.initBufferSize(this.m_autoIncOffset);
        return this;
    }

    private m_autoIncOffset:number = 0;
    protected initProperty<T>(name:string,type:new ()=>T,defval?:T,byteoff?:number):T{
        var self = this;

        const typename = type.prototype.constructor.name;
        const internalName:string = `__${name}`;
        const setFuncName= `set${typename}`;

        var setFunc:(offset:number,val:T)=>void  = this[setFuncName].bind(self);
        var offset = byteoff;

        const size = TYPE_SIZE[typename];
        if(byteoff == null){
            offset = this.m_autoIncOffset;
            this.m_autoIncOffset += size;
        }

        this[internalName] = defval;
        this.dirtyOffset(offset,size);

        Object.defineProperty(this,name,{
            configurable:false,
            enumerable:false,
            get: function(){
                return self[internalName];
            },
            set:function(newval:T){
                if(newval == undefined){
                    return;
                }
                self[internalName] = newval;
                setFunc(offset,newval);
            }
        });
        return undefined;
    }
}