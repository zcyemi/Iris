#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP

#queue opaque

in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;

out vec2 vUV;

#ifdef SHADOW_ON
out vec4 lpos;
#endif


void main(){
    #ifdef SHADOW_ON
    vec4 wpos = MATRIX_M * vec4(aPosition,1.0);
    lpos = uLightMtx[0] * wpos;
    gl_Position = MATRIX_VP * wpos;
    #else
    gl_Position = MATRIX_MVP * vec4(aPosition,1.0);
    #endif
    vUV = aUV;
}