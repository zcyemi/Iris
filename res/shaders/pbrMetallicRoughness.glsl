#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP
#queue opaque

inout vec2 vUV;
#ifdef SHADOW_ON
inout vec4 lpos;
#endif

#pragma vs vertex
in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;

void vertex(){
    #ifdef SHADOW_ON
    vec4 wpos = MATRIX_M * vec4(aPosition,1.0);
    lpos = uLightMtx[0] * wpos;
    gl_Position = MATRIX_VP * wpos;
    #else
    gl_Position = MATRIX_MVP * vec4(aPosition,1.0);
    #endif
    vUV = aUV;
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
void fragment(){

    #ifdef SHADOW_ON
    float shadow = computeShadow(lpos,uShadowMap);
    fragColor = texture(uSampler,vUV) * clamp(shadow+0.2,0.0,1.0);
    #else
    fragColor = texture(uSampler,vUV);
    #endif

}