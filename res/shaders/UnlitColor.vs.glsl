#version 300 es
precision mediump float;

#include SHADERFX_BASIS
#queue opaque

in vec4 aPosition;
void main(){
    gl_Position = MATRIX_MVP * aPosition;
}