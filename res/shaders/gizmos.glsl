#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue other
#pragma vs vertex
#pragma ps fragment

in vec4 aPosition;

void vertex(){
    vec4 vpos = aPosition;
    gl_Position = MATRIX_MVP * vpos;
}

out vec4 fragColor;
void fragment(){
    fragColor = vec4(1.0);
}