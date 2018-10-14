import { ShaderVariant, ShaderOptionsConfig, ShaderOptions } from "./ShaderVariant";
import { ShaderTags, Comparison, RenderQueue, BlendOperator, BlendFactor } from "./Shader";
import { ShaderPreprocessor } from "./ShaderPreprocessor";

export type VariantsGroup = { [key: string]: ShaderVariant };
export class ShaderSource {

    public variants: string[];

    private vs: string;
    private ps: string;

    private m_built: boolean = false;

    private m_shaderTag: ShaderTags = null;


    public optionsList:ShaderOptions[] = [];

    public constructor(vs: string, ps?: string) {
        this.ps = ps;
        this.vs = vs;
    }

    public get isBuilt() {
        return this.m_built;
    }

    public get vertex(): string {
        return this.vs;
    }
    public get pixel(): string {
        return this.ps;
    }

    public get tags():ShaderTags{
        return this.m_shaderTag;
    }

    public buildShader(v: VariantsGroup) {
        if (this.m_built) return true;

        let gen_vs = this.ProcessShader(this.vs, v);
        let gen_ps = this.ProcessShader(this.ps, v);

        this.ps = gen_ps;
        this.vs = gen_vs;
        this.m_built = true;
        return true;
    }

    public addVariant(vname: string):boolean{
        if (this.variants == null) {
            this.variants = [];
            this.variants.push(vname);
            return true;
        }

        let variants = this.variants;
        if (variants.indexOf(vname) < 0) {
            variants.push(vname);
            return true;
        }
        return false;
    }

    private addOptions(variant:ShaderVariant){
        let options = variant.options;
        if(options == null) return;

        let optlist = this.optionsList;
        for(let i=0,len = options.length;i<len;i++){
            optlist.push(options[i]);
        }
    }


    public ProcessShader(source: string, variants: VariantsGroup) {
        let lines = source.split('\n');
        for (let i = 0, len = lines.length; i < len; i++) {
            let line = lines[i];
            

            let pinclude = ShaderPreprocessor.processSourceInclude(line,variants);
            if(pinclude!=null){
                lines[i] = pinclude[0];
                let vname = pinclude[1];
                let added = this.addVariant(vname);
                if(added) this.addOptions(variants[vname]);
                continue;
            }

            let poptions = ShaderPreprocessor.processOptions(line);
            if(poptions != null){
                lines[i] = poptions[0];
                this.optionsList.push(poptions[1]);
                continue;
            }


            lines[i] = this.processShaderTag(line);
        }
        return lines.join('\n').trim();
    }

    private processShaderTag(line: string): string {
        line = line.trim();
        let tags = this.m_shaderTag;
        const regex2 = /#(ztest|zwrite|queue) ([\w]+)/;
        let match = line.match(regex2);
        if (match != null) {
            if(tags == null){
                tags = new ShaderTags();
                this.m_shaderTag= tags;
            }
            let tagtype = match[1].toLowerCase();
            let tagval = match[2].toUpperCase();
            switch (tagtype) {
                case "ztest":
                    this.setShaderTagProperty('ztest',tagval,Comparison);
                    break;
                case "zwrite":
                    {
                        let val = tagval === 'OFF' ? 0 : (tagval === "ON" ? 1 : -1);
                        if (val == -1) {
                            throw new Error(`invalid zwrite tag [${match[2]}]`);
                        }
                        let newval = val == 1;
                        if (tags.zwrite == null || tags.zwrite == newval) {
                            tags.zwrite = newval;
                        }
                        else {
                            throw new Error(`zwrite tag conflict`);
                        }
                    }
                    break;
                case "queue":
                    tagval = tagval.charAt(0).toUpperCase() + match[2].slice(1);
                    this.setShaderTagProperty('queue',tagval,RenderQueue);
                    break;
                default:
                    throw new Error(`unknown shader tag [${line}]`);
            }
            line = '';
        }

        const regexblend = /#blend ([\w]+) ([\w]+)[\s]*([\w]+)*/;

        match = line.match(regexblend);
        if(match != null){
            if(tags == null){
                tags = new ShaderTags();
                this.m_shaderTag= tags;
            }
            let tarfs = match[1].toUpperCase();
            let tarfd = match[2].toUpperCase();
            let tarop = match[3].toLocaleUpperCase();
            if(tarop == null){
                tarop = 'ADD';
            }
            else{
                let op = BlendOperator[tarop];
                if(op == null) throw new Error(`invalid blend operator [${tarop}]`);
            }

            let fs = BlendFactor[tarfs];
            let fd = BlendFactor[tarfd];

            if(fs == null) throw new Error(`invalid blend factor [${match[1]}]`);
            if(fd == null) throw new Error(`invalid blend factor [${match[2]}]`);

            let newop = BlendFactor[tarop];

            if(tags.blendOp != null && (tags.blendOp != newop || tags.blendFactorDst != fd || tags.blendFactorSrc != fs)){
                throw new Error(`bleng tag conflict [${line}]`);
            }
            else{
                tags.blendOp = newop;
                tags.blendFactorSrc = fs;
                tags.blendFactorDst = fd;
            }
            line = '';
        }
        return line;
    }

    public setShaderTagProperty(pname:string,tagval:string,enumtype){
        let tags = this.m_shaderTag;
        let val = enumtype[tagval];
        if (val == undefined) {
            throw new Error(`invalid ${pname} tag [${tagval}]`);
        }
        if (tags[pname] == null) {
            tags[pname] = val;
        }
        else {
            if (tags[pname] != val) {
                throw new Error(`${pname} tag conflict [${Comparison[tags[pname]]}] [${tagval}]`);
            }
        }
    }

    public injectCompileFlags(flags:string):[string,string]{
        const prefix = '#version 300 es';
        flags = prefix + '\n' + flags;
        let vs =this.vs;
        let ps = this.pixel;
        if(!vs.startsWith(prefix)){
            vs = flags + vs;
        }
        else{
            vs = flags + vs.slice(15);
        }

        if(!ps.startsWith(prefix)){
            ps = flags + ps;
        }
        else{
            ps = flags + ps.slice(15);
        }

        return [vs,ps];
    }
}