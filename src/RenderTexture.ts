import { GLContext } from "./gl/GLContext";
import { ITexture, TextureCreationDesc } from "./Texture";



export interface RenderTextureCreationDesc{
    width:number;
    heigh:number;
    format:number;
}

export class RenderTexture implements ITexture{

    private m_valid:boolean = true;
    private m_raw:WebGLTexture;
    private m_desc:TextureCreationDesc;

    public getDesc():TextureCreationDesc{
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
