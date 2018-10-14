#version 300 es
precision mediump float;

#include SHADERFX_BASIS

#ifdef ENVMAP_TYPE_CUBE
in vec4 vWorldDir;
uniform samplerCube uSampler;
#endif
#ifdef ENVMAP_TYPE_TEX
in vec4 vWorldDir;
uniform sampler2D uSampler;
#endif


out lowp vec4 fragColor;
void main(){
    vec3 dir = vWorldDir.xyz / vWorldDir.w;
    #ifdef ENVMAP_TYPE_CUBE
    fragColor = texture(uSampler,dir);
    #endif
    #ifdef ENVMAP_TYPE_TEX
    dir = normalize(dir);
    float y = 1.0 - 0.5 *(1.0 + dir.y);
    float x = atan(dir.z,dir.x) / PI /2.0 + 0.5;
    fragColor = texture(uSampler,vec2(x,y));
    #endif
}