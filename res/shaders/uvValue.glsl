#version 300 es
precision mediump float;
#include SHADERFX_BASIS

inout vec2 vUV;

#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}

#pragma ps fragment
out vec4 fragColor;
void fragment(){
    fragColor = vec4(vUV,0,1.0);
}