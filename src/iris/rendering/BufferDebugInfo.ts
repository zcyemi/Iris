import { Texture2D } from "../core/Texture2D";
import { vec4 } from "../math/GLMath";
import { ITexture } from "../core/Texture";
import { RenderTexture } from "../core/RenderTexture";

type DebugInfoTex = WebGLTexture | Texture2D | ITexture;

export class BufferDebugInfo{

    public drawRect:vec4;
    private m_texture: DebugInfoTex;

    public constructor(texture:DebugInfoTex,rect:vec4){
        this.m_texture =texture;
        this.drawRect = rect.clone();
    }

    public get rawTexture():WebGLTexture{
        let tex = this.m_texture;
        if(tex instanceof Texture2D){
            return tex.getRawTexture();
        }
        else if(tex instanceof RenderTexture){
            return tex.getRawTexture();
        }
        return this.m_texture;
    }

    public setTexture(tex:DebugInfoTex){
        this.m_texture = tex;
    }
}
