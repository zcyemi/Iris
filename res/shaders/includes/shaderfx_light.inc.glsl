struct LIGHT_DATA{
    vec4 pos_type;
    vec4 col_intensity;
};
layout (std140) uniform UNIFORM_LIGHT{
    LIGHT_DATA light_source[4];
    vec4 ambient_color;
    mediump uint light_num;
};

#define LIGHT_NUM light_num
#define LIGHT_COLOR0 light_source[0].col_intensity.xyz
#define LIGHT_COLOR1 light_source[1].col_intensity.xyz
#define LIGHT_COLOR2 light_source[2].col_intensity.xyz
#define LIGHT_COLOR3 light_source[3].col_intensity.xyz

#define LIGHT_INTENSITY0 light_source[0].col_intensity.w
#define LIGHT_INTENSITY1 light_source[1].col_intensity.w
#define LIGHT_INTENSITY2 light_source[2].col_intensity.w
#define LIGHT_INTENSITY3 light_source[3].col_intensity.w

#define LIGHT_DIR0 light_source[0].pos_type.xyz
#define LIGHT_DIR1 light_source[1].pos_type.xyz