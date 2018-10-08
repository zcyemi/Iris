import { int } from "wglut";
import { Utility } from "../Utility";

export type IncludeIndex = {key:string,line:number};
export class ShaderVariant{
    public includes:IncludeIndex[] =[];
    public lines:string[];
    public variantName:string;
    public linked:boolean = false;
    private m_sources:string;


    public options:ShaderOptions[] = [];

    public constructor(variantName:string,source:string){
        this.variantName = variantName;
        this.process(variantName,source);
    }

    public get sources():string{
        return this.m_sources;
    }

    public link(variances:{[key:string]:ShaderVariant}){
        if(this.linked) return;
        let includes = this.includes;
        if(includes.length == 0){
            this.linked = true;
        }
        else{
            for(let i=0,len = includes.length;i<len;i++){
                let inc = includes[i];
                let lib = variances[inc.key];
                if(lib == null){
                    throw new Error(`can't find variant : [${inc.key}]`);
                }
                if(!lib.linked){
                    lib.link(variances);
                }
                if(!lib.linked){
                    throw new Error(`variance [${lib.variantName}] link: failed`);
                }
                this.lines[inc.line] = lib.sources;
            }
            this.linked = true;
        }
        this.m_sources = this.lines.join('\n');
        console.log(`link success ${this.variantName}`);
    }

    private process(variantName:string,source:string){
        source = `
        #ifndef ${variantName}
        #define ${variantName}
        ${source}
        #endif
        `;
        let lines = source.split('\n');
        for(let i=0,len = lines.length;i<len;i++){
            let line = lines[i];
            let matchInc = line.match(/#include ([\w]+)/);
            if(matchInc != null){
                this.includes.push({key:matchInc[1],line:i});
                continue;
            }

            if(line.match(/^[\s]*#options/)){
                lines[i] = this.processMultiCompileOptions(line);
            }
        }
        this.lines = lines;
    }

    private processMultiCompileOptions(line:string):string{
        let linet = line.trim();
        let options = linet.substr(8);
        let parts = options.split(' ');
        if(parts == null || parts.length == 0) throw new Error(`invalid #options ${line}`);

        let validopts:string[] = [];
        for(let i=0,len = parts.length;i<len;i++){
            let item = parts[i].trim();
            if(item == '') continue;
            validopts.push(item);
        }

        let validlen = validopts.length;

        if(validlen ==0 || validlen == 1) throw new Error(`invalid #options ${line}`);

        if(validlen == 2){
            let val = validopts[1];
            if(val != 'ON' && val != 'OFF') throw new Error(`invalid #options ${line}`);
            let opt = new ShaderOptions();
            opt.flag = validopts[0];
            opt.default = val;
            opt.values = ['ON','OFF'];
            this.options.push(opt);
            return '//'+line;
        }
        else{
            let opt = new ShaderOptions();
            opt.flag = validopts[0];
            opt.default = validopts[1];
            opt.values = validopts.splice(0,1);
            this.options.push(opt);
            return '//'+line;
        }        
    }
}

export class ShaderOptions{
    public flag:string;
    public values:string[];
    public default:string;
}

export class ShaderOptionsConfig{
    private m_hashCode:int = 0;
    private m_dirty:boolean = false;

    private m_optmap:{[flag:string]:string} = {};
    private m_options:ShaderOptions[];

    private m_compileFlags:string;

    public constructor(opts?:ShaderOptions[]){
        if(opts == null) return;

        this.m_options = opts;
        let optmap = this.m_optmap;
        for(let i=0,len = opts.length;i<len;i++){
            let opt = opts[i];
            optmap[opt.flag] = opt.default;
        }
        this.compileOptions();
    }
    
    public verifyFlag(key:string,value:string):boolean{
        let curval = this.m_optmap[key];
        if(curval == null){
            console.warn(`invalid shader option flag: [${key}]`);
            return false;
        }
        let options = this.m_options;
        for(let i=0,len = options.length;i<len;i++){
            let opt = options[i];
            if(opt.flag === key){
                if(opt.values.indexOf(value) >=0){
                    return true;
                }
                else{
                    console.warn(`invalid shader option value : [${key}: ${value}]`);
                    return false;
                }
            }
        }
    }

    public setFlag(key:string,value:string):boolean{
        let curval = this.m_optmap[key];
        if(curval == null){
            console.warn(`invalid shader option flag: [${key}]`);
            return false;
        }
        if(curval === value) return false;
        this.m_optmap[key] = value;
        this.m_dirty= true;
    }

    public get hashCode():int{
        if(this.m_dirty){
            this.compileOptions();
        }
        return this.m_hashCode;
    }

    public compileOptions(){
        this.m_dirty = false;
        let flags = '';
        let hashstr:string[] =[];
        let optmap = this.m_optmap;
        for(let key in optmap){
            let val = optmap[key];
            if(val == null) throw new Error(`shader flag is null [${key}]`);
            let hash = ` ${key}_${val}`;
            hashstr.push(hash);
            let flag = `#define ${hash}\n`;
            flags += flag;
        }
        this.m_compileFlags = flags;

        this.calculateHashCode(hashstr);
    }

    private calculateHashCode(hashstr:string[]){
        hashstr.sort();
        this.m_hashCode = Utility.Hashfnv32a(hashstr.join(' '));
    }

    public get compileFlag():string{
        if(this.m_dirty){
            this.compileOptions();
        }
        return this.m_compileFlags;
    }

    /**
     * Deep Clone
     */
    public clone():ShaderOptionsConfig{
        let optconfig = new ShaderOptionsConfig();
        optconfig.m_hashCode = this.m_hashCode;
        optconfig.m_dirty =this.m_dirty;
        optconfig.m_options = this.m_options;
        optconfig.m_compileFlags = this.m_compileFlags;
        optconfig.m_optmap = Utility.cloneMap(this.m_optmap);
        return optconfig;
    }

}