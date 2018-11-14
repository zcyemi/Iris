#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue transparent
#zwrite off
#blend src_alpha one_minus_src_alpha

inout vec2 vUV;

#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
in vec2 aUV;

void vertex(){
    gl_Position = MATRIX_MVP * aPosition;
    vUV = aUV;
}
#endif

#pragma ps fragment
#ifdef SHADER_PS
uniform sampler2D uSampler;
out vec4 fragColor;
void fragment(){
    vec4 col = texture(uSampler,vUV);
    fragColor = col;
}
#endif
