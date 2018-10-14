#version 300 es
precision mediump float;

#queue skybox

out vec4 vWorldDir;
void main(){
    gl_Position = vec4(0);
    vWorldDir = vec4(0);
}