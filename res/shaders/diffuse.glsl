#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_LIGHT
#include SHADERFX_LIGHTING

#queue opaque
#pragma vs vertex
#pragma ps fragment

in vec4 aPosition;
in vec2 aUV;
in vec4 aNormal;

struct V2F{
    vec3 pos;
    vec3 normal;
};
inout V2F v2f;

void vertex(){
    vec4 wpos = MATRIX_M * aPosition;
    v2f.pos = wpos.xyz;
    vec4 pos = MATRIX_VP * wpos;
    gl_Position = pos;
    v2f.normal = ObjToWorldDir(aNormal.xyz);
}

out lowp vec4 fragColor;
uniform vec4 uColor;
void fragment(){
    vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor.xyz);
    fragColor = vec4(lcolor +0.1,1.0);
}