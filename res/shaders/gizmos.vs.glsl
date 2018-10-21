#version 300 es
precision mediump float;

#include SHADERFX_BASIS
#queue other

in vec4 aPosition;

void main(){
    vec4 vpos = aPosition;
    gl_Position = MATRIX_MVP * vpos;
}