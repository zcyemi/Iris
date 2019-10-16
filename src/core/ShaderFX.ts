import { AssetsDataBase, AssetsBundle } from "./AssetsDatabase";
import { BinaryBuffer } from "ts-binary-serializer/dist/src/BinaryBuffer";
import { RenderQueue } from "../pipeline/RenderQueue";
import { Shader } from "./Shader";


export class ShaderFXTechnique {
    public name: string;
    public meta_pipeline: { [key: string]: string | string[] } = {};
    public meta_multicompile: string[];
    public meta_es_ver: string = "300 es";
    public attr_vs:{[key:string]:string} = {};
    public attr_ps:{[key:string]:string} = {};
    public entry_vs: string;
    public entry_ps: string;
}

export class ShaderFXSource{
    public technique:ShaderFXTechnique;
    public vertex:string;
    public fragment:string;
}



export enum Comparison{
    NEVER = 512,
    LESS = 513,
    EQUAL = 514,
    LEQUAL = 515,
    GREATER = 516,
    NOTEQUAL = 517,
    GEQUAL = 518,
    ALWAYS = 519
}

export enum BlendOperator{
    ADD = 32774,
    MIN = 32775,
    MAX = 32776,
    SUBTRACT = 32778,
    RESERVE_SUBSTRACT = 32779,
}

export enum BlendFactor{
    ONE = 1,
    ZERO = 0,
    SRC_COLOR = 768,
    ONE_MINUS_SRC_COLOR = 769,
    SRC_ALPHA = 770,
    ONE_MINUS_SRC_ALPHA = 771,
    DST_ALPHA = 772,
    ONE_MINUS_DST_ALPHA = 773,
    DST_COLOR = 774,
    ONE_MINUS_DST_COLOR = 775,
    SRC_ALPHA_SATURATE = 776,
    
    CONSTANT_ALPHA = 32771,
    ONE_MINUS_CONSTANT_ALPHA = 32772,
    CONSTANT_COLOR = 32769,
    ONE_MINUS_CONSTANT_COLOR = 32770,
}

export enum CullingMode{
    Front = 0x0404,
    Back = 0x0405,
    FRONT_AND_BACK = 0x0408,
    None = 0x0B44,
}



export class ShaderTags{
    public queue?:RenderQueue;
    public ztest?:Comparison;
    public zwrite?:boolean;
    public blend:boolean = false;
    public blendOp?:BlendOperator;
    public blendFactorSrc?:BlendFactor;
    public blendFactorDst?:BlendFactor;
    public culling?:CullingMode;

    public clone(){
        let tags = new ShaderTags();
        tags.queue= this.queue;
        tags.ztest = this.ztest;
        tags.zwrite = this.zwrite;
        tags.blendOp = this.blendOp;
        tags.blendFactorDst = this.blendFactorDst;
        tags.blendFactorSrc = this.blendFactorSrc;
        tags.culling = this.culling;

        return tags;
    }

    public fillDefaultVal(){
        if(this.queue == null) this.queue = RenderQueue.Opaque;
        if(this.zwrite == null) this.zwrite = true;
        if(this.ztest == null) this.ztest = Comparison.LEQUAL;
        if(this.culling == null) this.culling = CullingMode.Back;

        if(this.blendOp == null) this.blendOp = BlendOperator.ADD;
        if(this.blendFactorSrc == null) this.blendFactorSrc = BlendFactor.SRC_ALPHA;
        if(this.blendFactorDst == null) this.blendFactorDst = BlendFactor.ONE_MINUS_SRC_ALPHA;
    }

    public toString():string{
        return `
            queue:${RenderQueue[this.queue]}
            ztest:${Comparison[this.ztest]}
            zwrite:${this.zwrite}
            blend:${this.blend}
            blendOp:${BlendOperator[this.blendOp]}
            blendSrc:${BlendFactor[this.blendFactorSrc]}
            blendDst:${BlendFactor[this.blendFactorDst]}
            culling:${CullingMode[this.culling]}
        `
    }
}

export class ShaderFX{


    public static readonly SH_MAIN_COLOR:string = "_MainColor";
    public static readonly SH_MAIN_TEXTURE:string = "_MainTexture";
    public static readonly SH_NORMAL_TEXTURE:string ="_NormalTexture";

    public static readonly SH_PBR_SPECULAR:string = "_Specular";
    public static readonly SH_PBR_GLOSSINESS:string = "_Glossiniess";
    public static readonly SH_PBR_METALLIC:string = "_Metallic";
    public static readonly SH_PBR_ROUGHNESS:string = "_Roughness";
    public static readonly SH_PBR_EMISSIVE:string = "_Emissive";
    public static readonly SH_PBR_METALLIC_ROUGHNESS_TEX = "_MetallicRoughnessTex";
    public static readonly SH_PBR_SPECULAR_GLOSSINESS_TEX = "_SpecularGlossinessTex";

    public static readonly GL_TEXTURE_FB:number = 0x84C0;
    public static readonly GL_TEXTURE_DEPTH:number = 0x84C1;
    public static readonly GL_TEXTURE_TEMP:number = 0x84C2;
    public static readonly GL_TEXTURE_DEF_TEX:number = 0x84C3;

    //Texture used in shader sampler
    public static readonly GL_SH_TEXTURE0: number = 0x84C4;
    public static readonly GL_SH_TEXTURE1: number = 0x84C5;
    public static readonly GL_SH_TEXTURE2: number = 0x84C6;
    public static readonly GL_SH_TEXTURE3: number = 0x84C7;
    public static readonly GL_SH_TEXTURE4: number = 0x84C8;
    public static readonly GL_SH_TEXTURE5: number = 0x84C9;
    public static readonly GL_SH_TEXTURE6: number = 0x84C10;
    public static readonly GL_SH_TEXTURE7: number = 0x84C11;

    public static readonly GL_SHADOWMAP_TEX0: number = 0x84CC;
    public static readonly GL_SHADOWMAP_TEX1: number = 0x84CD;
    public static readonly GL_SHADOWMAP_TEX2: number = 0x84CE;
    public static readonly GL_SHADOWMAP_TEX3: number = 0x84CF;

    private static s_shaderCache:Map<string,Shader> = new Map();

    public static findShaderSource(bundle:string|AssetsBundle,shaderName:string): ShaderFXSource|null{

        let bundleObj:AssetsBundle = null;
        if(bundle instanceof AssetsBundle){
            bundleObj = bundle;
        }
        else{
            bundleObj = AssetsDataBase.getLoadedBundle(bundle);
        }
        
        if(bundleObj == null ) return null;
        let entry = bundleObj.getResource(shaderName);
        if(entry == null) return null;
        
        let bianrbuffer = BinaryBuffer.createWithView(bundleObj.data,entry.data_offset,entry.data_size);
        let shaderjson = bianrbuffer.readString();
        return JSON.parse(shaderjson);
    }


    public static findShader(bundle:string|AssetsBundle,shaderName:string): Shader|null{
        let shadername:string = null;
        if(bundle instanceof AssetsBundle){
            shadername = `${bundle.bundlename}/${shaderName}`
        }
        else{
            shadername = `${bundle}/${shaderName}`;
        }
        let sh = this.s_shaderCache.get(shadername);
        if(sh !=null) return sh;

        let source = ShaderFX.findShaderSource(bundle,shaderName);
        if(source==null) return null;

        let shader = new Shader(source);
        this.s_shaderCache.set(shadername,shader);

        return shader;
    }

}