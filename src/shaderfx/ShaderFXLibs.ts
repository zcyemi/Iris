import { ShaderSource } from "./ShaderSource";
import { ShaderFX, ShaderFile, ShaderInc } from "./ShaderFX";
import { ShaderVariant } from "./ShaderVariant";
import { mat4, GLContext, vec4, vec3 } from "wglut";
import { ShaderDataArrayBuffer, ShaderDataFloat32Buffer } from "./ShaderBuffer";
import { Shader } from "./Shader";

export class ShaderFXLibs{
    private glctx:GLContext;
    public constructor(glctx:GLContext){
        this.glctx = glctx;
    }

    private m_unlitColor:Shader;
    private m_unlitTexture:Shader;
    private m_uvValue:Shader;
    private m_diffuse:Shader;
    private m_skybox:Shader;
    private m_depth:Shader;

    private m_pbrMetallicRoughness:Shader;

    @ShaderFile("UnlitColor")
    public static SH_unitColor:ShaderSource;
    @ShaderFile("UnlitTexture")
    public static SH_unlitTexture:ShaderSource;
    @ShaderFile("uvValue")
    public static SH_uvValue:ShaderSource;
    @ShaderFile("diffuse")
    public static SH_diffuse:ShaderSource;
    @ShaderFile("skybox")
    public static SH_skybox:ShaderSource;
    @ShaderFile("pbrMetallicRoughness")
    public static SH_pbrMetallicRoughness:ShaderSource;
    @ShaderFile("depth")
    public static SH_depth:ShaderSource;

    @ShaderInc(ShaderFX.VARIANT_SHADERFX_OBJ)
    public static SHADERFX_OBJ:ShaderVariant;
    @ShaderInc(ShaderFX.VARIANT_SHADERFX_CAMERA)
    public static SHADERFX_CAMERA:ShaderVariant;
    @ShaderInc(ShaderFX.VARIANT_SHADERFX_BASIS)
    public static SHADERFX_BASIS:ShaderVariant;
    @ShaderInc(ShaderFX.VARIANT_SHADERFX_LIGHT)
    public static SHADERFX_LIGHT:ShaderVariant;
    @ShaderInc(ShaderFX.VARIANT_SHADERFX_LIGHTING)
    public static SHADERFX_LIGHTING:ShaderVariant;
    @ShaderInc(ShaderFX.VARIANT_SHADERFX_SHADOWMAP)
    public static SHADERFX_SHADOWMAP:ShaderVariant;


    public get shaderUnlitColor():Shader{
        if(this.m_unlitColor == null){
            this.m_unlitColor = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_unitColor);
        }
        return this.m_unlitColor;
    }

    public get shaderUnlitTexture():Shader{
        if(this.m_unlitTexture == null){
            this.m_unlitTexture = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_unlitTexture);
        }
        return this.m_unlitTexture;
    }

    public get shaderUVvalue():Shader{
        if(this.m_uvValue == null){
            this.m_uvValue = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_uvValue);
        }
        return this.m_uvValue;
    }

    public get shaderDiffuse():Shader{
        if(this.m_diffuse == null){
            this.m_diffuse = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_diffuse);
        }
        return this.m_diffuse;
    }

    public get shaderSkybox():Shader{
        if(this.m_skybox == null){
            this.m_skybox = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_skybox);
        }
        return this.m_skybox;
    }

    public get shaderPbrMetallicRoughness():Shader{
        if(this.m_pbrMetallicRoughness == null){
            this.m_pbrMetallicRoughness = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_pbrMetallicRoughness);
        }
        return this.m_pbrMetallicRoughness;
    }

    public get shaderDepth():Shader{
        if(this.m_depth == null){
            this.m_depth = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_depth);
        }
        return this.m_depth;
    }

    public release(){

    }

    public reload(){
        // for(let key in this){
        //     let shader = this[key];
        //     if(shader == null) continue;
        //     if(shader instanceof Shader){
        //         shader.release();
        //         this[key] = null;
        //     }
        // }
    }


    public static readonly SH_PBR_BaseColorFactor:string = "uColor";
    public static readonly SH_PBR_BaseColorTexture:string = "uSampler";
    public static readonly SH_PBR_MetallicFactor:string = "uMetallic";
    public static readonly SH_PBR_RoughnessFactor:string = "uRoughness";
    public static readonly SH_PBR_MetallicRoughnessTexture:string = "uTexMetallicRoughness";

    public static readonly SH_PBR_EmissiveFactor:string = "uEmissive";
    public static readonly SH_PBR_EmissiveTexture:string = "uTexEmissive";
    
}

/** Shader DataBuffer */

export class ShaderDataUniformObj extends ShaderDataFloat32Buffer{
    public static readonly UNIFORM_OBJ:string = "UNIFORM_OBJ";

    public constructor(){
        let buffersize = 16;
        super(buffersize);
    }

    public setMtxModel(mtx:mat4){
        this.setMat4(0,mtx);
    }
}

export class ShaderDataUniformCam extends ShaderDataFloat32Buffer{
    public static readonly UNIFORM_CAM:string = "UNIFORM_CAM";


    public constructor(){
        let buffersize = 16*4 *2 + 16 + 16 + 16;
        super(buffersize);
    }

    public setMtxView(mtx:mat4){
        this.setMat4(0,mtx);
    }
    public setMtxProj(mtx:mat4){
        this.setMat4(16,mtx);
    }

    public setCameraPos(pos:vec3){
        this.setVec4(32,pos.vec4(1));
    }

    public setClipPlane(near:number,far:number){
        this.setFloat(36,near);
        this.setFloat(37,far);
        this.setFloat(38,1.0/near);
        this.setFloat(39,1.0/far);
    }

    public setScreenSize(width:number,height:number){
        this.setFloat(40,width);
        this.setFloat(41,height);
        this.setFloat(42,1.0/width);
        this.setFloat(43,1.0/height);
    }
    
}

export class ShaderDataUniformLight extends ShaderDataFloat32Buffer{
    public static readonly UNIFORM_LIGHT:string = "LIGHT";

    public constructor (){
        let buffersize = 8 *4+ 4;
        super(buffersize);
    }

    public setLightData(pos:vec3,type:number,index:number){
        let offset = index * 8;
        this.setVec3(offset,pos);
        this.setFloat(offset+3,type);
    }

    public setLightColorIntensity(col:vec3,intensity:number,index:number){
        let offset = index * 8;
        this.setVec3(offset+4,col);
        this.setFloat(offset+7,intensity);
    }

    public setAmbientColor(ambient:vec4){
        this.setVec4(32,ambient);
    }

}

export class ShaderDataUniformShadowMap extends ShaderDataArrayBuffer{

    public constructor(){
        let buffersize = 16 *4 *4 + 4;
        super(buffersize);
    }
    public setLightMtx(mtx:mat4,index:number){
        this.setMat4(index *16 *4,mtx);
    }
    
    public setShadowDistance(dist:null){

    }

    public setCascadeCount(count:number){

    }
}
