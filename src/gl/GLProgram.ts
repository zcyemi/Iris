export class GLProgram {

    public Program: WebGLProgram;

    public Attributes: { [key: string]: number } = {};
    public Uniforms: { [key: string]: WebGLUniformLocation | null } = {};
    public UniformsInfo: { [key: string]: WebGLActiveInfo } = {};

    public UniformBlock: { [key: string]: number } = {};
    public UniformSemantic: { [key: string]: number } = {};

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

    public MarkAttributeSemantic(semantics: { [key: string]: string }) {
        let result = {};

        const attrs = this.Attributes;
        for (const key in attrs) {
            if (attrs.hasOwnProperty(key)) {
                const element = attrs[key];
                let semantic = semantics[<string>key];
                if (semantic) {
                    result[semantic] = element;
                }
            }
        }
        this.UniformSemantic = result;
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
