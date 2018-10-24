#version 300 es
precision mediump float;
#include SHADERFX_CAMERA
#include SHADERFX_SHADOWMAP

#queue opaque

inout vec2 vUV;
#ifdef SHADOW_ON
inout vec4 lpos;
#endif

#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    #ifdef SHADOW_ON
    vec4 wpos = MATRIX_M * aPosition;
    lpos = uLightMtx[0] * wpos;
    gl_Position = MATRIX_VP * wpos;
    #else
    gl_Position = MATRIX_MVP * aPosition;
    #endif
    vUV = aUV;
}

#pragma ps fragment

uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    #ifdef SHADOW_ON
    float shadow = computeShadow(lpos,uShadowMap);

    vec3 clip = lpos.xyz / lpos.w;
    clip = clip *0.5 + 0.5;

    fragColor =vec4(shadow,0,0,1.0);
    #else
    fragColor = vec4(0,1.0,0,1.0);
    #endif
}