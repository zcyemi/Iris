#include SHADERFX_OBJ
uniform UNIFORM_CAM{
    mat4 _world2view_;
    mat4 _view2proj_;
    vec4 _camerapos_;
    vec4 _projparam_; //[near,far,1/near,1/far]
    vec4 _screenparam_;//[width,height,1/wdith,1/height]
};
#define MATRIX_V _world2view_
#define MATRIX_P _view2proj_
#define MATRIX_VP MATRIX_P * MATRIX_V
#define MATRIX_MV MATRIX_V * MATRIX_M
#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))
#define MATRIX_MVP MATRIX_P * MATRIX_MV
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)
#define CAMERA_POS _camerapos_
#define CAMERA_NEAR _projparam_.x
#define CAMERA_FAR _projparam_.y
#define CAMERA_NEAR_INV _projparam_.z
#define CAMERA_FAR_INV _projparam_.w
#define SCREEN_WIDTH _screenparam_.x
#define SCREEN_HEIGHT _screenparam_.y
#define SCREEN_WIDTH_INV _screenparam_.z
#define SCREEN_HEIGHT_INV _screenparam_.w