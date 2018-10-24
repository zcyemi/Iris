#version 300 es
precision mediump float;
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

}