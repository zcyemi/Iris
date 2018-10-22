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