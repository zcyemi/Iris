#define PI 3.1415926
#define PI_2 6.2831852
#define PI_HALF 1.5707963

#include SHADERFX_OBJ
#include SHADERFX_CAMERA
vec3 ObjToWorldDir(in vec3 dir){
    return normalize(dir * mat3(MATRIX_WORLD2OBJ));
}