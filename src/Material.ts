import { GLProgram, vec4 } from "wglut";
import { Shader, ShaderTags } from "./shaderfx/Shader";
import { ShaderOptionsConfig } from "./shaderfx/ShaderVariant";
import { Utility } from "./Utility";

type MaterialProperty = {type:number,value:any}

export class MaterialPorpertyBlock{
    public uniforms:{[key:string]:MaterialProperty};
    private m_program:GLProgram;

    public constructor(program?:GLProgram){
        if(program == null) return;
        let selfu =this.uniforms;
        if(selfu == null){
            selfu = {}
            this.uniforms = selfu;
        }
        this.setProgram(program);
    }
    
    public setProgram(program:GLProgram){
        if(program == this.m_program) return;

        if(this.m_program == null){
            let uinfo = program.UniformsInfo;
            let selfu =this.uniforms;
            for(let uname in uinfo){
                let info = uinfo[uname];
                selfu[uname] = {type:info.type,value:null};
            }
            this.m_program = program;
            return;
        }

        this.m_program = program;
        let uinfo = program.UniformsInfo;
        let selfu = this.uniforms;
        for(var key in selfu){
            if(uinfo[key] == null){
                delete selfu[key];
            }
        }
        for(var key in uinfo){
            let u = selfu[key];
            let up = uinfo[key];
            if(u == null){
                selfu[key] = {type:up.type,value:null};
            }
            else{
                if(u.type != up.type){
                    u.type = up.type;
                    u.value = null;
                }
            }
        }
    }

    public clone():MaterialPorpertyBlock{
        let block =new MaterialPorpertyBlock(null);
        block.m_program = this.m_program;
        block.uniforms = Utility.cloneMap(this.uniforms,(p:MaterialProperty)=>{
            return {type:p.type,value:p.value};
        });
        return block;
    }

    public getUniform(name:string): MaterialProperty{
        return this.uniforms[name];
    }

    public release(){
        this.m_program = null;
        this.uniforms = null;
    }
}

export class Material{
    private m_program:GLProgram;
    private m_shader:Shader;
    private m_propertyBlock:MaterialPorpertyBlock;
    private m_optConfig:ShaderOptionsConfig;
    private m_useVariants:boolean =false;

    public get program():GLProgram{
        if(this.m_program == null){
            let newprogram = this.m_shader.getVariantProgram(this.m_optConfig);
            this.m_propertyBlock.setProgram(newprogram);
            this.m_program = newprogram;
        }
        return this.m_program;
    }
    public get shaderTags():ShaderTags{
        return this.m_shader.tags;
    }

    public get propertyBlock():MaterialPorpertyBlock{
        return this.m_propertyBlock;
    }

    public constructor(shader?:Shader){
        if(shader == null){
            return;
        }
        this.m_shader = shader;
        this.m_program = shader.defaultProgram;
        this.m_optConfig = shader.m_defaultOptionsConfig;
        this.m_propertyBlock =new MaterialPorpertyBlock(this.m_program);
    }

    public clone():Material{
        let mat = new Material();
        mat.m_shader = this.m_shader;
        mat.m_program = this.program;
        mat.m_propertyBlock = this.m_propertyBlock.clone();
        mat.m_useVariants = this.m_useVariants;
        mat.m_optConfig = this.m_optConfig.clone();
        return mat;
    }

    public setColor(name:string,color:vec4){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = color;
    }

    public setTexture(name:string,tex:WebGLTexture){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = tex;
    }

    public setFlag(key:string,value:string){
        let defOptCfg = this.m_shader.m_defaultOptionsConfig;
        let verified = this.m_shader.m_defaultOptionsConfig.verifyFlag(key,value);
        if(!verified) return;
        if(!this.m_useVariants){
            this.m_optConfig = defOptCfg.clone();
        }
        if(this.m_optConfig.setFlag(key,value)){
            this.m_program = null;
            this.m_useVariants = true;
        }
    }

    public apply(gl:WebGL2RenderingContext){
        let program = this.program;
        let pu = this.m_propertyBlock.uniforms;
        for(var key in pu){
            let u = pu[key];
            this.setUniform(gl,program.Uniforms[key],u.type,u.value);
        }
    }
    

    /**
     * TODO clean apply process
     * especially for binded texture
     * @param gl 
     */
    public clean(gl:WebGL2RenderingContext){
        // let pu = this.m_propertyBlock.uniforms;
        // for(let i=0,len = pu.length;i<len;i++){
        //     let u = pu[i];

        //     let loc = this.program.Uniforms[u.key];
        //     let type = u.type;
        //     if(type == gl.SAMPLER_2D){
        //         //gl.bindTexture(gl.TEXTURE,null);
        //     }
        // }
    }

    private setUniform(gl:WebGL2RenderingContext,loc:WebGLUniformLocation,type:number,val:any){
        if(val == null) return;
        switch(type){
            case gl.FLOAT_VEC4:
                gl.uniform4fv(loc,val.raw);
                break;
            case gl.SAMPLER_2D:
                if(val != null){
                    gl.activeTexture(gl.TEXTURE2);
                    gl.bindTexture(gl.TEXTURE_2D,val);
                    gl.uniform1i(loc,2);
                }
                else{
                    //texture is null
                    //TODO bind internal texture
                }
                break;
        }
    }
}
