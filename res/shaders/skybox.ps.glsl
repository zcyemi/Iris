#version 300 es
precision mediump float;

in vec4 vWorldDir;
uniform samplerCube uSampler;
out lowp vec4 fragColor;
void main(){
    vec3 dir = vWorldDir.xyz / vWorldDir.w;
    fragColor = texture(uSampler,dir);
}