#version 300 es
precision mediump float;
#include SHADERFX_SHADOWMAP

in vec2 vUV;

#ifdef SHADOW_ON
in vec4 lpos;
#endif

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
void main(){

    #ifdef SHADOW_ON
    float shadow = computeShadow(lpos,uShadowMap);
    fragColor = texture(uSampler,vUV) * clamp(shadow+0.2,0.0,1.0);
    #else
    fragColor = texture(uSampler,vUV);
    #endif

}