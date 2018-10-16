#version 300 es
precision mediump float;
#include SHADERFX_SHADOWMAP

in vec2 vUV;
#ifdef SHADOW_ON
in vec4 wpos;
in vec4 lpos;
#endif
out vec4 fragColor;
uniform sampler2D uSampler;
void main(){
    #ifdef SHADOW_ON
    float shadow = computeShadow(lpos,uShadowMap);
    fragColor = texture(uSampler,vUV) * clamp(shadow +0.2,.0,1.);
    #else
    fragColor = texture(uSampler,vUV);
    #endif
}