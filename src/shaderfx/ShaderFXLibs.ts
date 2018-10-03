import { ShaderSource } from "./ShaderSource";
import { ShaderFX } from "./ShaderFX";


const Shader_Unlit_Color = new ShaderSource(
    `#version 300 es
    precision mediump float;
    #include SHADERFX_CAMERA
    in vec4 aPosition;
    void main(){
        gl_Position = MATRIX_MVP * aPosition;
    }`,
    `#version 300 es
    precision mediump float;
    uniform vec4 uColor;
    out vec4 fragColor;
    void main(){
        fragColor = uColor;
    }`
);

const Shader_Unlit_Texture = new ShaderSource(
    `#version 300 es
    precision meduimp float;
    #include SHADERFX_CAMERA
    in vec4 aPosition;
    in vec2 aUV;
    out vec2 vUV;
    void main(){
        gl_Position = MATRIX_MVP * aPosition;
        vUV = aUV;
    }`,
    `#version 300 es
    precision meduimp float;
    in vec2 vUV;
    out vec4 fragColor;
    uniform sampler2D uSampler;
    void main(){
        fragColor = texture(uSampler,vUV);
    }`
);

const Shader_UV_Value = new ShaderSource(
    `#version 300 es
    precision meduimp float;
    #include SHADERFX_CAMERA
    in vec4 aPosition;
    in vec2 aUV;
    out vec2 vUV;
    void main(){
        gl_Position = MATRIX_MVP * aPosition;
        vUV = aUV;
    }
    `,
    `#version 300 es
    precision meduimp float;
    in vec2 vUV;
    out vec4 fragColor;
    void main(){
        fragColor = vec4(vUV,0,1.0);
    }
    `
)

const Shader_Diffuse = new ShaderSource(
    `#version 300 es
    precision meduimp float;
    #include SHADERFX_BASIS
    in vec4 aPosition;
    in vec2 aUV;
    in vec4 aNormal;

    struct V2F{
        vec3 pos;
        vec3 normal;
    };
    out V2F v2f;
    void main(){
        vec4 wpos = MATRIX_M * aPosition;
        v2f.pos = wpos.xyz;
        vec4 pos = MATRIX_VP * wpos;
        gl_Position = pos;
        v2f.normal = ObjToWorldDir(aNormal.xyz);
    }
    `,
    `#version 300 es
    precision meduimp float;
    #include SHADERFX_LIGHT
    #include SHADERFX_LIGHTING
    struct V2F{
        vec3 pos;
        vec3 normal;
    }
    in V2F v2f;
    out lowp vec4 fragColor;
    uniform vec4 uColor;
    void main(){
        vec3 lcolor = LightModel_Lambert(LIGHT_DIR0,LIGHT_COLOR0,v2f.normal,uColor);
        fragColor = vec4(lcolor + 0.1,1.0);
    }
    `
)