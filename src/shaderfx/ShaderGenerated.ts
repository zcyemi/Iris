export class ShaderGen{ 
	public static readonly SHADERFX_BASIS:string = `#define PI 3.1415926
#define PI_2 6.2831852
#define PI_HALF 1.5707963

#include SHADERFX_OBJ
#include SHADERFX_CAMERA
vec3 ObjToWorldDir(in vec3 dir){
    return normalize(dir * mat3(MATRIX_WORLD2OBJ));
}

float SAMPLE_DEPTH_TEXTURE(sampler2D depthtex,vec2 uv){
    return texture(depthtex,uv).r;
}

float DECODE_VIEWDEPTH(float d){
    return 1.0/ ((CAMERA_NEAR_INV - CAMERA_FAR_INV) * d  - CAMERA_NEAR_INV);
}

vec4 ClipToWorld(in vec4 clippoint){
    return inverse(MATRIX_VP) * clippoint;
}

`;
	public static readonly SHADERFX_CAMERA:string = `#include SHADERFX_OBJ
uniform UNIFORM_CAM{
    mat4 _world2view_;
    mat4 _view2proj_;
    vec4 _camerapos_;
    vec4 _projparam_; //[near,far,1/near,1/far]
    vec4 _screenparam_;//[width,height,1/wdith,1/height]
};
#define MATRIX_V _world2view_
#define MATRIX_P _view2proj_
#define MATRIX_VP MATRIX_P * MATRIX_V
#define MATRIX_MV MATRIX_V * MATRIX_M
#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))
#define MATRIX_MVP MATRIX_P * MATRIX_MV
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)
#define CAMERA_POS _camerapos_
#define CAMERA_NEAR _projparam_.x
#define CAMERA_FAR _projparam_.y
#define CAMERA_NEAR_INV _projparam_.z
#define CAMERA_FAR_INV _projparam_.w
#define SCREEN_WIDTH _screenparam_.x
#define SCREEN_HEIGHT _screenparam_.y
#define SCREEN_WIDTH_INV _screenparam_.z
#define SCREEN_HEIGHT_INV _screenparam_.w
#`;
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
#options SHADOW ON OFF

#ifdef SHADOW_ON

uniform UNIFORM_SHADOWMAP{
    mat4 uLightMtx[4];
    float uShadowDist;
};
uniform sampler2D uShadowMap;

float computeShadow(vec4 vLightPos,sampler2D shadowsampler){
    vec3 clipspace = vLightPos.xyz / vLightPos.w;
    clipspace = clipspace *0.5 + 0.5;
    float shadowDep = texture(shadowsampler,vec2(clipspace.xy)).x;
    
    //fix shadowmpa edge clamp
    vec2 border = step(clipspace.xy,vec2(0.002));
    border += step(vec2(0.998),clipspace.xy);
    shadowDep += (border.x + border.y);

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
}

#endif`;
	public static readonly depth:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

in vec4 aPosition;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
}

void fragment(){
}`;
	public static readonly diffuse:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_LIGHT
#include SHADERFX_LIGHTING

#queue opaque
#pragma vs vertex
#pragma ps fragment

in vec4 aPosition;
in vec2 aUV;
in vec4 aNormal;

struct V2F{
    vec3 pos;
    vec3 normal;
};
inout V2F v2f;

void vertex(){
    vec4 wpos = MATRIX_M * aPosition;
    v2f.pos = wpos.xyz;
    vec4 pos = MATRIX_VP * wpos;
    gl_Position = pos;
    v2f.normal = ObjToWorldDir(aNormal.xyz);
}

out lowp vec4 fragColor;
uniform vec4 uColor;
void fragment(){
    vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor.xyz);
    fragColor = vec4(lcolor +0.1,1.0);
}`;
	public static readonly gizmos:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

in vec4 aPosition;

void vertex(){
    vec4 vpos = aPosition;
    gl_Position = MATRIX_MVP * vpos;
}

