#version 300 es
precision mediump float;
#include SHADERFX_CAMERA
in vec4 aPosition;
in vec2 aUV;
out vec2 vUV;
void main(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}