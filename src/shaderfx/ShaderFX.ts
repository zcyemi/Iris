import { ShaderVariant } from "./ShaderVariant";


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

    public static compileShaders(){

    }

    public static VARIANT_SHADERFX_OBJ = "VARIANT_OBJ";
    public static VARIANT_SHADERFX_CAMERA = "SHADERFX_CAMERA";
    public static VARIANT_SHADERFX_LIGHT = "SHADERFX_LIGHT";
    public static VARIANT_SHADERFX_SHADOWMAP = "SHADERFX_SHADOWMAP";
    public static VARIANT_SHADERFX_LIGHTING = "SHADERFX_LIGHTING";

}

const SHADERFX_OBJ = `
uniform UNIFORM_OBJ{
    mat4 _obj2world_;
}
#define MATRIX_M _obj2world_
`;

const SHADERFX_CAMERA:string = `
#include SHADERFX_OBJ
uniform UNIFORM_CAM{
    mat4 _world2view_;
    mat4 _view2proj_;
}
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
uniform Light{
    LIGHT_DATA light_source[4];
    vec4 ambient_color;
}
#define LIGHT_COLOR0 light_source[0].col_intensity.xyz
#define LIGHT_COLOR1 light_source[1].col_intensity.xyz
#define LIGHT_COLOR2 light_source[2].col_intensity.xyz
#define LIGHT_COLOR3 light_source[3].col_intensity.xyz

#define LIGHT_INTENSITY0 light_source[0].col_intensity.w
#define LIGHT_INTENSITY0 light_source[1].col_intensity.w
#define LIGHT_INTENSITY0 light_source[2].col_intensity.w
#define LIGHT_INTENSITY0 light_source[3].col_intensity.w

#define LIGHT_DIR0 light_source[0].light_pos_type.xyz
#define LIGHT_DIR1 light_source[1].light_pos_type.xyz

`

const SHADERFX_SHADOWMAP = `
struct SHADOW_DATA{
    sampler2D uShadowMap;
    mat4 uLightMtx;
};
uniform Shadow{
    SHADOW_DATA shadow_data[4];
}
`

const SHADERFX_LIGHTING = `
vec3 LightModel_Lambert(in vec3 lightdir,in vec3 lightColor,in vec3 normal,in vec3 albedo){
    float diff = max(.0,dot(lightdir,normal));
    return albedo * lightColor * diff;
}
`

ShaderFX.registVariant(new ShaderVariant('SHADERFX_OBJ',SHADERFX_OBJ));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_CAMERA',SHADERFX_CAMERA));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_LIGHT',SHADERFX_LIGHT));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_LIGHTING',SHADERFX_LIGHTING));
ShaderFX.registVariant(new ShaderVariant('SHADERFX_SHADOWMAP',SHADERFX_SHADOWMAP));
ShaderFX.linkAllVariant();