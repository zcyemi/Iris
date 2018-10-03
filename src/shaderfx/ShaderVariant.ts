const VARIANTS = `

renderpass:
    shadowMap

lighting:
    brdf

scenegraph:
    per-obj
    per-camera

basis:
    per-shader
    vs-attrs
    varying-v2f
    ps


`;


const VERTEX_BASE = `
in vec4 aPosition;
in vec2 aUV;
in vec2 aNormal;
`

const VERTEX_COLOR = VERTEX_BASE+
`
in vec4 aColor;
`;

const UNIFORM_OBJ = `
uniform UNIFORM_OBJ{
    mat4 _obj2world_;
}
#define MATRIX_M _obj2world_
`;

const UNIFORM_CAM = `
#require UNIFORM_OBJ

uniform UNIFORM_CAM{
    mat4 _world2view_;
    mat4 _view2proj_;
}
#define MATRIX_V _world2view_
#define MATRIX_P _view2proj_
#define MATRIX_VP MATRIX_P * MATRIX_V
#define MATRIX_MV MATRIX_V * MATRIX_M
#define MATRIX_IT_MV transpose(inverse(MATRIX_MV))
#define MATRIX_MVP MATRIX_P * MATRIX_MV
#define MATRIX_WORLD2OBJ inverse(MATRIX_M)
`;

const UNIFORM_LIGHT = `
#multi_compile LIGHTING LIGHT4 LIGHT8

struct LIGHT_DATA{
    
}

`