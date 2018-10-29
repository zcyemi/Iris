#define PI 3.1415926
#define PI_2 6.2831852
#define PI_HALF 1.5707963

#include SHADERFX_OBJ
#include SHADERFX_CAMERA
vec3 ObjToWorldDir(in vec3 dir){
    return normalize(dir * mat3(MATRIX_WORLD2OBJ));
}

float SAMPLE_DEPTH_TEXTURE(sampler2D depthtex,vec2 uv){
    return texture(depthtex,uv).r;
}

float DECODE_VIEWDEPTH(float d){
    return 1.0/ ((CAMERA_NEAR_INV - CAMERA_FAR_INV) * d  - CAMERA_NEAR_INV);
}

vec4 ClipToWorld(in vec4 clippoint){
    return inverse(MATRIX_VP) * clippoint;
}

#ifdef SFX

uniform UNIFORM_SHADERFX{
    //basic region
    vec4 _screenparam_;//[width,height,1/wdith,1/height]
    highp vec4 _time_;//[Time,deltaTime,sinTime,cosTime]

    //camera
    vec4 _camera_projparam_;//[near,far,1/near,1/far]
    vec4 _camera_pos_;
    mat4 _camera_mtx_view_;
    mat4 _camera_mtx_proj_;
    mat4 _camera_mtx_invproj_;

    //Ambient And Fog
    lowp vec4 _ambientcolor_;
    vec4 _fogcolor_;
    vec4 _fogparam_;
}

#endif