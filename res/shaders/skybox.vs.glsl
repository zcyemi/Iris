#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#options ENVMAP_TYPE CUBE TEX 

#queue skybox

in vec4 aPosition;

#ifdef ENVMAP_TYPE_CUBE
out vec4 vWorldDir;
#endif

#ifdef ENVMAP_TYPE_TEX
out vec4 vWorldDir;
#endif

void main(){
    vec4 pos = aPosition;
    pos.xy*=2.0;
    pos.z = 1.0;
    gl_Position = pos;

    vec4 wpos =  inverse(MATRIX_VP) * pos;
    #ifdef ENVMAP_TYPE_CUBE
    vWorldDir = wpos;
    #endif

    #ifdef ENVMAP_TYPE_TEX
    vWorldDir = wpos;
    #endif
    
}