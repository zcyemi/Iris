import { GLProgram, vec4 } from "wglut";
import { Shader, ShaderTags } from "./shaderfx/Shader";
import { ShaderOptionsConfig } from "./shaderfx/ShaderVariant";

type MaterialProperty = {key:string,type:number,value:any}

export class MaterialPorpertyBlock{
    public uniforms:MaterialProperty[] = [];

    public constructor(program:GLProgram){
        let uinfo = program.UniformsInfo;
        let selfu =this.uniforms;
        for(let uname in uinfo){
            let info = uinfo[uname];
            selfu.push({
                key:uname,
                type:info.type,
                value:null
            });
        }
    }

    public getUniform(name:string): MaterialProperty{
        let us = this.uniforms;
        for(let i=0,len=us.length;i<len;i++){
            let u = us[i];
            if(u.key == name) return u;
        }
        return null;
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
            this.m_program = this.m_shader.getVariantProgram(this.m_optConfig);
        }
        return this.m_program;
    }
    public get shaderTags():ShaderTags{
        return this.m_shader.tags;
    }

    public get propertyBlock():MaterialPorpertyBlock{
        return this.m_propertyBlock;
    }

    public constructor(shader:Shader){
        if(shader == null){
            throw new Error('shader is null!');
        }
        this.m_shader = shader;
        this.m_program = shader.defaultProgram;
        this.m_optConfig = shader.defaultOptionsConfig;
        this.m_propertyBlock =new MaterialPorpertyBlock(this.m_program);
    }

    public clone():Material{
        let mat = new Material(this.m_shader);
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
        let defOptCfg = this.m_shader.defaultOptionsConfig;
        let verified = this.m_shader.defaultOptionsConfig.verifyFlag(key,value);
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
        let pu = this.m_propertyBlock.uniforms;
        for(let i=0,len = pu.length;i<len;i++){
            let u = pu[i];
            this.setUniform(gl,this.program.Uniforms[u.key],u.type,u.value);
        }
    }
    

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
