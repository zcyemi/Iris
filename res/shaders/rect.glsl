#version 300 es
precision mediump float;
#include SHADERFX_BASIS

#queue overlay
#zwrite off
#ztest always

inout vec2 vUV;
inout vec4 vColor;

#pragma vs vertex
#ifdef SHADER_VS
in vec4 aPosition;
in vec2 aUV;
in vec4 aColor;

void vertex(){
    vec2 pos = 2.0 * (aPosition.xy * _screenparam_.zw) -1.0 ;
    
    gl_Position = vec4(pos.x,-pos.y,0,1.0);
    vUV = aUV;
    vColor = aColor;
}
#endif

#pragma ps fragment
#ifdef SHADER_PS
out vec4 fragColor;
void fragment(){
    fragColor = vColor;
}
#endif
