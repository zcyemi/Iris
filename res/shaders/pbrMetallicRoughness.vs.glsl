#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue opaque

in vec3 aPosition;
in vec3 aNormal;
in vec2 aUV;

out vec2 vUV;

void main(){
    gl_Position = MATRIX_MVP * vec4(aPosition,1.0);
    vUV = aUV;
}