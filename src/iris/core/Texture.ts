import { GLContext } from "../gl/GLContext";
import { undefinedOr } from "./Utility";
import { GL } from "../gl/GL";


export interface ITexture{
    getRawTexture():WebGLTexture;
    getDesc():TextureCreationDesc;
    release(glctx:GLContext);
}

export enum TextureType{
    Color,
    Depth,
    DepthStencil,
}



export interface TextureCreationDesc {
    format?: number;
    internalformat: number;
    mipmap?: boolean;
    min_filter?: number;
    mag_filter?: number;
    wrap_s?: number;
    wrap_t?: number;
    compare_mode?:number;
}


export class TextureDescUtility{

    public static fillDefault(desc:TextureCreationDesc){
        if(desc.internalformat != null){
            if(desc.format == null){
                desc.format = desc.internalformat;
            }
        }
        else{
            throw new Error("invalid texcture creation desc");
        }
        
        desc.wrap_s = undefinedOr(desc.wrap_s,GL.CLAMP_TO_EDGE);
        desc.wrap_t = undefinedOr(desc.wrap_t,GL.CLAMP_TO_EDGE);
        desc.min_filter = undefinedOr(desc.min_filter,GL.LINEAR);
        desc.mag_filter = undefinedOr(desc.mag_filter,GL.LINEAR);
        desc.mipmap = undefinedOr(desc.mipmap,false);
    }

    public static get DefaultRGBA():TextureCreationDesc{
        let desc:TextureCreationDesc = {
            internalformat: GL.RGBA,
            format: GL.RGBA
        };
        TextureDescUtility.fillDefault(desc);
        return desc;
    }

    public static get DefaultRGB():TextureCreationDesc{
        let desc:TextureCreationDesc = {
            internalformat: GL.RGB,
            format: GL.RGB
        };
        TextureDescUtility.fillDefault(desc);
        return desc;
    }

    public static clone(desc:TextureCreationDesc):TextureCreationDesc{
        let c:TextureCreationDesc = { internalformat: desc.internalformat};
        for (let p in desc) {
            c[p] = desc[p];
        }
        return c;
    }

    public static getTexFmtType(internalformat:number):TextureType{
        if(GL.isDepthFmt(internalformat)) return TextureType.Depth;
        if(GL.isDepthStencilFmt(internalformat)) return TextureType.DepthStencil;
        return TextureType.Color;
    }
}
