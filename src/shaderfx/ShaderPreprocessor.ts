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

    public static processUnifiedSource(unified:string,name?:string):[string,string]{
        const pattern_pragma = /#pragma ([\w]+) ([\w]+)/g;
        const pattern_entry = /void ([\w\d]+)[\s]*\(/g;

        let vs_entry:string = null;
        let ps_entry:string = null;

        let matchPragma = unified.match(pattern_pragma);
        if(matchPragma != null){
            for(let i=0,mlen = matchPragma.length;i<mlen;i++){
                let pragmastr = matchPragma[i];
                let splits = pragmastr.split(/\s+/);
                let key = splits[1];
                let val = splits[2];
                if(key === 'vs') vs_entry = val;
                if(key === 'ps') ps_entry = val;
            }
        }

        if(vs_entry == null) throw new Error(`vs entry is not definded, shader:${name}`);
        if(ps_entry == null) throw new Error(`ps entry is not definded, shader:${name}`);

        let vs_func:[number,number] = null; 
        let ps_func:[number,number] = null;
        
        let matchEntry = unified.match(pattern_entry);
        if(matchEntry != null){
            let len = matchEntry.length;
            for(let i=0;i<len;i++){
                let entry = matchEntry[i];

                let part = entry.split(/\s+/)[1].replace('(','').trim();
                if(part === vs_entry){
                    vs_func = ShaderPreprocessor.getFunctionPosIndex(unified,entry);
                    continue;
                }
                if(part === ps_entry){
                    ps_func = ShaderPreprocessor.getFunctionPosIndex(unified,entry);
                    continue;
                }
            }
        }
        //porcess lines
        let main = unified;
        let vs_main = null;
        let ps_main = null;
        if(vs_func[0] > ps_func[0]){
            [main,vs_main] = ShaderPreprocessor.Seperate(main,vs_func[0],vs_func[1]);
            [main,ps_main] = ShaderPreprocessor.Seperate(main,ps_func[0],ps_func[1]);
        }
        else{
            [main,ps_main] = ShaderPreprocessor.Seperate(main,ps_func[0],ps_func[1]);
            [main,vs_main] = ShaderPreprocessor.Seperate(main,vs_func[0],vs_func[1]);
        }
        
        let lines = main.split('\n');

        let vs_lines:string[] = [];
        let ps_lines:string[] = [];

        const pattern_varying = /^(inout|in|out)\s+[\d\w]+\s+/;
        for(let i=0,len = lines.length;i<len;i++){
            let line = lines[i].trimLeft();
            if(line == null || line ==='') continue;
            let match = line.match(pattern_varying);
            if(match!=null){
                let decorator = match[1];
                if(decorator === 'inout'){
                    line = line.substr(5);
                    vs_lines.push('out' + line);
                    ps_lines.push('in'+line);
                }
                else if(decorator === 'in'){
                    vs_lines.push(line);                    
                }
                else if(decorator === 'out'){
                    ps_lines.push(line);
                }
            }
            else{
                vs_lines.push(line);
                ps_lines.push(line);
            }
        }

        vs_main = vs_main.replace(vs_entry,'main');
        ps_main = ps_main.replace(ps_entry,'main');

        let vs_final = vs_lines.join('\n') + '\n' + vs_main;
        let ps_final = ps_lines.join('\n') + '\n' + ps_main;

        return [vs_final,ps_final];
    }

    public static getFunctionPosIndex(text:string,entry:string):[number,number]{
        let startindex = text.indexOf(entry);
        let len = entry.length + startindex;
        let subtext = text.substr(len);
        let slen = subtext.length;
        let endpos = -1;
        let t =0;
        for(let i=0;i<slen;i++){
            let c = subtext[i];
            if(c === '{'){
                t ++;
            }
            else if(c === '}'){
                t--;
                if(t == 0){
                    endpos = i;
                    break;
                }
            }

        }
        if(endpos== -1) throw new Error('invalid function');
        return [startindex,len+endpos +1];
    }

    public static Seperate(str:string,spos:number,epos:number):[string, string]{
        let f = str.substr(0,spos);
        let c = str.substr(spos,epos-spos);
        let e = str.substr(epos);
        return [f+e,c];
    }

    public static TrimEmptyLine(str:string):string{
        return str.replace(/^([\s]*)$/gm, '');
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