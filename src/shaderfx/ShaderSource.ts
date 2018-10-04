import { ShaderVariant } from "./ShaderVariant";

type VariantsGroup = { [key: string]: ShaderVariant };

export class ShaderSource {

    public variants: string[];

    private vs: string;
    private ps: string;

    private m_built: boolean = false;

    public constructor(vs: string, ps?: string, variants?: string[]) {
        this.variants = variants;
        this.ps = ps;
        this.vs = vs;
    }

    public get isBuilt() {
        return this.m_built;
    }

    public get vertex():string{
        return this.vs;
    }
    public get pixel():string{
        return this.ps;
    }

    public buildShader(v: VariantsGroup) {
        if (this.m_built) return true;

        let gen_vs = ShaderSource.ProcessShader(this.vs, v);
        let gen_ps = ShaderSource.ProcessShader(this.ps, v);

        this.ps = gen_ps;
        this.vs = gen_vs;
        this.m_built = true;
        return true;
    }

    public static ProcessShader(source: string, variants: VariantsGroup) {
        let lines = source.split('\n');
        for (let i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            let matchInc = line.match(/#include ([\w]+)/);
            if (matchInc != null) {
                let vname = matchInc[i];
                let variant = variants[vname];
                if (variant == null) throw new Error(`shader variant [${vname}] not found!`);
                if (!variant.linked) throw new Error(`shader variant [${vname}] not linked!`);
                lines[i] = variant.sources;
                continue;
            }
        }
        return lines.join('\n');
    }
}
