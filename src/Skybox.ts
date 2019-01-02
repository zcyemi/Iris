import { Texture2D } from "./Texture2D";
import { TextureCubeMap } from "./TextureCubeMap";
import { ITexture } from "./Texture";



export enum SkyboxType{
    CubeMap="CUBE",
    Tex360="TEX",
    Procedural="PCG",
    Custom="CUSTOM",
}


export class Skybox {

    private m_rawtex:ITexture;
    private m_type:SkyboxType;

    public get type():SkyboxType{ return this.m_type;}
    public get rawTex():ITexture{return this.m_rawtex;}

    protected constructor(type:SkyboxType) {
        this.m_type =type;
    }

    public static createFromCubeMap(cubemap: TextureCubeMap): Skybox {
        if(cubemap==null) return null;
        let sb = new Skybox(SkyboxType.CubeMap);
        sb.m_rawtex = cubemap;
        return sb;
    }

    public static createFromTex360(tex:Texture2D):Skybox{
        if(tex == null) return null;
        let sb = new Skybox(SkyboxType.Tex360);
        sb.m_rawtex = tex;
        return sb;
    }
    
    public static createFromProcedural():Skybox{
        let sb = new Skybox(SkyboxType.Procedural);
        return sb;
    }
}

