#define PI 3.1415926
#define PI_2 6.2831852
#define PI_HALF 1.5707963
uniform UNIFORM_OBJ{
    mat4 _obj2world_;
};
#define MATRIX_M _obj2world_
uniform UNIFORM_BASIS{
    //basic region
    vec4 _screenparam_;//[width,height,1/wdith,1/height]
    highp vec4 _time_;//[Time,deltaTime,sinTime,cosTime]
    //camera
    vec4 _camera_pos_;
    mat4 _camera_mtx_view_;
    vec4 _camera_projparam_;//[near,far,1/near,1/far]
    mat4 _camera_mtx_proj_;
    mat4 _camera_mtx_invproj_;
    //Ambient And Fog
    lowp vec4 _ambientcolor_;
    vec4 _fogcolor_;
    vec4 _fogparam_;
};
#define TIME _time_
#define SCREEN _screenparam_

#define MATRIX_V _camera_mtx_view_
#define MATRIX_P _camera_mtx_proj_
#define MATRIX_VP MATRIX_P * MATRIX_V
#define MATRIX_MV MATRIX_V * MATRIX_M
#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))
#define MATRIX_MVP MATRIX_P * MATRIX_MV
#define MATRIX_INV_P _camera_mtx_invproj_
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)
#define CAMERA_POS _camera_pos_
#define CAMERA_NEAR _camera_projparam_.x
#define CAMERA_FAR _camera_projparam_.y
#define CAMERA_NEAR_INV _camera_projparam_.z
#define CAMERA_FAR_INV _camera_projparam_.w
#define SCREEN_WIDTH _screenparam_.x
#define SCREEN_HEIGHT _screenparam_.y
#define SCREEN_WIDTH_INV _screenparam_.z
#define SCREEN_HEIGHT_INV _screenparam_.w
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