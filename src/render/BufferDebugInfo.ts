import { Texture2D } from "../Texture2D";
import { vec4 } from "../math/GLMath";


export class BufferDebugInfo{

    public drawRect:vec4;
    private m_texture: WebGLTexture | Texture2D;

    public constructor(texture:WebGLTexture | Texture2D,rect:vec4){
        this.m_texture =texture;
        this.drawRect = rect.clone();
    }

    public get rawTexture():WebGLTexture{
        if(this.m_texture instanceof Texture2D){
            return this.m_texture.getRawTexture();
        }
        return this.m_texture;
    }

    public setTexture(tex:WebGLTexture | Texture2D){
        this.m_texture = tex;
    }
}
