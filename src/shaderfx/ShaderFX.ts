import { ShaderVariant, ShaderOptionsConfig } from "./ShaderVariant";
import { ShaderSource } from "./ShaderSource";
import { GLContext } from "../gl/GLContext";
import { Shader, ShaderTags } from "./Shader";
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
        let p =  Shader.CreateProgram(glctx,vs,ps);
        if(p == null) return null;

        let shader = new Shader(source,p,optconfig,glctx);

        let tags= source.tags;
        if(tags == null){
            tags = new ShaderTags();
        }
        tags.fillDefaultVal();
        shader.tags = tags;

        return shader;
    }

    public static isInternalUniformBlockName(blockname:string):boolean{
        const CLASS = ShaderFX;
        if(blockname ==CLASS.UNIFORM_BASIS || blockname == CLASS.UNIFORM_OBJ || blockname == CLASS.UNIFORM_SHADOWMAP) return true;
        return false;
    }


    public static VARIANT_SHADERFX_OBJ = "SHADERFX_OBJ";
    public static VARIANT_SHADERFX_CAMERA = "SHADERFX_CAMERA";
    public static VARIANT_SHADERFX_BASIS = "SHADERFX_BASIS";
    public static VARIANT_SHADERFX_LIGHT = "SHADERFX_LIGHT";
    public static VARIANT_SHADERFX_SHADOWMAP = "SHADERFX_SHADOWMAP";
    public static VARIANT_SHADERFX_LIGHTING = "SHADERFX_LIGHTING";

    public static OPT_SHADOWMAP_SHADOW = "SHADOW";
    public static OPT_SHADOWMAP_SHADOW_ON = "ON";
    public static OPT_SHADOWMAP_SHADOW_OFF = "OFF";

    public static ATTR_aPosition = "aPosition";
    public static ATTR_aUV = "aUV";
    public static ATTR_aNormal = "aNormal";

    public static UNIFORM_BASIS = "UNIFORM_BASIS";
    public static UNIFORM_OBJ = "UNIFORM_OBJ";
    public static UNIFORM_LIGHT = "UNIFORM_LIGHT";
    public static UNIFORM_SHADOWMAP = "UNIFORM_SHADOWMAP";
    public static UNIFORM_SHADOWMAP_SAMPLER = "uShadowMap";

    public static UNIFORM_MAIN_COLOR = "uColor";
    public static UNIFORM_MAIN_TEXTURE = "uSampler";

    public static readonly GL_TEXTURE_FB:number = 0x84C0;
    public static readonly GL_TEXTURE_DEPTH:number = 0x84C1;
    public static readonly GL_TEXTURE_TEMP:number = 0x84C2;
    public static readonly GL_TEXTURE_DEF_TEX:number = 0x84C3;

    public static readonly GL_TEXTURE_FB_ID:number = 0;
    public static readonly GL_TEXTURE_TEMP_ID:number = 2;
    public static readonly GL_TEXTURE_DEF_TEX_ID:number = 3;

    //Texture used in shader sampler
    public static readonly GL_SH_TEXTURE0:number = 	0x84C4;
    public static readonly GL_SH_TEXTURE1:number = 	0x84C5;
    public static readonly GL_SH_TEXTURE2:number = 	0x84C6;
    public static readonly GL_SH_TEXTURE3:number = 	0x84C7;
    public static readonly GL_SH_TEXTURE4:number = 	0x84C8;
    public static readonly GL_SH_TEXTURE5:number = 	0x84C9;
    public static readonly GL_SH_TEXTURE6:number = 	0x84C10;
    public static readonly GL_SH_TEXTURE7:number = 	0x84C11;

    public static readonly GL_SH_TEXTURE0_ID:number = 	4;
    public static readonly GL_SH_TEXTURE1_ID:number = 	5;
    public static readonly GL_SH_TEXTURE2_ID:number = 	6;
    public static readonly GL_SH_TEXTURE3_ID:number = 	7;
    public static readonly GL_SH_TEXTURE4_ID:number = 	8;
    public static readonly GL_SH_TEXTURE5_ID:number = 	9;
    public static readonly GL_SH_TEXTURE6_ID:number = 	10;
    public static readonly GL_SH_TEXTURE7_ID:number = 	11;

    public static readonly GL_SHADOWMAP_TEX0:number = 0x84CC;
    public static readonly GL_SHADOWMAP_TEX1:number = 0x84CD;
    public static readonly GL_SHADOWMAP_TEX2:number = 0x84CE;
    public static readonly GL_SHADOWMAP_TEX3:number = 0x84CF;

    public static readonly GL_SHADOWMAP_TEX0_ID:number = 12;
    public static readonly GL_SHADOWMAP_TEX1_ID:number = 13;
    public static readonly GL_SHADOWMAP_TEX2_ID:number = 14;
    public static readonly GL_SHADOWMAP_TEX3_ID:number = 15;
}



export function ShaderFile(vsfile:string,psfile?:string){
    return function(target:any,key:string){
        if(psfile == null){
            psfile = vsfile;
        }
        target[key] = getShaderSource(vsfile,psfile,key);
    }
}

export function ShaderInc(filename:string){
    return function(target:any,key:string){
        let variant = getShaderInclude(filename);
        target[key] = variant;
        ShaderFX.registVariant(variant);
    }
}

function getShaderSource(vss:string,pss:string,name?:string){
    let unified = ShaderGen[vss];
    if(unified !=null){
        return ShaderSource.create(unified,name);
    }

    let vs = ShaderGen[vss+'_vs'];
    let ps = ShaderGen[pss+'_ps'];

    if(vs != null && ps != null){
        return new ShaderSource(vs,ps,name);
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


