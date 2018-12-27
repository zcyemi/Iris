import { GLContext } from "./gl/GLContext";
import { ITexture } from "./Texture";
import { Texture2DCreationDesc } from "./Texture2D";


export interface RenderTextureCreationDesc{
    width:number;
    heigh:number;
    format:number;
}

export class RenderTexture implements ITexture{

    private m_valid:boolean = true;
    private m_raw:WebGLTexture;
    private m_desc:Texture2DCreationDesc;

    public getDesc():Texture2DCreationDesc{
        return this.m_desc;
    }

    public getRawTexture():WebGLTexture{
        return this.m_raw;
    }

    private constructor(){
        
    }

    public static create(glctx:GLContext):RenderTexture{
        return null;
    }

    public release(){
        this.m_valid = false;
    }
}