out vec4 fragColor;
void fragment(){
    fragColor = vec4(1.0);
}`;
	public static readonly pbrMetallicRoughness:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_LIGHT
#include SHADERFX_SHADOWMAP
#queue opaque

struct V2F{
    vec4 wpos;
    vec2 uv;
    vec3 normal;
    #ifdef SHADOW_ON
    vec4 lpos;
    #endif
};

inout V2F v2f;

#pragma vs vertex

in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;

void vertex(){

    vec4 wpos = MATRIX_M * vec4(aPosition,1.0);
    v2f.wpos = wpos;
    #ifdef SHADOW_ON
    v2f.lpos = uLightMtx[0] * wpos;
    #endif
    v2f.normal = ObjToWorldDir(aNormal.xyz);
    gl_Position = MATRIX_VP * wpos;
    v2f.uv = aUV;
}

#pragma ps fragment

uniform uPBR{
    vec4 uColor;
    float uMetallic;
    float uRoughness;
    float uEmissive;
};

uniform sampler2D uSampler;
uniform sampler2D uTexMetallicRoughness;
uniform sampler2D uTexEmissive;

out vec4 fragColor;

vec3 diffuse(vec3 diffcolor){
    return diffcolor / PI;
}

vec3 specularReflection(float metallic,float vdoth){
    return metallic + (vec3(1.0) - metallic) * pow(1.0- vdoth,5.0);
}

float microfacetDistribution(float alphaRoughness,float NdotH)
{
    float roughnessSq = alphaRoughness * alphaRoughness;
    float f = (NdotH * roughnessSq - NdotH) * NdotH + 1.0;
    return roughnessSq / (PI * f * f);
}

float geometricOcclusion(float NdotV, float NdotH,float VdotH,float NdotL)
{
    return min(min(2.0 * NdotV * NdotH / VdotH, 2.0 * NdotL * NdotH / VdotH), 1.0);
}


void fragment(){

    vec2 uv = v2f.uv;
    vec3 wpos = v2f.wpos.xyz;
    vec3 diffColor = texture(uSampler,uv).xyz;

    vec3 n = v2f.normal;
    vec3 v = normalize(CAMERA_POS.xyz - wpos);
    vec3 l = -LIGHT_DIR0;
    vec3 h = normalize(v+l);

    float roughness = uRoughness;
    float metallic = uMetallic;

    float NdotL = clamp(dot(n, l), 0.001, 1.0);
    float NdotV = clamp(abs(dot(n, v)), 0.001, 1.0);
    float NdotH = clamp(dot(n, h), 0.0, 1.0);
    //float LdotH = clamp(dot(l, h), 0.0, 1.0);
    float VdotH = clamp(dot(v, h), 0.0, 1.0);

    vec3 F = specularReflection(metallic,VdotH);
    float D = microfacetDistribution(roughness,NdotH);
    float G = geometricOcclusion(NdotV,NdotH,VdotH,NdotL);

    vec3 diff = (vec3(1.0) - F) * diffColor;
    vec3 spec = F  * (G * D / (4.0 * NdotL * NdotV));

    vec3 col = NdotL * LIGHT_COLOR0 * (diff + spec);

    vec3 ambient = ambient_color.a * ambient_color.rgb;

    col += ambient;

    #ifdef SHADOW_ON
    float shadow = computeShadow(v2f.lpos,uShadowMap);
    shadow = clamp(shadow+0.5,0.0,1.0);
    col = mix(min(col,ambient),col,shadow);
    #endif

    fragColor = vec4(col *1.2,1.0);

}`;
	public static readonly shadowsGather:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP

inout vec2 vUV;
inout vec3 vvdir;

#pragma vs vertex

in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    vUV = pos.xy +0.5;
    pos.xy *=2.0;

    vec4 clippos = vec4(pos.xy *2.0,1.0,1.0);
    vec4 cwpos = ClipToWorld(clippos);

    vvdir = (cwpos.xyz / cwpos.w) - CAMERA_POS.xyz;
    
    gl_Position = pos;
}

#pragma ps fragment

out vec4 fragColor;
uniform sampler2D uDepthTexure;
void fragment(){
    float eyedepth = DECODE_VIEWDEPTH(SAMPLE_DEPTH_TEXTURE(uDepthTexure,vUV));
    vec3 dir = normalize(vvdir);
    vec3 wpos = dir * eyedepth + CAMERA_POS.xyz;
    vec4 lpos = uLightMtx[0] * vec4(wpos,1.0);
    vec3 lcpos = lpos.xyz / lpos.w;
    lcpos = lpos.xyz *0.5 +0.5;
    vec2 coord=  lcpos.xy;
    float shadowDep = texture(uShadowMap,coord).x;
    float d = shadowDep;// lcpos.z;
    fragColor = vec4(lcpos.z -1.0,0,0,1.0);
}`;
	public static readonly skybox:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#options ENVMAP_TYPE CUBE TEX 
#queue skybox

#ifdef ENVMAP_TYPE_CUBE
inout vec4 vWorldDir;
uniform samplerCube uSampler;
#endif
#ifdef ENVMAP_TYPE_TEX
inout vec3 vWorldDir;
uniform sampler2D uSampler;
#endif

#pragma vs vertex

in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    pos.xy*=2.0;
    pos.z = 1.0;
    gl_Position = pos;

    vec4 wpos =  inverse(MATRIX_VP) * pos;
    wpos.xyz = wpos.xyz / wpos.w - CAMERA_POS.xyz;
    #ifdef ENVMAP_TYPE_CUBE
    vWorldDir = wpos;
    #endif

    #ifdef ENVMAP_TYPE_TEX
    vWorldDir = wpos.xyz;
    #endif
    
}

#pragma ps fragment
out lowp vec4 fragColor;
void fragment(){
    vec3 dir = vWorldDir.xyz;
    #ifdef ENVMAP_TYPE_CUBE
    fragColor = texture(uSampler,dir);
    #endif
    #ifdef ENVMAP_TYPE_TEX
    dir = normalize(dir);
    float y = 1.0 - 0.5 *(1.0 + dir.y);
    float x = atan(dir.z,dir.x) / PI_2 + 0.5;
    fragColor = texture(uSampler,vec2(x,y));
    #endif
}`;
	public static readonly UnlitColor:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#queue opaque

#pragma vs vertex
in vec4 aPosition;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
}

#pragma ps fragment
uniform vec4 uColor;
out vec4 fragColor;
void fragment(){
    fragColor = uColor;
}`;
	public static readonly UnlitTexture:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_CAMERA
#include SHADERFX_SHADOWMAP

#queue opaque

inout vec2 vUV;


#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}

#pragma ps fragment

uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV);
}`;
	public static readonly uvValue:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_CAMERA

inout vec2 vUV;

#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}

#pragma ps fragment
out vec4 fragColor;
void fragment(){
    fragColor = vec4(vUV,0,1.0);
}`;
}