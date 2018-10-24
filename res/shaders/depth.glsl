#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

in vec4 aPosition;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
}

void fragment(){
}