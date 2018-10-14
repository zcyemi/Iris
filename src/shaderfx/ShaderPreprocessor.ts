import { IncludeIndex, ShaderOptions } from "./ShaderVariant";
import { VariantsGroup } from "./ShaderSource";

export class ShaderPreprocessor {


    public static readonly REGEX_INCLUDE: RegExp = /#include ([\w]+)/;
    public static readonly REGEX_OPTIONS: RegExp = /^[\s]*#options/;

    public static processVariantInclude(line: string, lineindex: number): IncludeIndex {
        const match = ShaderPreprocessor.REGEX_INCLUDE;
        let matchInc = line.match(match);
        if (matchInc != null) {
            return { key: matchInc[1], line: lineindex };
        }
        return null;
    }

    /**
     * Process shader source #include macros
     * @param line 
     * @param variants 
     * @returns line:string variantName:string
     */
    public static processSourceInclude(line: string, variants: VariantsGroup): [string, string] {
        const match = /#include ([\w]+)/;
        let matchInc = line.match(match);
        if (matchInc != null) {
            let vname = matchInc[1];
            let variant = variants[vname];
            if (variant == null) {
                throw new Error(`shader variant [${vname}] not found!`);
            }
            if (!variant.linked) throw new Error(`shader variant [${vname}] not linked!`);
            return [variant.sources, vname];
        }
        return null;
    }


    public static processOptions(line: string): [string, ShaderOptions] {
        const match = ShaderPreprocessor.REGEX_OPTIONS;
        if (!line.match(match)) {
            return null;
        }

        let linet = line.trim();
        let options = linet.substr(8);
        let parts = options.split(' ');
        if (parts == null || parts.length == 0) throw new Error(`invalid #options ${line}`);

        let validopts: string[] = [];
        for (let i = 0, len = parts.length; i < len; i++) {
            let item = parts[i].trim();
            if (item == '') continue;
            validopts.push(item);
        }

        let validlen = validopts.length;

        if (validlen == 0 || validlen == 1) throw new Error(`invalid #options ${line}`);

        if (validlen == 2) {
            let val = validopts[1];
            if (val != 'ON' && val != 'OFF') throw new Error(`invalid #options ${line}`);
            let opt = new ShaderOptions();
            opt.flag = validopts[0];
            opt.default = val;
            opt.values = ['ON', 'OFF'];
            return ['//' + line, opt];
        }
        else {
            let opt = new ShaderOptions();
            opt.flag = validopts[0];
            opt.default = validopts[1];
            opt.values = validopts.slice(1);
            return ['//' + line, opt];
        }
    }
}