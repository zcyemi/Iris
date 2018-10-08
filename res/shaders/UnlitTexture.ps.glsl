#version 300 es
precision mediump float;
#include SHADERFX_SHADOWMAP
in vec2 vUV;
in vec4 wpos;
in vec4 lpos;
out vec4 fragColor;
uniform sampler2D uSampler;
void main(){
    float shadow = computeShadow(lpos,uShadowMap);
    fragColor = vec4(1.0) * clamp(shadow +0.2,.0,1.);
}