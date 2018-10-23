#version 300 es
precision mediump float;

#include SHADERFX_BASIS
in vec4 aPosition;
out vec2 vUV;
out vec3 vvdir;

void main(){
    vec4 pos = aPosition;
    vUV = pos.xy +0.5;
    pos.xy *=2.0;

    vec4 clippos = vec4(pos.xy *2.0,1.0,1.0);
    vec4 cwpos = ClipToWorld(clippos);

    vvdir = (cwpos.xyz / cwpos.w) - CAMERA_POS.xyz;
    
    gl_Position = pos;
}