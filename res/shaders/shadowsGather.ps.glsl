#version 300 es
precision mediump float;

#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP

out vec4 fragColor;

uniform sampler2D uDepthTexure;

in vec2 vUV;
in vec3 vvdir;

void main(){
    float eyedepth = DECODE_VIEWDEPTH(SAMPLE_DEPTH_TEXTURE(uDepthTexure,vUV));

    vec3 dir = normalize(vvdir);
    vec3 wpos = dir * eyedepth + CAMERA_POS.xyz;
    vec4 lpos = uLightMtx[0] * vec4(wpos,1.0);

    vec3 lcpos = lpos.xyz / lpos.w;

    lcpos = lpos.xyz *0.5 +0.5;

    vec2 coord=  lcpos.xy;
    float shadowDep = texture(uShadowMap,coord).x;

    // if(coord < 0.01){
    //     coord = 1.0;
    // }

    float d = shadowDep;// lcpos.z;

    fragColor = vec4(lcpos.z -1.0,0,0,1.0);
}