#version 300 es
precision mediump float;
#include SHADERFX_CAMERA
#include SHADERFX_SHADOWMAP



in vec4 aPosition;
in vec2 aUV;
out vec2 vUV;

#ifdef SHADOW_ON
out vec4 lpos;
#endif

#queue opaque

void main(){
    #ifdef SHADOW_ON
    vec4 wpos = MATRIX_M * aPosition;
    lpos = uLightMtx[0] * wpos;
    gl_Position = MATRIX_VP * wpos;
    #else
    gl_Position = MATRIX_MVP * aPosition;
    #endif
    vUV = aUV;
}