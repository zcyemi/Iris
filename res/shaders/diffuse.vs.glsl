#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue opaque

in vec4 aPosition;
in vec2 aUV;
in vec4 aNormal;
struct V2F{
    vec3 pos;
    vec3 normal;
};
out V2F v2f;
void main(){
    vec4 wpos = MATRIX_M * aPosition;
    v2f.pos = wpos.xyz;
    vec4 pos = MATRIX_VP * wpos;
    gl_Position = pos;
    v2f.normal = ObjToWorldDir(aNormal.xyz);
}