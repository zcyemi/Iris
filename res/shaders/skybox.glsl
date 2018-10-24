#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#options ENVMAP_TYPE CUBE TEX 
#queue skybox

#ifdef ENVMAP_TYPE_CUBE
inout vec4 vWorldDir;
uniform samplerCube uSampler;
#endif
#ifdef ENVMAP_TYPE_TEX
inout vec3 vWorldDir;
uniform sampler2D uSampler;
#endif

#pragma vs vertex

in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    pos.xy*=2.0;
    pos.z = 1.0;
    gl_Position = pos;

    vec4 wpos =  inverse(MATRIX_VP) * pos;
    wpos.xyz = wpos.xyz / wpos.w - CAMERA_POS.xyz;
    #ifdef ENVMAP_TYPE_CUBE
    vWorldDir = wpos;
    #endif

    #ifdef ENVMAP_TYPE_TEX
    vWorldDir = wpos.xyz;
    #endif
    
}

#pragma ps fragment
out lowp vec4 fragColor;
void fragment(){
    vec3 dir = vWorldDir.xyz;
    #ifdef ENVMAP_TYPE_CUBE
    fragColor = texture(uSampler,dir);
    #endif
    #ifdef ENVMAP_TYPE_TEX
    dir = normalize(dir);
    float y = 1.0 - 0.5 *(1.0 + dir.y);
    float x = atan(dir.z,dir.x) / PI_2 + 0.5;
    fragColor = texture(uSampler,vec2(x,y));
    #endif
}