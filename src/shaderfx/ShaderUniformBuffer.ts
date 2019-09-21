import { ShaderData } from "./ShaderBuffer";
import { GLContext } from "../gl/GLContext";
import { IGraphicObj } from "../core/IGraphicObj";
import { GL } from "../gl/GL";


export class ShaderUniformBuffer<T extends ShaderData> implements IGraphicObj{

    private m_glbuffer:WebGLBuffer;
    private m_data:T;

    private m_uniformIndex:number;
    
    public readonly name:string;

    public get data():T{ return this.m_data;}
    public get buffer():WebGLBuffer{ return this.m_glbuffer;}
    public get uniformIndex():number { return this.m_uniformIndex;}

    public constructor(glctx:GLContext,datatype:new()=>T,uniformIndex:number,uniform_name:string){
        let data =new datatype();
        let buffer = glctx.createBufferAndBind(GL.UNIFORM_BUFFER);
        glctx.bufferData(GL.UNIFORM_BUFFER,data.fxbuffer.raw,GL.DYNAMIC_DRAW);
        glctx.bindBufferBase(GL.UNIFORM_BUFFER,uniformIndex,buffer);
        this.m_glbuffer = buffer;
        this.m_uniformIndex = uniformIndex;
        this.m_data = data;
        this.name = uniform_name;
    }
    
    public uploadBufferData(glctx:GLContext):boolean{
        return this.m_data.submitBuffer(glctx.getWebGLRenderingContext(),this.m_glbuffer);
    }

    public release(glctx:GLContext){
        glctx.deleteBuffer(this.m_glbuffer);
        this.m_glbuffer = null;
        this.m_data = null;
        this.m_uniformIndex = undefined;
    }
}
