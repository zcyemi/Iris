#version 300 es
#pragma optimize (off)
#pragma debug (on)
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_LIGHT
#include SHADERFX_LIGHTING

struct V2F{
    vec3 pos;
    vec3 normal;
    vec3 wpos;
};
inout V2F v2f;

#queue opaque
#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
in vec2 aUV;
in vec4 aNormal;

void vertex(){
    vec4 wpos = MATRIX_M * aPosition;
    v2f.pos = wpos.xyz;
    vec4 pos = MATRIX_VP * wpos;
    gl_Position = pos;
    v2f.normal = ObjToWorldDir(aNormal.xyz);
    v2f.wpos = wpos.xyz;
}
#endif
#pragma ps fragment
#ifdef SHADER_PS
out lowp vec4 fragColor;
uniform vec4 uColor;
void fragment(){

    vec3 col = Sample_4PointLights(v2f.wpos,normalize(v2f.normal)) * uColor.xyz;
    
    vec3 mainCol = LightModel_Lambert(MAIN_LIGHT_POS.xyz,MAIN_LIGHT_COLOR.xyz,MAIN_LIGHT_COLOR.w,v2f.normal,uColor.xyz);


    fragColor = vec4(mainCol + col,1.0);
}
#endif