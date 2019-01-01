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

    
    //vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor.xyz);
    
    vec3 lcol1 = Sample_PointLight(v2f.wpos,0u);
    vec3 lcol2 = Sample_PointLight(v2f.wpos,1u);
    
    vec3 col = (lcol1 + lcol2) * uColor.xyz;

    fragColor = vec4(col,1.0);
}
#endif