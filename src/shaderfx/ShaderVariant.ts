export type IncludeIndex = {key:string,line:number};
export class ShaderVariant{
    public includes:IncludeIndex[] =[];
    public lines:string[];
    public variantName:string;
    public linked:boolean = false;
    private m_sources:string;

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
        }
        this.lines = lines;
    }
}