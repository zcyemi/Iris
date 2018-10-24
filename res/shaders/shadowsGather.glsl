#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#include SHADERFX_SHADOWMAP

inout vec2 vUV;
inout vec3 vvdir;

#pragma vs vertex

in vec4 aPosition;
void vertex(){
    vec4 pos = aPosition;
    vUV = pos.xy +0.5;
    pos.xy *=2.0;

    vec4 clippos = vec4(pos.xy *2.0,1.0,1.0);
    vec4 cwpos = ClipToWorld(clippos);

    vvdir = (cwpos.xyz / cwpos.w) - CAMERA_POS.xyz;
    
    gl_Position = pos;
}

#pragma ps fragment

out vec4 fragColor;
uniform sampler2D uDepthTexure;
void fragment(){
    float eyedepth = DECODE_VIEWDEPTH(SAMPLE_DEPTH_TEXTURE(uDepthTexure,vUV));
    vec3 dir = normalize(vvdir);
    vec3 wpos = dir * eyedepth + CAMERA_POS.xyz;
    vec4 lpos = uLightMtx[0] * vec4(wpos,1.0);
    vec3 lcpos = lpos.xyz / lpos.w;
    lcpos = lpos.xyz *0.5 +0.5;
    vec2 coord=  lcpos.xy;
    float shadowDep = texture(uShadowMap,coord).x;
    float d = shadowDep;// lcpos.z;
    fragColor = vec4(lcpos.z -1.0,0,0,1.0);
}