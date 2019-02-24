#version 300 es
precision mediump float;
#queue opaque
#zwrite off
#ztest always

inout vec2 vUV;
#pragma vs vertex
in vec4 aPosition;
in vec2 aUV;
void vertex(){
    vec4 pos = aPosition;
    pos.xy *=2.0;
    vUV = vec2(aUV.x,1.0 -aUV.y);
    gl_Position = pos;
}
#pragma ps fragment
uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    fragColor = texture(uSampler,vUV);
}