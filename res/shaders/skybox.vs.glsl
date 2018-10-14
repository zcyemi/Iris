#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue skybox

in vec4 aPosition;

out vec4 vWorldDir;
void main(){
    vec4 pos = aPosition;
    pos.xy*=2.0;
    pos.z = 1.0;
    gl_Position = pos;
    vWorldDir = inverse(MATRIX_VP) * pos;
}