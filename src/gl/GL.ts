



export enum GLConst {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,


}


export class GL{

    public static readonly RGB:number= 0x1907;
    public static readonly RGBA:number = 0x1908;
    

    public static readonly BYTE:GLDataType = 5120;
    public static readonly UNSIGNED_BYTE:GLDataType = 5121;
    public static readonly SHORT:GLDataType = 5122;
    public static readonly UNSIGNED_SHORT:GLDataType = 5123;
    public static readonly UNSIGNED_INT:GLDataType = 5125;
    public static readonly FLOAT:GLDataType = 5126;

    public static readonly NEAREST:number = 0x2600;
    public static readonly LINEAR:number  = 0x2601;
    public static readonly NEAREST_MIPMAP_NEAREST:number = 0x2700;
    public static readonly LINEAR_MIPMAP_NEAREST:number = 0x2701;
    public static readonly NEAREST_MIPMAP_LINEAR:number = 0x2702;
    public static readonly LINEAR_MIPMAP_LINEAR:number = 0x2703;
    public static readonly TEXTURE_MAG_FILTER:number = 0x2800;
    public static readonly TEXTURE_MIN_FILTER:number = 0x2801;
    public static readonly TEXTURE_WRAP_S:number = 0x2802;
    public static readonly TEXTURE_WRAP_T:number = 0x2803;
    public static readonly TEXTURE_2D:number = 0x0DE1;
    public static readonly TEXTURE:number = 0x1702;
    public static readonly TEXTURE_CUBE_MAP:number = 0x8513;
    public static readonly TEXTURE_BINDING_CUBE_MAP:number = 0x8514;
    public static readonly TEXTURE_CUBE_MAP_POSITIVE_X:number = 0x8515;
    public static readonly TEXTURE_CUBE_MAP_NEGATIVE_X:number = 0x8516;
    public static readonly TEXTURE_CUBE_MAP_POSITIVE_Y:number = 0x8517;
    public static readonly TEXTURE_CUBE_MAP_NEGATIVE_Y:number = 0x8518;
    public static readonly TEXTURE_CUBE_MAP_POSITIVE_Z:number = 0x8519;
    public static readonly EXTURE_CUBE_MAP_NEGATIVE_Z:number = 0x851A;
    public static readonly MAX_CUBE_MAP_TEXTURE_SIZE:number = 0x851C;
    public static readonly ACTIVE_TEXTURE:number = 0x84E0;
    public static readonly REPEAT:number = 0x2901;
    public static readonly CLAMP_TO_EDGE:number = 0x812F;
    public static readonly MIRRORED_REPEAT:number = 0x8370;

    public static readonly TEXTURE_COMPARE_MODE = 0x884C;
    public static readonly TEXTURE_COMPARE_FUNC = 0x884D;
    public static readonly COMPARE_REF_TO_TEXTURE = 0x884E;

    public static readonly SAMPLER_2D = 0x8B5E;
    public static readonly SAMPLER_3D = 0x8B5F;
    public static readonly SAMPLER_2D_SHADOW = 0x8B62;
    public static readonly SAMPLER_2D_ARRAY = 0x8DC1;
    public static readonly SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
    public static readonly SAMPLER_CUBE_SHADOW = 0x8DC5;


}


export type GLDataType = GLConst.BYTE | GLConst.UNSIGNED_BYTE | GLConst.SHORT | GLConst.FLOAT | GLConst.UNSIGNED_BYTE | GLConst.UNSIGNED_INT | GLConst.UNSIGNED_SHORT;

