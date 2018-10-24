#version 300 es
precision mediump float;
#include SHADERFX_SHADOWMAP


in vec2 vUV;
#ifdef SHADOW_ON
in vec4 lpos;
#endif
uniform sampler2D uSampler;

out vec4 fragColor;
void main(){
    #ifdef SHADOW_ON
    float shadow = computeShadow(lpos,uShadowMap);

    vec3 clip = lpos.xyz / lpos.w;
    clip = clip *0.5 + 0.5;

    fragColor =vec4(shadow,0,0,1.0);
    #else
    fragColor = vec4(0,1.0,0,1.0);
    #endif
}