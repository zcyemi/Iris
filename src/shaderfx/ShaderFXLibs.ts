import { ShaderSource } from "./ShaderSource";
import { ShaderFX } from "./ShaderFX";
import { ShaderVariant } from "./ShaderVariant";
import { mat4, GLContext } from "wglut";
import { ShaderDataBuffer, ShaderDataArrayBuffer, ShaderDataFloat32Buffer } from "./ShaderBuffer";
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

    public get shaderUnlitColor():Shader{
        if(this.m_unlitColor == null){
            this.m_unlitColor = ShaderFX.compileShaders(this.glctx,Shader_Unlit_Color);
        }
        return this.m_unlitColor;
    }

    public get shaderUnlitTexture():Shader{
        if(this.m_unlitTexture == null){
            this.m_unlitTexture = ShaderFX.compileShaders(this.glctx,Shader_Unlit_Texture);
        }
        return this.m_unlitTexture;
    }

    public get shaderUVvalue():Shader{
        if(this.m_uvValue == null){
            this.m_uvValue = ShaderFX.compileShaders(this.glctx,Shader_UV_Value);
        }
        return this.m_uvValue;
    }

    public get shaderDiffuse():Shader{
        if(this.m_diffuse == null){
            this.m_diffuse = ShaderFX.compileShaders(this.glctx,Shader_Diffuse);
        }
        return this.m_diffuse;
    }
}

/**ShaderSources */
const Shader_Unlit_Color = new ShaderSource(
    `#version 300 es
    precision mediump float;
    #include SHADERFX_CAMERA
    in vec4 aPosition;
    void main(){
        gl_Position = MATRIX_MVP * aPosition;
    }`,
    `#version 300 es
    precision mediump float;
    uniform vec4 uColor;
    out vec4 fragColor;
    void main(){
        fragColor = uColor;
    }`
);

const Shader_Unlit_Texture = new ShaderSource(
    `#version 300 es
    precision mediump float;
    #include SHADERFX_CAMERA
    in vec4 aPosition;
    in vec2 aUV;
    out vec2 vUV;
    void main(){
        gl_Position = MATRIX_MVP * aPosition;
        vUV = aUV;
    }`,
    `#version 300 es
    precision mediump float;
    in vec2 vUV;
    out vec4 fragColor;
    uniform sampler2D uSampler;
    void main(){
        fragColor = texture(uSampler,vUV);
    }`
);

const Shader_UV_Value = new ShaderSource(
    `#version 300 es
    precision mediump float;
    #include SHADERFX_CAMERA
    in vec4 aPosition;
    in vec2 aUV;
    out vec2 vUV;
    void main(){
        gl_Position = MATRIX_MVP * aPosition;
        vUV = aUV;
    }
    `,
    `#version 300 es
    precision mediump float;
    in vec2 vUV;
    out vec4 fragColor;
    void main(){
        fragColor = vec4(vUV,0,1.0);
    }
    `
)

const Shader_Diffuse = new ShaderSource(
    `#version 300 es
    precision mediump float;
    #include SHADERFX_BASIS

    #queue opaque

    in vec4 aPosition;
    in vec2 aUV;
    in vec4 aNormal;
    struct V2F{
        vec3 pos;
        vec3 normal;
    };
    out V2F v2f;
    void main(){
        vec4 wpos = MATRIX_M * aPosition;
        v2f.pos = wpos.xyz;
        vec4 pos = MATRIX_VP * wpos;
        gl_Position = pos;
        v2f.normal = ObjToWorldDir(aNormal.xyz);
    }
    `,
    `#version 300 es
    precision mediump float;
    #include SHADERFX_LIGHT
    #include SHADERFX_LIGHTING
    struct V2F{
        vec3 pos;
        vec3 normal;
    };
    in V2F v2f;
    out lowp vec4 fragColor;
    uniform vec4 uColor;
    void main(){
        vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor.xyz);
        fragColor = vec4(lcolor + 0.1,1.0);
    }
    `
)

/** Shader DataBuffer */

