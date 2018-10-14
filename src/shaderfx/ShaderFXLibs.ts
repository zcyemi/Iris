import { ShaderSource } from "./ShaderSource";
import { ShaderFX, ShaderFile, ShaderInc } from "./ShaderFX";
import { ShaderVariant } from "./ShaderVariant";
import { mat4, GLContext } from "wglut";
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
        let buffersize = 16*4 *2;
        super(buffersize);
    }

    public setMtxView(mtx:mat4){
        this.setMat4(0,mtx);
    }
    public setMtxProj(mtx:mat4){
        this.setMat4(16,mtx);
    }
}

export class ShaderDataUniformLight extends ShaderDataFloat32Buffer{
    public static readonly LIGHT:string = "LIGHT";

    public constructor (){
        let buffersize = 8 *4+ 4;
        super(buffersize);
    }
}

export class ShaderDataUniformShadowMap extends ShaderDataArrayBuffer{

    public constructor(){
        let buffersize = 16 *4 *4 + 4 + 4;
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
