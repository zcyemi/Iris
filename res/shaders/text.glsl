#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue overlay
#zwrite off
#ztest lequal
#blend src_alpha one_minus_src_alpha

inout vec2 vUV;

#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
in vec2 aUV;

void vertex(){
    vec2 pos = 2.0 * (aPosition.xy * _screenparam_.zw) -1.0 ;
    
    gl_Position = vec4(pos.x,-pos.y,0,1.0);
    vUV = aUV;
}
#endif

#pragma ps fragment
#ifdef SHADER_PS
out vec4 fragColor;
uniform sampler2D uSampler;
void fragment(){
    vec2 uv =vUV;
    vec4 col = texture(uSampler,uv);
    col.a = col.r;
    col.rgb = vec3(1.0);

    fragColor = col;
}
#endif
