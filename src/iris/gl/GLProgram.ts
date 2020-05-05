import { SFXTechniqueProperties } from "../core/ShaderFX";

export class GLProgram {

    public Program: WebGLProgram;

    public name:string;

    public Attributes: { [key: string]: number } = {};
    public Uniforms: { [key: string]: WebGLUniformLocation | null } = {};
    public UniformsInfo: { [key: string]: WebGLActiveInfo } = {};

    public UniformBlock: { [key: string]: number } = {};
    /* POSITION_0: aPos  */
    public AttributeSemantic: { [key: string]: number } = {};
    /* MAIN_TEXTURE:uSampler */
    public UniformSemantic:{[key:string]:string} = {};

    public extras?: any;

    private m_id?: number;
    private static s_id: number = 0;
    public get id(): number {
        if (this.m_id == null) {
            GLProgram.s_id++;
            this.m_id = GLProgram.s_id;
        }
        return this.m_id;
    }

    public MarkPropertySemantic(property:SFXTechniqueProperties){
        const attrs = this.Attributes;
        let attrSemantics = {};
        for (const key in property) {
            if (property.hasOwnProperty(key)) {
                const tecProp = property[key];
                const semantic = tecProp.semantic;
                if(semantic == 'MAIN_TEXTURE' || semantic == 'MAIN_COLOR'){
                    this.UniformSemantic[semantic] = key;
                }
                else{
                    let attrInd = attrs[key];
                    if(attrInd!=undefined){
                        attrSemantics[semantic] = attrInd;
                    }
                }
            }
        }
        this.AttributeSemantic = this.AttributeSemantic;
    }

    public GetUniform(key: string): WebGLUniformLocation | null {
        return this.Uniforms[key];
    }

    public GetAttribute(key: string): any {
        return this.Attributes[key];
    }


    public constructor(gl: WebGL2RenderingContext, program: WebGLProgram) {
        this.Program = program;

        const numAttrs = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttrs; i++) {
            let attrInfo = gl.getActiveAttrib(program, i);
            if (attrInfo == null) continue;
            let attrLoca = gl.getAttribLocation(program, attrInfo.name);
            this.Attributes[attrInfo.name] = attrLoca;
        }

        const numUniform = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniform; i++) {
            let uniformInfo = gl.getActiveUniform(program, i);
            if (uniformInfo == null) continue;
            let uname = uniformInfo.name;
            this.UniformsInfo[uname] = uniformInfo;
            let uniformLoca = gl.getUniformLocation(program, uname);
            this.Uniforms[uname] = uniformLoca;
        }

        const numublock = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);
        for (let i = 0; i < numublock; i++) {
            let ublockName = gl.getActiveUniformBlockName(program, i);
            if (ublockName != null) {
                this.UniformBlock[ublockName] = i;
            }
        }
    }
}
