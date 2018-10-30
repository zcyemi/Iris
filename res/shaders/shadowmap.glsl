#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

uniform mat4 uLightVP;

in vec4 aPosition;
void vertex(){
    gl_Position = (uLightVP * MATRIX_M) * aPosition;
}

void fragment(){
}