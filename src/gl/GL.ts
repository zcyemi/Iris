import { type } from "os";




export enum GLConst {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,


}


export type GLData = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array |
    Uint32Array | Uint8ClampedArray | Float32Array | Float64Array | DataView | ArrayBuffer | null;
export type GLSizeOrData = number | GLData;


export class GL {

    public static readonly FRAMEBUFFER = 0x8D40;
    public static readonly RENDERBUFFER = 0x8D41;
    public static readonly COLOR_ATTACHMENT0 = 0x8CE0;
    public static readonly DEPTH_ATTACHMENT = 0x8D00;
    public static readonly DEPTH_STENCIL_ATTACHMENT = 0x821A;
    public static readonly STENCIL_ATTACHMENT = 0x8D20;
    public static readonly COLOR_ATTACHMENT1 = 0x8CE1;
    public static readonly COLOR_ATTACHMENT2 = 0x8CE2;
    public static readonly COLOR_ATTACHMENT3 = 0x8CE3;
    public static readonly COLOR_ATTACHMENT4 = 0x8CE4;
    public static readonly COLOR_ATTACHMENT5 = 0x8CE5;
    public static readonly COLOR_ATTACHMENT6 = 0x8CE6;
    public static readonly COLOR_ATTACHMENT7 = 0x8CE7;
    public static readonly COLOR_ATTACHMENT8 = 0x8CE8;
    public static readonly COLOR_ATTACHMENT9 = 0x8CE9;
    public static readonly COLOR_ATTACHMENT10 = 0x8CEA;
    public static readonly COLOR_ATTACHMENT11 = 0x8CEB;
    public static readonly COLOR_ATTACHMENT12 = 0x8CEC;
    public static readonly COLOR_ATTACHMENT13 = 0x8CED;
    public static readonly COLOR_ATTACHMENT14 = 0x8CEE;
    public static readonly COLOR_ATTACHMENT15 = 0x8CEF;

    public static readonly DEPTH_BUFFER_BIT = 0x00000100;
    public static readonly STENCIL_BUFFER_BIT = 0x00000400;
    public static readonly COLOR_BUFFER_BIT = 0x00004000;

    public static readonly ARRAY_BUFFER: number = 0x8892;
    public static readonly ELEMENT_ARRAY_BUFFER: number = 0x8893;
    public static readonly UNIFORM_BUFFER: number = 0x8A11;

    public static readonly PIXEL_PACK_BUFFER = 0x88EB;
    public static readonly PIXEL_UNPACK_BUFFER = 0x88EC;
    public static readonly PIXEL_PACK_BUFFER_BINDING = 0x88ED;
    public static readonly PIXEL_UNPACK_BUFFER_BINDING = 0x88EF;
    public static readonly COPY_READ_BUFFER = 0x8F36;
    public static readonly COPY_WRITE_BUFFER = 0x8F37;
    public static readonly COPY_READ_BUFFER_BINDING = 0x8F36;
    public static readonly COPY_WRITE_BUFFER_BINDING = 0x8F37;

    public static readonly STATIC_DRAW: number = 0x88E4;
    public static readonly STREAM_DRAW: number = 0x88E0;
    public static readonly DYNAMIC_DRAW: number = 0x88E8;

    public static readonly RGB: number = 0x1907;
    public static readonly RGBA: number = 0x1908;
    public static readonly RGBA8: number = 0x8051;

    public static readonly DEPTH_COMPONENT = 0x1902;

    public static readonly DEPTH_COMPONENT16 = 0x81A5;
    public static readonly DEPTH_COMPONENT24 = 0x81A6;
    public static readonly DEPTH_COMPONENT32F = 0x8CAC;

    public static readonly DEPTH_STENCIL = 0x84F9;
    public static readonly DEPTH24_STENCIL8 = 0x88F0;

    public static readonly STENCIL_INDEX = 0x1901;
    public static readonly STENCIL_INDEX8 = 0x8D48;

    private static readonly s_depth_fmt: number[] = [GL.DEPTH_COMPONENT16, GL.DEPTH_COMPONENT24, GL.DEPTH_COMPONENT32F, GL.DEPTH_COMPONENT];
    private static readonly s_stencil_fmt: number[] = [GL.STENCIL_INDEX8, GL.STENCIL_INDEX];
    private static readonly s_depth_stencil_fmt: number[] = [GL.DEPTH24_STENCIL8, GL.DEPTH_STENCIL];

