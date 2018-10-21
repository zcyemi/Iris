import { Texture } from "../Texture";
import { vec4 } from "wglut";

export class BufferDebugInfo{

    public drawRect:vec4;
    private m_texture: WebGLTexture | Texture;

    public constructor(texture:WebGLTexture | Texture,rect:vec4){
        this.m_texture =texture;
        this.drawRect = rect.clone();
    }

    public get rawTexture():WebGLTexture{
        if(this.m_texture instanceof Texture){
            return this.m_texture.rawtexture;
        }
        return this.m_texture;
    }
}