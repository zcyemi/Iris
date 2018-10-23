#version 300 es
precision mediump float;
#include SHADERFX_LIGHT
#include SHADERFX_LIGHTING
struct V2F{
    vec3 pos;
    vec3 normal;
};
in V2F v2f;
out lowp vec4 fragColor;
uniform vec4 uColor;
void main(){
    vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor.xyz);
    fragColor = vec4(lcolor +0.1,1.0);
}