    public static readonly BYTE: GLDataType = 5120;
    public static readonly UNSIGNED_BYTE: GLDataType = 5121;
    public static readonly SHORT: GLDataType = 5122;
    public static readonly UNSIGNED_SHORT: GLDataType = 5123;
    public static readonly UNSIGNED_INT: GLDataType = 5125;
    public static readonly FLOAT: GLDataType = 5126;

    public static readonly NEAREST: number = 0x2600;
    public static readonly LINEAR: number = 0x2601;
    public static readonly NEAREST_MIPMAP_NEAREST: number = 0x2700;
    public static readonly LINEAR_MIPMAP_NEAREST: number = 0x2701;
    public static readonly NEAREST_MIPMAP_LINEAR: number = 0x2702;
    public static readonly LINEAR_MIPMAP_LINEAR: number = 0x2703;
    public static readonly TEXTURE_MAG_FILTER: number = 0x2800;
    public static readonly TEXTURE_MIN_FILTER: number = 0x2801;
    public static readonly TEXTURE_WRAP_S: number = 0x2802;
    public static readonly TEXTURE_WRAP_T: number = 0x2803;
    public static readonly TEXTURE_WRAP_R:number = 0x8072;
    public static readonly TEXTURE_2D: number = 0x0DE1;
    public static readonly TEXTURE: number = 0x1702;
    public static readonly TEXTURE_CUBE_MAP: number = 0x8513;
    public static readonly TEXTURE_BINDING_CUBE_MAP: number = 0x8514;
    public static readonly TEXTURE_CUBE_MAP_POSITIVE_X: number = 0x8515;
    public static readonly TEXTURE_CUBE_MAP_NEGATIVE_X: number = 0x8516;
    public static readonly TEXTURE_CUBE_MAP_POSITIVE_Y: number = 0x8517;
    public static readonly TEXTURE_CUBE_MAP_NEGATIVE_Y: number = 0x8518;
    public static readonly TEXTURE_CUBE_MAP_POSITIVE_Z: number = 0x8519;
    public static readonly EXTURE_CUBE_MAP_NEGATIVE_Z: number = 0x851A;
    public static readonly MAX_CUBE_MAP_TEXTURE_SIZE: number = 0x851C;
    public static readonly ACTIVE_TEXTURE: number = 0x84E0;
    public static readonly REPEAT: number = 0x2901;
    public static readonly CLAMP_TO_EDGE: number = 0x812F;
    public static readonly MIRRORED_REPEAT: number = 0x8370;

    public static readonly TEXTURE_COMPARE_MODE = 0x884C;
    public static readonly TEXTURE_COMPARE_FUNC = 0x884D;
    public static readonly COMPARE_REF_TO_TEXTURE = 0x884E;

    public static readonly SAMPLER_2D = 0x8B5E;
    public static readonly SAMPLER_3D = 0x8B5F;
    public static readonly SAMPLER_2D_SHADOW = 0x8B62;
    public static readonly SAMPLER_2D_ARRAY = 0x8DC1;
    public static readonly SAMPLER_2D_ARRAY_SHADOW = 0x8DC4;
    public static readonly SAMPLER_CUBE_SHADOW = 0x8DC5;

    public static readonly OBJECT_TYPE = 0x9112;
    public static readonly SYNC_CONDITION = 0x9113;
    public static readonly SYNC_STATUS = 0x9114;
    public static readonly SYNC_FLAGS = 0x9115;
    public static readonly SYNC_FENCE = 0x9116;
    public static readonly SYNC_GPU_COMMANDS_COMPLETE = 0x9117;
    public static readonly UNSIGNALED = 0x9118;
    public static readonly SIGNALED = 0x9119;
    public static readonly ALREADY_SIGNALED = 0x911A;
    public static readonly TIMEOUT_EXPIRED = 0x911B;
    public static readonly CONDITION_SATISFIED = 0x911C;
    public static readonly WAIT_FAILED = 0x911D;
    public static readonly SYNC_FLUSH_COMMANDS_BIT = 0x00000001;

