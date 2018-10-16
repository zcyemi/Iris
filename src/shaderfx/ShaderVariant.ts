import { int } from "wglut";
import { Utility } from "../Utility";
import { ShaderPreprocessor } from "./ShaderPreprocessor";

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

            let pinclude = ShaderPreprocessor.processVariantInclude(line,i);
            if(pinclude !=null){
                this.includes.push(pinclude);
                continue;
            }

            let poptions = ShaderPreprocessor.processOptions(line);
            if(poptions !=null){
                lines[i] = poptions[0];
                this.options.push(poptions[1]);
                continue;
            }
        }
        this.lines = lines;
    }
}

export class ShaderOptions{
    public flag:string;
    public values:string[];
    public default:string;

    public constructor(flag?:string,val?:string){
        this.flag = flag;
        this.default = val;
    }
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

    public getFlag(key:string):string{
        return this.m_optmap[key];
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
        this.m_optmap[key] = value;
        this.m_dirty= true;
        return true;
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