export class ShaderDataUniformObj extends ShaderDataArrayBuffer{
    public static readonly UNIFORM_OBJ:string = "UNIFORM_OBJ";

    public constructor(){
        let buffersize = 16*4;
        super(buffersize);
    }

    public setMtxModel(mtx:mat4){
        this.setMat4(0,mtx);
    }
}

export class ShaderDataUniformCam extends ShaderDataArrayBuffer{
    public static readonly UNIFORM_CAM:string = "UNIFORM_CAM";


    public constructor(){
        let buffersize = 16*4 *2;
        super(buffersize);
    }

    public setMtxView(mtx:mat4){
        this.setMat4(0,mtx);
    }
    public setMtxProj(mtx:mat4){
        this.setMat4(64,mtx);
    }
}

export class ShaderDataUniformLight extends ShaderDataFloat32Buffer{
    public static readonly LIGHT:string = "LIGHT";

    public constructor (){
        let buffersize = 8 *4+ 4;
        super(buffersize);
    }
}

/** Shader Variants */

const SHADERFX_OBJ = `
uniform UNIFORM_OBJ{
    mat4 _obj2world_;
};
#define MATRIX_M _obj2world_
`;

const SHADERFX_CAMERA:string = `
#include SHADERFX_OBJ
uniform UNIFORM_CAM{
    mat4 _world2view_;
    mat4 _view2proj_;
};
#define MATRIX_V _world2view_
#define MATRIX_P _view2proj_
#define MATRIX_VP MATRIX_P * MATRIX_V
#define MATRIX_MV MATRIX_V * MATRIX_M
#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))
#define MATRIX_MVP MATRIX_P * MATRIX_MV
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)
`;

const SHADERFX_BASIS = `
#include SHADERFX_OBJ
#include SHADERFX_CAMERA
vec3 ObjToWorldDir(in vec3 dir){
    return normalize(dir * mat3(MATRIX_WORLD2OBJ));
}
`

const SHADERFX_LIGHT = `
//#multi_compile LIGHTING LIGHT4 LIGHT8
struct LIGHT_DATA{
    vec4 pos_type;
    vec4 col_intensity;
};
uniform LIGHT{
    LIGHT_DATA light_source[4];
    vec4 ambient_color;
};
#define LIGHT_COLOR0 light_source[0].col_intensity.xyz
#define LIGHT_COLOR1 light_source[1].col_intensity.xyz
#define LIGHT_COLOR2 light_source[2].col_intensity.xyz
#define LIGHT_COLOR3 light_source[3].col_intensity.xyz

#define LIGHT_INTENSITY0 light_source[0].col_intensity.w
#define LIGHT_INTENSITY1 light_source[1].col_intensity.w
#define LIGHT_INTENSITY2 light_source[2].col_intensity.w
#define LIGHT_INTENSITY3 light_source[3].col_intensity.w

#define LIGHT_DIR0 light_source[0].pos_type.xyz
#define LIGHT_DIR1 light_source[1].pos_type.xyz

`

const SHADERFX_SHADOWMAP = `
struct SHADOW_DATA{
    sampler2D uShadowMap;
    mat4 uLightMtx;
};
uniform Shadow{
    SHADOW_DATA shadow_data[4];
};
`

const SHADERFX_LIGHTING = `
vec3 LightModel_Lambert(vec3 lightdir,vec3 lightColor,vec3 normal,vec3 albedo){
    float diff = max(.0,dot(lightdir,normal));
    return albedo * lightColor * diff;
}
`

ShaderFX.registVariant(new ShaderVariant('SHADERFX_OBJ',SHADERFX_OBJ));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_CAMERA',SHADERFX_CAMERA));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_BASIS',SHADERFX_BASIS))
ShaderFX.registVariant(new ShaderVariant('SHADERFX_LIGHT',SHADERFX_LIGHT));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_LIGHTING',SHADERFX_LIGHTING));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_SHADOWMAP',SHADERFX_SHADOWMAP));
ShaderFX.linkAllVariant();

