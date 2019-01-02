#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue opaque

#pragma vs vertex
in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    gl_Position = MATRIX_MVP * pos;
}

#pragma ps fragment
uniform vec4 uColor;
out vec4 fragColor;
void fragment(){
    fragColor = uColor;
}