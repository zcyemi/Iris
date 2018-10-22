#version 300 es
precision mediump float;
out vec4 fragColor;

uniform sampler2D uDepthTexure;
uniform sampler2D uShadowMap;

in vec2 vUV;

void main(){
    fragColor = texture(uDepthTexure,vUV);
}