#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

uniform mat4 uLightVP;

in vec4 aPosition;
void vertex(){
    mat4 lightmtx = uLightVP;
    gl_Position = lightmtx * MATRIX_M * aPosition; //(uLightVP * MATRIX_M) *
}

void fragment(){
}