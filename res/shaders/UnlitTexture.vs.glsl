#version 300 es
precision mediump float;
#include SHADERFX_CAMERA
#include SHADERFX_SHADOWMAP

in vec4 aPosition;
in vec2 aUV;
out vec2 vUV;

out vec4 wpos;
out vec4 lpos;

#queue opaque

void main(){
    wpos = MATRIX_M * aPosition;
    lpos = uLightMtx[0] * wpos;
    gl_Position = MATRIX_VP * wpos;
    vUV = aUV;
}