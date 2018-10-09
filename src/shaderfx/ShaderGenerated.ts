export class ShaderGen{ 
	public static readonly SHADERFX_BASIS:string = `#include SHADERFX_OBJ
#include SHADERFX_CAMERA
vec3 ObjToWorldDir(in vec3 dir){
    return normalize(dir * mat3(MATRIX_WORLD2OBJ));
}`;
	public static readonly SHADERFX_CAMERA:string = `#include SHADERFX_OBJ
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
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)`;
	public static readonly SHADERFX_LIGHT:string = `struct LIGHT_DATA{
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
#define LIGHT_DIR1 light_source[1].pos_type.xyz`;
	public static readonly SHADERFX_LIGHTING:string = `vec3 LightModel_Lambert(vec3 lightdir,vec3 lightColor,vec3 normal,vec3 albedo){
    float diff = max(.0,dot(lightdir,normal));
    return albedo * lightColor * diff;
}`;
	public static readonly SHADERFX_OBJ:string = `uniform UNIFORM_OBJ{
    mat4 _obj2world_;
};
#define MATRIX_M _obj2world_`;
	public static readonly SHADERFX_SHADOWMAP:string = `#options SMCASCADE NONE TWO FOUR
uniform UNIFORM_SHADOWMAP{
    mat4 uLightMtx[4];
    float uShadowDist;
};
uniform sampler2D uShadowMap;

float computeShadow(vec4 vLightPos,sampler2D shadowsampler){
    vec3 clipspace = vLightPos.xyz / vLightPos.w;
    clipspace = clipspace *0.5 + 0.5;
    float shadowDep = texture(shadowsampler,vec2(clipspace.xy)).x;
    return step(clipspace.z- 0.01,shadowDep);
}

float computeShadowPoisson(vec4 vLightPos,sampler2D shadowsampler){
    vec3 clipspace = vLightPos.xyz / vLightPos.w;
    clipspace = clipspace *0.5 + 0.5;

    vec2 coord = clipspace.xy;
    float curdepth = clipspace.z - 0.01;
    float visibility = 1.0;

    float mapsize = 1.0/1024.0;

    vec2 poissonDisk[4];
        poissonDisk[0] = vec2(-0.94201624, -0.39906216);
        poissonDisk[1] = vec2(0.94558609, -0.76890725);
        poissonDisk[2] = vec2(-0.094184101, -0.92938870);
        poissonDisk[3] = vec2(0.34495938, 0.29387760);

    if(texture(shadowsampler,coord + poissonDisk[0] * mapsize).r <curdepth) visibility -=0.25;
    if(texture(shadowsampler,coord + poissonDisk[1] * mapsize).r <curdepth) visibility -=0.25;
    if(texture(shadowsampler,coord + poissonDisk[2] * mapsize).r <curdepth) visibility -=0.25;
    if(texture(shadowsampler,coord + poissonDisk[3] * mapsize).r <curdepth) visibility -=0.25;
    return visibility;
}

float computeShadowPCF3(vec4 vLightPos,sampler2DShadow shadowsampler){
    vec3 clipspace = vLightPos.xyz / vLightPos.w;
    clipspace = clipspace *0.5 + 0.5;

    vec2 shadowMapSizeInv = vec2(1024.0,1.0/1024.0);

    float curdepth = clipspace.z;

    vec2 uv = clipspace.xy *shadowMapSizeInv.x;
    uv += 0.5;
    vec2 st = fract(uv);
    vec2 base_uv = floor(uv) - 0.5;
    base_uv *= shadowMapSizeInv.y;

    vec2 uvw0 = 3. - 2. * st;
    vec2 uvw1 = 1. + 2. * st;
    vec2 u = vec2((2. - st.x) / uvw0.x - 1., st.x / uvw1.x + 1.) * shadowMapSizeInv.y;
    vec2 v = vec2((2. - st.y) / uvw0.y - 1., st.y / uvw1.y + 1.) * shadowMapSizeInv.y;

    float shadow = 0.;
    shadow += uvw0.x * uvw0.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[0], v[0]), curdepth));
    shadow += uvw1.x * uvw0.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[1], v[0]), curdepth));
    shadow += uvw0.x * uvw1.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[0], v[1]), curdepth));
    shadow += uvw1.x * uvw1.y * texture(shadowsampler, vec3(base_uv.xy + vec2(u[1], v[1]), curdepth));
    shadow = shadow / 16.;
    return shadow;
}`;
	public static readonly diffuse_ps:string = `#version 300 es\nprecision mediump float;
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
}`;
	public static readonly diffuse_vs:string = `#version 300 es\nprecision mediump float;
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
}`;
	public static readonly UnlitColor_ps:string = `#version 300 es\nprecision mediump float;
uniform vec4 uColor;
out vec4 fragColor;
void main(){
    fragColor = uColor;
}`;
	public static readonly UnlitColor_vs:string = `#version 300 es\nprecision mediump float;

#include SHADERFX_BASIS
#queue opaque

in vec4 aPosition;
void main(){
    gl_Position = MATRIX_MVP * aPosition;
}`;
	public static readonly UnlitTexture_ps:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_SHADOWMAP
in vec2 vUV;
in vec4 wpos;
in vec4 lpos;
out vec4 fragColor;
uniform sampler2D uSampler;
void main(){
    float shadow = computeShadow(lpos,uShadowMap);
    fragColor = vec4(1.0) * clamp(shadow +0.2,.0,1.);
}`;
	public static readonly UnlitTexture_vs:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_CAMERA
#include SHADERFX_SHADOWMAP

in vec4 aPosition;
in vec2 aUV;
out vec2 vUV;

out vec4 wpos;
out vec4 lpos;

#queue opaque

void main(){
    wpos = MATRIX_M * aPosition;
    lpos = uLightMtx[0] * wpos;
    gl_Position = MATRIX_VP * wpos;
    vUV = aUV;
}`;
	public static readonly uvValue_ps:string = `#version 300 es\nprecision mediump float;
in vec2 vUV;
out vec4 fragColor;
void main(){
    fragColor = vec4(vUV,0,1.0);
}`;
	public static readonly uvValue_vs:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_CAMERA
in vec4 aPosition;
in vec2 aUV;
out vec2 vUV;
void main(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}`;
}