#version 300 es
precision mediump float;
in vec4 aPosition;

out vec2 vUV;

void main(){
    vec4 pos = aPosition;
    vUV = pos.xy +0.5;
    pos.xy *=2.0;
    gl_Position = pos;
}