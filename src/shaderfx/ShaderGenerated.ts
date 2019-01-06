export class ShaderGen{ 
	public static readonly SHADERFX_BASIS:string = `#define PI 3.1415926
#define PI_2 6.2831852
#define PI_HALF 1.5707963
#define EPSILON 1e-5

uniform UNIFORM_OBJ{
    mat4 _obj2world_;
};
#define MATRIX_M _obj2world_
uniform UNIFORM_BASIS{
    //basic region
    vec4 _screenparam_;//[width,height,1/wdith,1/height]
    highp vec4 _time_;//[Time,deltaTime,sinTime,cosTime]
    //camera
    vec4 _camera_pos_;
    mat4 _camera_mtx_view_;
    vec4 _camera_projparam_;//[near,far,1/near,1/far]
    mat4 _camera_mtx_proj_;
    mat4 _camera_mtx_invproj_;
    //Ambient And Fog
    lowp vec4 _ambientcolor_;
    vec4 _fogcolor_;
    vec4 _fogparam_;
};
#define TIME _time_
#define SCREEN _screenparam_

#define MATRIX_V _camera_mtx_view_
#define MATRIX_P _camera_mtx_proj_
#define MATRIX_VP MATRIX_P * MATRIX_V
#define MATRIX_MV MATRIX_V * MATRIX_M
#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))
#define MATRIX_MVP MATRIX_P * MATRIX_MV
#define MATRIX_INV_P _camera_mtx_invproj_
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)
#define CAMERA_POS _camera_pos_
#define CAMERA_NEAR _camera_projparam_.x
#define CAMERA_FAR _camera_projparam_.y
#define CAMERA_NEAR_INV _camera_projparam_.z
#define CAMERA_FAR_INV _camera_projparam_.w
#define SCREEN_WIDTH _screenparam_.x
#define SCREEN_HEIGHT _screenparam_.y
#define SCREEN_WIDTH_INV _screenparam_.z
#define SCREEN_HEIGHT_INV _screenparam_.w
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


#define saturate(x) clamp(x,0.0,1.0)
`;
	public static readonly SHADERFX_LIGHT:string = `layout (std140) uniform UNIFORM_LIGHT{
    vec4 lightColor0;
    vec4 lightColor1;
    vec4 lightColor2;
    vec4 lightColor3;
    vec4 lightIntensity;
    vec4 lightPosX;
    vec4 lightPosY;
    vec4 lightPosZ;
    vec4 light_ambient;
    vec4 lightPrimePos;
    vec4 lightPrimeColor;
};

#define LIGHT_COLOR0 lightColor0
#define LIGHT_COLOR1 lightColor1
#define LIGHT_COLOR2 lightColor2
#define LIGHT_COLOR3 lightColor3

#define MAIN_LIGHT_POS lightPrimePos
#define MAIN_LIGHT_COLOR lightPrimeColor

#define LIGHT_INTENSITY lightIntensity
#define LIGHT_INTENSITY0 lightIntensity.x
#define LIGHT_INTENSITY1 lightIntensity.y
#define LIGHT_INTENSITY2 lightIntensity.z
#define LIGHT_INTENSITY3 lightIntensity.w
`;
	public static readonly SHADERFX_LIGHTING:string = `vec3 LightModel_Lambert(vec3 lightdir,vec3 lightColor,float atten,vec3 normal,vec3 albedo){
    float diff = max(.0,dot(lightdir,normal));
    return albedo * lightColor * diff * atten;
}


vec3 Sample_4PointLights(vec3 wpos,vec3 normal){
    vec4 toLightX = lightPosX - vec4(wpos.x);
    vec4 toLightY = lightPosY - vec4(wpos.y);
    vec4 toLightZ = lightPosZ - vec4(wpos.z);

    //dot
    vec4 ndotl = vec4(0.0);
    ndotl += toLightX * normal.x;
    ndotl += toLightY * normal.y;
    ndotl += toLightZ * normal.z;
    ndotl = max(vec4(0.0),ndotl);

    //lensq
    vec4 toLightSq = vec4(0.0);
    toLightSq += toLightX * toLightX;
    toLightSq += toLightY * toLightY;
    toLightSq += toLightZ * toLightZ;
    toLightSq = max(toLightSq,vec4(0.000001));

    ndotl *= sqrt(toLightSq);

    vec4 atten = 1.0/ (1.0 + toLightSq * LIGHT_INTENSITY);
    vec4 diff = ndotl * atten;
    
    vec3 col = vec3(0.0);
    col += diff.x * LIGHT_COLOR0.xyz;
    col += diff.y * LIGHT_COLOR1.xyz;
    col += diff.z * LIGHT_COLOR2.xyz;
    col += diff.w * LIGHT_COLOR3.xyz;

    return col;
}
`;
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
	public static readonly blit:string = `#version 300 es\nprecision mediump float;
#queue opaque
inout vec2 vUV;
#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    vec4 pos = aPosition;
    pos.xy *=2.0;
    vUV = vec2(aUV.x,1.0 -aUV.y);
    gl_Position = pos;
}
#pragma ps fragment
uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV);
}`;
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
	public static readonly diffuse:string = `#version 300 es\n#pragma optimize (off)
#pragma debug (on)
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_LIGHT
#include SHADERFX_LIGHTING

struct V2F{
    vec3 pos;
    vec3 normal;
    vec3 wpos;
};
inout V2F v2f;

#queue opaque
#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
in vec2 aUV;
in vec4 aNormal;

void vertex(){
    vec4 wpos = MATRIX_M * aPosition;
    v2f.pos = wpos.xyz;
    vec4 pos = MATRIX_VP * wpos;
    gl_Position = pos;
    v2f.normal = ObjToWorldDir(aNormal.xyz);
    v2f.wpos = wpos.xyz;
}
#endif
#pragma ps fragment
#ifdef SHADER_PS
out lowp vec4 fragColor;
uniform vec4 uColor;
void fragment(){

    vec3 col = Sample_4PointLights(v2f.wpos,normalize(v2f.normal)) * uColor.xyz;
    
    vec3 mainCol = LightModel_Lambert(MAIN_LIGHT_POS.xyz,MAIN_LIGHT_COLOR.xyz,MAIN_LIGHT_COLOR.w,v2f.normal,uColor.xyz);


    fragColor = vec4(mainCol + col,1.0);
}
#endif`;
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
	public static readonly screenRect:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#queue opaque
inout vec2 vUV;
#pragma vs vertex

uniform vec4 uRect;

in vec4 aPosition;
in vec2 aUV;
void vertex(){
    vec4 pos = aPosition;

    vec4 rect = uRect * SCREEN.zwzw * 2.0;
    pos.xy = ((pos.xy + 0.5) * rect.zw + rect.xy) - 1.0;

    vUV = vec2(aUV.x,1.0 -aUV.y);
    gl_Position = pos;
}
#pragma ps fragment
uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV);
}`;
	public static readonly shadowmap:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

uniform mat4 uLightVP;

in vec4 aPosition;
void vertex(){
    mat4 lightmtx = uLightVP;
    gl_Position = lightmtx * MATRIX_M * aPosition; //(uLightVP * MATRIX_M) *
}

void fragment(){
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
#options ENVMAP_TYPE CUBE TEX PCG
#queue skybox

inout vec3 vWorldDir;

#ifdef ENVMAP_TYPE_CUBE
uniform samplerCube uSampler;
#elif defined(ENVMAP_TYPE_TEX)
uniform sampler2D uSampler;
#elif defined(ENVMAP_TYPE_PCG)

#define SAMPLES_NUMS 16
// https://www.shadertoy.com/view/XlBfRD
// License (MIT) Copyright (C) 2017-2018 Rui. All rights reserved.
struct ScatteringParams
{
    float sunRadius;
	float sunRadiance;

	float mieG;
	float mieHeight;

	float rayleighHeight;

	vec3 waveLambdaMie;
	vec3 waveLambdaOzone;
	vec3 waveLambdaRayleigh;

	float earthRadius;
	float earthAtmTopRadius;
	vec3 earthCenter;
};

vec3 ComputeSphereNormal(vec2 coord, float phiStart, float phiLength, float thetaStart, float thetaLength)
{
	vec3 normal;
	normal.x = -sin(thetaStart + coord.y * thetaLength) * sin(phiStart + coord.x * phiLength);
	normal.y = -cos(thetaStart + coord.y * thetaLength);
	normal.z = -sin(thetaStart + coord.y * thetaLength) * cos(phiStart + coord.x * phiLength);
	return normalize(normal);
}

vec2 ComputeRaySphereIntersection(vec3 position, vec3 dir, vec3 center, float radius)
{
	vec3 origin = position - center;
	float B = dot(origin, dir);
	float C = dot(origin, origin) - radius * radius;
	float D = B * B - C;

	vec2 minimaxIntersections;
	if (D < 0.0)
	{
		minimaxIntersections = vec2(-1.0, -1.0);
	}
	else
	{
		D = sqrt(D);
		minimaxIntersections = vec2(-B - D, -B + D);
	}

	return minimaxIntersections;
}

vec3 ComputeWaveLambdaRayleigh(vec3 lambda)
{
	const float n = 1.0003;
	const float N = 2.545E25;
	const float pn = 0.035;
	const float n2 = n * n;
	const float pi3 = PI * PI * PI;
	const float rayleighConst = (8.0 * pi3 * pow(n2 - 1.0,2.0)) / (3.0 * N) * ((6.0 + 3.0 * pn) / (6.0 - 7.0 * pn));
	return rayleighConst / (lambda * lambda * lambda * lambda);
}

float ComputePhaseMie(float theta, float g)
{
	float g2 = g * g;
	return (1.0 - g2) / pow(1.0 + g2 - 2.0 * g * saturate(theta), 1.5) / (4.0 * PI);
}

float ComputePhaseRayleigh(float theta)
{
	float theta2 = theta * theta;
	return (theta2 * 0.75 + 0.75) / (4.0 * PI);
}

float ChapmanApproximation(float X, float h, float cosZenith)
{
	float c = sqrt(X + h);
	float c_exp_h = c * exp(-h);

	if (cosZenith >= 0.0)
	{
		return c_exp_h / (c * cosZenith + 1.0);
	}
	else
	{
		float x0 = sqrt(1.0 - cosZenith * cosZenith) * (X + h);
		float c0 = sqrt(x0);

		return 2.0 * c0 * exp(X - x0) - c_exp_h / (1.0 - c * cosZenith);
	}
}

float GetOpticalDepthSchueler(float h, float H, float earthRadius, float cosZenith)
{
	return H * ChapmanApproximation(earthRadius / H, h / H, cosZenith);
}

vec3 GetTransmittance(ScatteringParams setting, vec3 L, vec3 V)
{
	float ch = GetOpticalDepthSchueler(L.y, setting.rayleighHeight, setting.earthRadius, V.y);
	return exp(-(setting.waveLambdaMie + setting.waveLambdaRayleigh) * ch);
}

vec2 ComputeOpticalDepth(ScatteringParams setting, vec3 samplePoint, vec3 V, vec3 L, float neg)
{
	float rl = length(samplePoint);
	float h = rl - setting.earthRadius;
	vec3 r = samplePoint / rl;

	float cos_chi_sun = dot(r, L);
	float cos_chi_ray = dot(r, V * neg);

	float opticalDepthSun = GetOpticalDepthSchueler(h, setting.rayleighHeight, setting.earthRadius, cos_chi_sun);
	float opticalDepthCamera = GetOpticalDepthSchueler(h, setting.rayleighHeight, setting.earthRadius, cos_chi_ray) * neg;

	return vec2(opticalDepthSun, opticalDepthCamera);
}

void AerialPerspective(ScatteringParams setting, vec3 start, vec3 end, vec3 V, vec3 L, bool infinite, out vec3 transmittance, out vec3 insctrMie, out vec3 insctrRayleigh)
{
	float inf_neg = infinite ? 1.0 : -1.0;

	vec3 sampleStep = (end - start) / float(SAMPLES_NUMS);
	vec3 samplePoint = end - sampleStep;
	vec3 sampleLambda = setting.waveLambdaMie + setting.waveLambdaRayleigh + setting.waveLambdaOzone;

	float sampleLength = length(sampleStep);

	vec3 scattering = vec3(0.0);
	vec2 lastOpticalDepth = ComputeOpticalDepth(setting, end, V, L, inf_neg);

	for (int i = 1; i < SAMPLES_NUMS; i++, samplePoint -= sampleStep)
	{
		vec2 opticalDepth = ComputeOpticalDepth(setting, samplePoint, V, L, inf_neg);

		vec3 segment_s = exp(-sampleLambda * (opticalDepth.x + lastOpticalDepth.x));
		vec3 segment_t = exp(-sampleLambda * (opticalDepth.y - lastOpticalDepth.y));
		
		transmittance *= segment_t;
		
		scattering = scattering * segment_t;
		scattering += exp(-(length(samplePoint) - setting.earthRadius) / setting.rayleighHeight) * segment_s;

		lastOpticalDepth = opticalDepth;
	}

	insctrMie = scattering * setting.waveLambdaMie * sampleLength;
	insctrRayleigh = scattering * setting.waveLambdaRayleigh * sampleLength;
}

float ComputeSkyboxChapman(ScatteringParams setting, vec3 eye, vec3 V, vec3 L, out vec3 transmittance, out vec3 insctrMie, out vec3 insctrRayleigh)
{
	bool neg = true;

	vec2 outerIntersections = ComputeRaySphereIntersection(eye, V, setting.earthCenter, setting.earthAtmTopRadius);
	if (outerIntersections.y < 0.0) return 0.0;

	vec2 innerIntersections = ComputeRaySphereIntersection(eye, V, setting.earthCenter, setting.earthRadius);
	if (innerIntersections.x > 0.0)
	{
		neg = false;
		outerIntersections.y = innerIntersections.x;
	}

	eye -= setting.earthCenter;

	vec3 start = eye + V * max(0.0, outerIntersections.x);
	vec3 end = eye + V * outerIntersections.y;

	AerialPerspective(setting, start, end, V, L, neg, transmittance, insctrMie, insctrRayleigh);

	bool intersectionTest = innerIntersections.x < 0.0 && innerIntersections.y < 0.0;
	return intersectionTest ? 1.0 : 0.0;
}

vec4 ComputeSkyInscattering(ScatteringParams setting, vec3 eye, vec3 V, vec3 L)
{
	vec3 insctrMie = vec3(0.0);
	vec3 insctrRayleigh = vec3(0.0);
	vec3 insctrOpticalLength = vec3(1.0);
	float intersectionTest = ComputeSkyboxChapman(setting, eye, V, L, insctrOpticalLength, insctrMie, insctrRayleigh);

	float phaseTheta = dot(V, L);
	float phaseMie = ComputePhaseMie(phaseTheta, setting.mieG);
	float phaseRayleigh = ComputePhaseRayleigh(phaseTheta);
	float phaseNight = 1.0 - saturate(insctrOpticalLength.x * EPSILON);

	vec3 insctrTotalMie = insctrMie * phaseMie;
	vec3 insctrTotalRayleigh = insctrRayleigh * phaseRayleigh;

	vec3 sky = (insctrTotalMie + insctrTotalRayleigh) * setting.sunRadiance;

	float angle = saturate((1.0 - phaseTheta) * setting.sunRadius);
	float cosAngle = cos(angle * PI * 0.5);
	float edge = ((angle >= 0.9) ? smoothstep(0.9, 1.0, angle) : 0.0);
                         
	vec3 limbDarkening = GetTransmittance(setting, -L, V);
	limbDarkening *= pow(vec3(cosAngle), vec3(0.420, 0.503, 0.652)) * mix(vec3(1.0), vec3(1.2,0.9,0.5), edge) * intersectionTest;

	sky += limbDarkening;

	return vec4(sky, phaseNight * intersectionTest);
}

vec3 TonemapACES(vec3 x)
{
	const float A = 2.51f;
	const float B = 0.03f;
	const float C = 2.43f;
	const float D = 0.59f;
	const float E = 0.14f;
	return (x * (A * x + B)) / (x * (C * x + D) + E);
}

float noise(vec2 uv)
{
	return fract(dot(sin(uv.xyx * uv.xyy * 1024.0), vec3(341896.483, 891618.637, 602649.7031)));
}

#endif

#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    pos.xy*=2.0;
    pos.z = 1.0;
    gl_Position = pos;

    vec4 wpos =  inverse(MATRIX_VP) * pos;
    wpos.xyz = wpos.xyz / wpos.w - CAMERA_POS.xyz;
    vWorldDir = wpos.xyz;
    
}
#endif

#pragma ps fragment
#ifdef SHADER_PS
out lowp vec4 fragColor;
void fragment(){
    vec3 dir = vWorldDir.xyz;
    #ifdef ENVMAP_TYPE_CUBE
    fragColor = texture(uSampler,dir);
    #elif defined(ENVMAP_TYPE_TEX)
    dir = normalize(dir);
    float y = 1.0 - 0.5 *(1.0 + dir.y);
    float x = atan(dir.z,dir.x) / PI_2 + 0.5;
    fragColor = texture(uSampler,vec2(x,y));
    #elif defined(ENVMAP_TYPE_PCG)

    vec3 V = normalize(dir);
    vec3 L = normalize(vec3(0,0.5,0.5));

    ScatteringParams setting;
	setting.sunRadius = 500.0;
	setting.sunRadiance = 20.0;
	setting.mieG = 0.76;
	setting.mieHeight = 1200.0;
	setting.rayleighHeight = 8000.0;
	setting.earthRadius = 6360000.0;
	setting.earthAtmTopRadius = 6420000.0;
	setting.earthCenter = vec3(0, -setting.earthRadius, 0);
	setting.waveLambdaMie = vec3(2e-7);
    // wavelength with 680nm, 550nm, 450nm
    setting.waveLambdaRayleigh = ComputeWaveLambdaRayleigh(vec3(680e-9, 550e-9, 450e-9));
    
    // see https://www.shadertoy.com/view/MllBR2
	setting.waveLambdaOzone = vec3(1.36820899679147, 3.31405330400124, 0.13601728252538) * 0.6e-6 * 2.504;
	
    vec3 eye = vec3(0,1000.0,0);
   	vec4 sky = ComputeSkyInscattering(setting, eye, V, L);
    sky.rgb = TonemapACES(sky.rgb * 2.0);
    sky.rgb = pow(sky.rgb, vec3(1.0 / 2.2)); // gamma
    sky.rgb += noise(dir.xy * TIME.z) / 255.0; // dither
	fragColor = vec4(sky.rgb, 1.0);
    #endif
}
#endif
`;
	public static readonly sprite:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS

#queue transparent
#zwrite off
#blend src_alpha one_minus_src_alpha

inout vec2 vUV;

#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
in vec2 aUV;

void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}
#endif

#pragma ps fragment
#ifdef SHADER_PS
uniform sampler2D uSampler;
uniform vec4 uColor;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV) * uColor;
}
#endif
`;
	public static readonly UnlitColor:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS
#queue opaque

#pragma vs vertex
in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    gl_Position = MATRIX_MVP * pos;
}

#pragma ps fragment
uniform vec4 uColor;
out vec4 fragColor;
void fragment(){
    fragColor = uColor;
}`;
	public static readonly UnlitTexture:string = `#version 300 es\nprecision mediump float;
#include SHADERFX_BASIS

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
#include SHADERFX_BASIS

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