import { ShaderVariant } from "./ShaderVariant";
import { ShaderSource } from "./ShaderSource";
import { GLContext } from "wglut";
import { Shader } from "./Shader";


export enum RenderQueue{
    Opaque,
    Transparent,
    Skybox,
    Image,
    Other
}

export class ShaderFX{

    public static variants:{[key:string]:ShaderVariant} = {};

    public static registVariant(variant:ShaderVariant){
        this.variants[variant.variantName] = variant;
    }
    
    public static linkAllVariant(){
        let variants= ShaderFX.variants;
        for(let key in variants){
            let v = variants[key];
            if(v != null && v instanceof ShaderVariant){
                v.link(variants);
            }
        }
    }

    public static getShader(){
        
    }

    public static compileShaders(glctx:GLContext,source:ShaderSource):Shader{
        if(source == null) return null;
        source.buildShader(ShaderFX.variants);
        if(!source.isBuilt) return null;

        let p = glctx.createProgram(source.vertex,source.pixel);
        if(p == null) return null;

        let shader = new Shader(source,p);

        return shader;
    }

    public static VARIANT_SHADERFX_OBJ = "VARIANT_OBJ";
    public static VARIANT_SHADERFX_CAMERA = "SHADERFX_CAMERA";
    public static VARIANT_SHADERFX_LIGHT = "SHADERFX_LIGHT";
    public static VARIANT_SHADERFX_SHADOWMAP = "SHADERFX_SHADOWMAP";
    public static VARIANT_SHADERFX_LIGHTING = "SHADERFX_LIGHTING";


    public static ATTR_aPosition = "aPosition";
    public static ATTR_aUV = "aUV";
    public static ATTR_aNormal = "aNormal";

    public static UNIFORM_CAM = "UNIFORM_CAM";
    public static UNIFORM_OBJ = "UNIFORM_OBJ";

    public static UNIFORM_MAIN_COLOR = "uColor";
    public static UNIFORM_MAIN_TEXTURE = "uSampler";
}
