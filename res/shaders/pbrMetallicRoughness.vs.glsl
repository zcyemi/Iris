#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue opaque

in vec4 aPosition;
in vec2 aUV;
in vec4 aNormal;

out vec2 vUV;

void main(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}