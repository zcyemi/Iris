#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue opaque

inout vec4 vColor;

#pragma vs vertex
in vec4 aPosition;
in vec4 aColor; //instancing property
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vColor = aColor;
}

#pragma ps fragment
out vec4 fragColor;
void fragment(){
    fragColor = vColor;
}
