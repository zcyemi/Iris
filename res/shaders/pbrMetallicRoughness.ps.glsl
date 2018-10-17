#version 300 es
precision mediump float;

in vec2 vUV;

uniform uPBR{
    vec4 uColor;
    float uMetallic;
    float uRoughness;
    float uEmissive;
};

uniform sampler2D uSampler;
uniform sampler2D uTexMetallicRoughness;
uniform sampler2D uTexEmissive;


out vec4 fragColor;
void main(){
    fragColor = texture(uSampler,vUV) * uColor;
}