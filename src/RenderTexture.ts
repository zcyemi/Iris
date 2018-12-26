import { GLContext } from "./gl/GLContext";


export interface RenderTextureCreationDesc{
    width:number;
    heigh:number;
    format:number;
}

export class RenderTexture{

    private m_valid:boolean = true;
    private constructor(){
        
    }

    public static create(glctx:GLContext):RenderTexture{
        
        return null;
    }

    public release(){
        this.m_valid = false;
    }
}