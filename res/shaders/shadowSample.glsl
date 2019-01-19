#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP


struct V2F{
    vec3 pos;
    vec3 normal;
    vec3 wpos;
    vec4 FragPosLightSpace;
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

    v2f.FragPosLightSpace = uLightMtx[0] * vec4(v2f.pos,1.0);
}
#endif

#pragma ps fragment
#ifdef SHADER_PS

out lowp vec4 fragColor;
void fragment(){
    float depth = computeShadow(v2f.FragPosLightSpace,uShadowMap);
    fragColor = vec4(depth,depth,depth,1.0);
}
#endif