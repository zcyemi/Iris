#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP

#queue opaque

inout vec2 vUV;


#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}

#pragma ps fragment

uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV);
}