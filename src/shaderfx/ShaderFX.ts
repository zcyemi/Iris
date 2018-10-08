import { ShaderVariant, ShaderOptionsConfig } from "./ShaderVariant";
import { ShaderSource } from "./ShaderSource";
import { GLContext } from "wglut";
import { Shader } from "./Shader";
import { ShaderGen } from "./ShaderGenerated";

export class ShaderFX{

    public static variants:{[key:string]:ShaderVariant} = {};

    private static s_variantsLinked:boolean = false;

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
        if(!ShaderFX.s_variantsLinked){
            ShaderFX.linkAllVariant();
            ShaderFX.s_variantsLinked = true;
        }
        if(source == null) return null;
        source.buildShader(ShaderFX.variants);
        if(!source.isBuilt) return null;


        let optconfig = new ShaderOptionsConfig(source.optionsList);
        let compileFlags = optconfig.compileFlag;
        let [vs,ps] = source.injectCompileFlags(compileFlags);
        let p = glctx.createProgram(vs,ps);
        if(p == null) return null;

        let shader = new Shader(source,p,optconfig,glctx);
        shader.tags = source.tags;

        return shader;
    }


    public static VARIANT_SHADERFX_OBJ = "SHADERFX_OBJ";
    public static VARIANT_SHADERFX_CAMERA = "SHADERFX_CAMERA";
    public static VARIANT_SHADERFX_BASIS = "SHADERFX_BASIS";
    public static VARIANT_SHADERFX_LIGHT = "SHADERFX_LIGHT";
    public static VARIANT_SHADERFX_SHADOWMAP = "SHADERFX_SHADOWMAP";
    public static VARIANT_SHADERFX_LIGHTING = "SHADERFX_LIGHTING";


    public static ATTR_aPosition = "aPosition";
    public static ATTR_aUV = "aUV";
    public static ATTR_aNormal = "aNormal";

    public static UNIFORM_CAM = "UNIFORM_CAM";
    public static UNIFORM_OBJ = "UNIFORM_OBJ";
    public static UNIFORM_SHADOWMAP = "UNIFORM_SHADOWMAP";

    public static UNIFORM_MAIN_COLOR = "uColor";
    public static UNIFORM_MAIN_TEXTURE = "uSampler";
}



export function ShaderFile(vsfile:string,psfile?:string){
    return function(target:any,key:string){
        if(psfile == null){
            psfile = vsfile;
        }
        target[key] = getShaderSource(vsfile,psfile);
    }
}

export function ShaderInc(filename:string){
    return function(target:any,key:string){
        let variant = getShaderInclude(filename);
        target[key] = variant;
        ShaderFX.registVariant(variant);
    }
}

function getShaderSource(vss:string,pss:string){
    let vs = ShaderGen[vss+'_vs'];
    let ps = ShaderGen[pss+'_ps'];
    if(vs != null && ps != null){
        return new ShaderSource(vs,ps);
    }
    throw new Error(`shader source invalid : ${vss} ${pss}`);
}

function getShaderInclude(src:string){
    let inc = ShaderGen[src];
    if(inc == null){
        throw new Error(`shader include invalid : ${src}`);
    }
    return new ShaderVariant(src.toUpperCase(),inc);
}