    public static readonly NEVER = 0x0200;
    public static readonly ALWAYS = 0x0207;
    public static readonly LESS = 0x0201;
    public static readonly EQUAL = 0x0202;
    public static readonly LEQUAL = 0x0203;
    public static readonly GREATER = 0x0204;
    public static readonly GEQUAL = 0x0206;
    public static readonly NOTEQUAL = 0x0205;

    public static readonly BLEND = 0x0BE2;
    public static readonly DEPTH_TEST = 0x0B71;
    public static readonly DITHER = 0x0BD0;
    public static readonly POLYGON_OFFSET_FILL = 0x8037;
    public static readonly SAMPLE_ALPHA_TO_COVERAGE = 0x809E;
    public static readonly SAMPLE_COVERAGE = 0x80A0;
    public static readonly SCISSOR_TEST = 0x0C11;
    public static readonly STENCIL_TEST = 0x0B90;

    public static readonly CW = 0x0900;
    public static readonly CCW = 0x0901;

    public static readonly TEXTURE0 = 33984;
    public static readonly TEXTURE1 = 33985;
    public static readonly TEXTURE2 = 33986;
    public static readonly TEXTURE3 = 33987;
    public static readonly TEXTURE4 = 33988;
    public static readonly TEXTURE5 = 33989;
    public static readonly TEXTURE6 = 33990;
    public static readonly TEXTURE7 = 33991;
    public static readonly TEXTURE8 = 33992;
    public static readonly TEXTURE9 = 33993;
    public static readonly TEXTURE10 = 33994;
    public static readonly TEXTURE11 = 33995;
    public static readonly TEXTURE12 = 33996;
    public static readonly TEXTURE13 = 33997;
    public static readonly TEXTURE14 = 33998;
    public static readonly TEXTURE15 = 33999;
    public static readonly TEXTURE16 = 34000;
    public static readonly TEXTURE17 = 34001;
    public static readonly TEXTURE18 = 34002;
    public static readonly TEXTURE19 = 34003;
    public static readonly TEXTURE20 = 34004;
    public static readonly TEXTURE21 = 34005;
    public static readonly TEXTURE22 = 34006;
    public static readonly TEXTURE23 = 34007;
    public static readonly TEXTURE24 = 34008;
    public static readonly TEXTURE25 = 34009;
    public static readonly TEXTURE26 = 34010;
    public static readonly TEXTURE27 = 34011;
    public static readonly TEXTURE28 = 34012;
    public static readonly TEXTURE29 = 34013;
    public static readonly TEXTURE30 = 34014;
    public static readonly TEXTURE31 = 34015;

    public static readonly FLOAT_VEC2 = 0x8B50;
    public static readonly FLOAT_VEC3 = 0x8B51;
    public static readonly FLOAT_VEC4 = 0x8B52;
    public static readonly INT_VEC2 = 0x8B53;
    public static readonly INT_VEC3 = 0x8B54;
    public static readonly INT_VEC4 = 0x8B55;
    public static readonly BOOL = 0x8B56;
    public static readonly BOOL_VEC2 = 0x8B57;
    public static readonly BOOL_VEC3 = 0x8B58;
    public static readonly BOOL_VEC4 = 0x8B59;
    public static readonly FLOAT_MAT2 = 0x8B5A;
    public static readonly FLOAT_MAT3 = 0x8B5B;
    public static readonly FLOAT_MAT4 = 0x8B5C;
    public static readonly SAMPLER_CUBE = 0x8B60;

    public static isDepthFmt(fmt: number) {
        return GL.s_depth_fmt.indexOf(fmt) >= 0;
    }
    public static isDepthStencilFmt(fmt: number) {
        return GL.s_depth_stencil_fmt.indexOf(fmt) >= 0;
    }
    public static isStencilFmt(fmt: number) {
        return GL.s_stencil_fmt.indexOf(fmt) >= 0;
    }

}


export type GLDataType = GLConst.BYTE | GLConst.UNSIGNED_BYTE | GLConst.SHORT | GLConst.FLOAT | GLConst.UNSIGNED_BYTE | GLConst.UNSIGNED_INT | GLConst.UNSIGNED_SHORT;

