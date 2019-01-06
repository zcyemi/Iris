#version 300 es
precision mediump float;
#include SHADERFX_BASIS
#queue opaque
inout vec2 vUV;
#pragma vs vertex

uniform vec4 uRect;

in vec4 aPosition;
in vec2 aUV;
void vertex(){
    vec4 pos = aPosition;

    vec4 rect = uRect * SCREEN.zwzw * 2.0;
    pos.xy = ((pos.xy + 0.5) * rect.zw + rect.xy) - 1.0;

    vUV = vec2(aUV.x,1.0 -aUV.y);
    gl_Position = pos;
}
#pragma ps fragment
uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV);
}