import { ShaderSource } from "./ShaderSource";
import { ShaderFX, ShaderFile, ShaderInc } from "./ShaderFX";
import { ShaderVariant } from "./ShaderVariant";
import { ShaderData, ShaderSubData } from "./ShaderBuffer";
import { Shader } from "./Shader";
import { vec3, vec4, mat4 } from "../math/GLMath";
import { GLContext } from "../gl/GLContext";

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
    private m_shadermap:Shader;
    private m_blit:Shader;
    private m_sprite:Shader;

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
    @ShaderFile("shadowmap")
    public static SH_shadowmap:ShaderSource;
    @ShaderFile("blit")
    public static SH_blit:ShaderSource;
    @ShaderFile("sprite")
    public static SH_sprite:ShaderSource;

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

    public get shaderShadowMap():Shader{
        if(this.m_shadermap == null){
            this.m_shadermap = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_shadowmap);
        }
        return this.m_shadermap;
    }

    public get shaderBlit():Shader{
        if(this.m_blit == null){
            this.m_blit = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_blit);
        }
        return this.m_blit;
    }

    public get shaderSprite():Shader{
        if(this.m_sprite == null){
            this.m_sprite = ShaderFX.compileShaders(this.glctx,ShaderFXLibs.SH_sprite);
        }
        return this.m_sprite;
    }

    public release(){
    }

    public reload(){
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

export class ShaderDataUniformObj extends ShaderData{
    public static readonly UNIFORM_OBJ:string = "UNIFORM_OBJ";
    public constructor(){
        let buffersize = 16*4;
        super(buffersize);
        this.buffer.setMat4(0,mat4.Identity);
    }
    public setMtxModel(mtx:mat4){
        this.buffer.setMat4(0,mtx);
    }
}

export class ShaderDataUniformLight extends ShaderData{
    public static readonly UNIFORM_LIGHT:string = "UNIFORM_LIGHT";
    public constructor (){
        let buffersize = (8 *4+ 4) *4;
        super(buffersize);
    }
    public setLightData(pos:vec3,type:number,index:number){
        let offset = index * 32;
        const buffer = this.buffer;
        buffer.setVec3(offset,pos);
        buffer.setFloat(offset+12,type);
    }
    public setLightColorIntensity(col:vec3,intensity:number,index:number){
        let offset = index * 32 + 16;
        const buffer = this.buffer;
        buffer.setVec3(offset,col);
        buffer.setFloat(offset+12,intensity);
    }
    public setAmbientColor(ambient:vec4){
        this.buffer.setVec4(128,ambient);
    }
}

export class ShaderDataUniformShadowMap extends ShaderData{
    public constructor(){
        let buffersize = 16 *4 *4 + 4;
        super(buffersize);
    }
    public setLightMtx(mtx:mat4,index:number){
        this.buffer.setMat4(index *64,mtx);
    }
    public setShadowDistance(dist:null){
    }
    public setCascadeCount(count:number){
    }
}

export class ShaderDataBasis extends ShaderData{
    public readonly render:ShaderDataRender;
    public readonly camrea:ShaderDataCamera;
    public readonly ambientfog:ShaderDataAmbientFog;
    public constructor(){
        super(32 + 224 + 48);
        this.render = new ShaderDataRender(this);
        this.camrea = new ShaderDataCamera(this);
        this.ambientfog = new ShaderDataAmbientFog(this);
    }
    public updateDataBasic(data:ShaderDataRender){
        if(data.isSeperated){
            this.buffer.setOfSubData(data);
            data.setDirty = false;
        }
    }
    public updateDataCamera(data:ShaderDataCamera){
        if(data.isSeperated){
            this.buffer.setOfSubData(data);
            data.setDirty = false;
        }
    }
    public updateDateAmbeintFog(data:ShaderDataAmbientFog){
        if(data.isSeperated){
            this.buffer.setOfSubData(data);
            data.setDirty = false;
        }
    }

    public submitBuffer(gl:WebGL2RenderingContext,glbuffer:WebGLBuffer):boolean{
        let min = this.buffer.offsetMin;
        let max = this.buffer.offsetMax;
        let t = super.submitBuffer(gl,glbuffer);
        //if(t)console.log(min,max);
        return t;
    }
}

export class ShaderDataRender extends ShaderSubData{
    //[0,16] vec4 _screenparam_
    //[16,32] highp vec4 _time_
    public constructor(data?:ShaderData){
        super(data,32,0);
    }
    public setScreenParam(width:number,height:number){
        this.view.setVec4(0,new vec4([width,height,1.0/width,1.0/height]));
    }
    public setTime(t:number,ts:number){
        this.view.setVec4(16,new vec4([t,ts,Math.sin(t),Math.cos(t)]));
    }
}

export class ShaderDataCamera extends ShaderSubData{
    //[0,16] vec4 _camera_pos_;
    //[16,80] mat4 _camera_mtx_view_;
    //[80,96] vec4 _camera_projparam_;
    //[96,160] mat4 _camera_mtx_proj_;
    //[160,224] mat4 _camera_mtx_invproj_;

    public constructor(data?:ShaderData){
        super(data,224,32);
    }
    public setProjParam(near:number,far:number){
        this.view.setVec4(80,new vec4([near,far,1.0/near,1.0/far]));
    }
    public setCameraPos(pos:vec3){
        this.view.setVec3(0,pos);
    }
    public setCameraMtxView(view:mat4){
        this.view.setMat4(16,view);
    }
    public setCameraMtxProj(proj:mat4,invproj?:mat4){
        const view = this.view;
        view.setMat4(96,proj);
        if(invproj == null){
            view.setMat4(160,proj.inverse());
        }
        else{
            view.setMat4(160,invproj);
        }
    }
}

/**
 * 
 */
export class ShaderDataAmbientFog extends ShaderSubData{
    //[0,16] lowp vec4 _ambientcolor_;
    //[16,32] vec4 _fogcolor_;
    //[32,48] vec4 _fogparam_;
    public constructor(data?:ShaderData){
        super(data,48,256);
    }
    public setAmbientColor(col:vec4){
        this.view.setVec4(0,col);
    }
    public setFogColor(col:vec4){
        this.view.setVec4(16,col);
    }
    public setFogParam(param:vec4){
        this.view.setVec4(32,param);
    }
}
