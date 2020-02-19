import { vec4, vec3, mat4 } from "../math/GLMath";
import { Utility } from "./Utility";
import { Texture2D } from "./Texture2D";
import { GLProgram } from "../gl/GLProgram";
import { TextureSampler } from "./TextureSampler";
import { GL } from "../gl/GL";
import { ITexture } from "./Texture";
import { GLContext } from "../gl/GLContext";
import { Shader } from "./Shader";
import { ShaderTags, AttrSemantic, UniformSemantic } from "./ShaderFX";
import { GraphicsObj } from "./IGraphicObj";

export type MaterialProperty = {type:number,value:any,extra?:TextureSampler};

export class MaterialPorpertyBlock{
    public uniforms:{[key:string]:MaterialProperty};
    /** default is null, perperty might be set with @function <setUniformBlock> or @function <setUniformBlockwitName> */
    public uniformsBlock:{[slot:number]:number};
    private m_program:GLProgram;

    private m_uniformMainTex:MaterialProperty;
    private m_uniformMainColor:MaterialProperty;

    public constructor(program?:GLProgram){
        if(program == null) return;
        if(this.uniforms == null){
            this.uniforms = {};
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
            this.updateSemantic(program);
            this.m_program = program;
            return;
        }
        
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
                    //TODO this can be optimized by checking if old value is compatible with new uniform type.
                    //(e.g., Texture object wrap with TEXTURE_CUBE and TEXTURE_2D)
                }
            }
        }

        //sync uniformblocks
        let selfprogrm = this.m_program;
        let selfBlock = this.uniformsBlock;
        let uniformBlock = program.UniformBlock;
        let newblocks = null;
        if(selfBlock != null){
            for(let slot in selfBlock){
                let slotindex = selfBlock[slot];
                let blockname = Material.programGetUniformBlockName(selfprogrm,slotindex);
                if(blockname == null) continue;
                let newindex = uniformBlock[blockname];
                if(newindex == null) continue;
                delete selfBlock[slot];
                selfBlock[newindex] = slotindex;
            }
        }

        for(let bname in uniformBlock){
            //TODO
            // if(ShaderFX.isInternalUniformBlockName(bname)) continue;

            let info = selfprogrm.UniformBlock[bname];
            if(info != null){
                newblocks[uniformBlock[bname]] = selfBlock[info];
            }
            else{
                newblocks[uniformBlock[bname]] = null;
            }
        }
        this.uniformsBlock = newblocks;


        this.updateSemantic(program);
        

        //sync program
        this.m_program = program;
    }


    private updateSemantic(program:GLProgram){
        // //semantic
        let uniformSemantic = program.UniformSemantic;
        let main_tex = uniformSemantic['MAIN_TEXTURE'];
        if (main_tex){
            this.m_uniformMainTex = this.uniforms[main_tex];
        }
        let main_color = uniformSemantic['MAIN_COLOR'];
        if (main_color) this.m_uniformMainColor = this.uniforms[main_color];

    }

    public clone():MaterialPorpertyBlock{
        let block =new MaterialPorpertyBlock(null);
        block.m_program = this.m_program;
        block.uniforms = Utility.cloneMap(this.uniforms,(p:MaterialProperty)=>{
            return {
                type:p.type,
                value:p.value,
                extra:p.extra};
        });
        return block;
    }

    public getUniform(name:string): MaterialProperty{
        return this.uniforms[name];
    }

    public getUniformMainTexture():MaterialProperty{
        this.updateSemantic(this.m_program);
        return this.m_uniformMainTex;
    }

    public getUniformMainColor():MaterialProperty{
        return this.m_uniformMainColor;
    }

    public release(){
        this.m_program = null;
        this.uniforms = null;
    }
}

export class Material extends GraphicsObj{
    private m_program:GLProgram;
    private m_shader:Shader;
    private m_propertyBlock:MaterialPorpertyBlock;
    private m_useVariants:boolean =false;

    public name:string;

    private m_shadertags:ShaderTags = null;

    public get isValid():boolean{
        return this.m_shader !=null;
    }

    public verify():Material{
        if(!this.isValid) throw new Error("material invalid");
        return this;
    }

    public static DEF_TEXID_NUM:number = 3;

    public get program():GLProgram{
        if(this.m_program == null){
            let newprogram = this.m_shader.compile();
            this.m_propertyBlock.setProgram(newprogram);
            this.m_program = newprogram;
        }
        return this.m_program;
    }
    public get shaderTags():ShaderTags{
        //TODO
        // if(this.m_shadertags == null) return this.m_shader.tags;
        return this.m_shadertags;
    }
    public set shaderTags(tags:ShaderTags){
        this.m_shadertags = tags;
    }
    public get propertyBlock():MaterialPorpertyBlock{
        return this.m_propertyBlock;
    }
    public setShader(shader:Shader){
        this.m_shader = shader;
        this.m_program = null;
        this.m_useVariants = false;
    }

    public constructor(shader?:Shader){
        super();
        if(shader == null){
            return;
        }
        this.m_shader = shader;
        this.m_program = shader.compile();

        this.m_propertyBlock =new MaterialPorpertyBlock(this.m_program);
    }

    public release(){
        this.m_program = null;
        this.m_shader = null;
        this.m_propertyBlock = null;
        this.m_useVariants = false;
    }

    public clone():Material{
        let mat = new Material();
        mat.m_shader = this.m_shader;
        mat.m_program = this.program;
        mat.m_propertyBlock = this.m_propertyBlock.clone();
        mat.m_useVariants = this.m_useVariants;
        return mat;
    }

    public setColor(name:string,color:vec4){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = color;
    }

    public setTexture(name:string,tex:WebGLTexture | ITexture){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = tex;
    }

    public setMainTexture(tex:WebGLTexture|ITexture){
        let p = this.m_propertyBlock.getUniformMainTexture();
        if(p == null){
            throw new Error(`can not find uniform MAIN_TEXTURE ${this.program.name}`);
            return;
        }
        p.value = tex;   
    }

    public setMainColor(color:vec4){
        let p = this.m_propertyBlock.getUniformMainColor();
        if(p == null){
            throw new Error(`can not find uniform MAIN_COLOR ${this.program.name}`);
        }
        p.value = color;
    }

    public setSampler(name:string,texsampler?:TextureSampler){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null)return;
        let ptype = p.type;

        if( ptype != GL.SAMPLER_2D &&
            ptype != GL.SAMPLER_2D_SHADOW && 
            ptype != GL.SAMPLER_3D && 
            ptype != GL.SAMPLER_2D_ARRAY &&
            ptype != GL.SAMPLER_2D_ARRAY_SHADOW &&
            ptype != GL.SAMPLER_CUBE_SHADOW){
                return;
        }
        p.extra = texsampler;
    }

    public setFloat(name:string,val:number){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = val;
    }

    public setVec2(name:string,valx:number,valy:number){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = [valx,valy];
    }

    public setVec3(name:string,val:vec3){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = val.clone();
    }

    public setVec4(name:string,val:vec4){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = val;
    }

    public setMat4(name:string,val:mat4){
        let p = this.m_propertyBlock.getUniform(name);
        if(p == null) return;
        p.value = val;
    }

    /**
     * Set uniform block binding
     * @param name 
     * @param index 
     */
    public setUniformBlockwitName(name:string,index:number){
        let u = this.m_program.UniformBlock[name];
        if(u == null) return;

        let propertyblock = this.m_propertyBlock;
        let uniformblock = propertyblock.uniformsBlock
        if(uniformblock == null){
            uniformblock = {};
            propertyblock.uniformsBlock = uniformblock;
        }
        uniformblock[u] = index;
    }

    /**
     * Set uniform block binding
     * @param bufferindex shader uniform index, this value can be queried by @function <getUniformBlockIndex>
     * @param index uniform buffer binded index
     */
    public setUniformBlock(bufferindex:number,index:number){
        const propertyblock = this.propertyBlock;
        let uniformblock = propertyblock.uniformsBlock;
        if(uniformblock == null){
            uniformblock = {};
            propertyblock.uniformsBlock = uniformblock;
        }
        uniformblock[bufferindex] = index;
    }

    /**
     * Query the uniform blocksindex in current shader program
     * @param name 
     */
    public getUniformBlockIndex(name:string):number{
        return this.m_program.UniformBlock[name];
    }

    /**
     * 
     * @param slotindex 
     */
    public getUniformBlockName(slotindex:number):string{
        return Material.programGetUniformBlockName(this.program,slotindex);
    }

    /**
     * Query the uniform block name with uniform block slot index.
     * @todo merge this function to class ShaderProgram
     * @param program 
     * @param slotindex 
     */
    public static programGetUniformBlockName(program:GLProgram,slotindex:number):string{
        let blocks = program.UniformBlock;
        for(let key in blocks){
            if(blocks[key] == slotindex) return key;
        }
    }

    /**
     * SetFlag will not switch to new program immediately,
     * setUniform parameters must be called after @property {program} refreshed.
     * @param key 
     * @param value 
     * @param refresh
     */
    public setFlag(key:string,value:string,refresh:boolean = false){
        //TODO
        // let defOptCfg = this.m_shader.m_defaultOptionsConfig;
        // let verified = this.m_shader.m_defaultOptionsConfig.verifyFlag(key,value);
        // if(!verified){
        //     console.warn(`set shader flag verify failed: ${key}:${value}`);
        //     return;
        // }
        // if(!this.m_useVariants){
        //     this.m_optConfig = defOptCfg.clone();
        // }
        // if(this.m_optConfig.setFlag(key,value)){
        //     this.m_program = null;
        //     this.m_useVariants = true;
        // }
        // else{
        //     console.warn("set shader flag: value not changed");
        // }

        // if(refresh) this.refreshProgram();
    }

    /**
     * refresh program after @function <setFlag> called.
     */
    public refreshProgram():GLProgram{
        return this.program;
    }

    // public setFlagNoVerify(options:ShaderOptions){
    //     let useVariants = this.m_useVariants;

    //     let cfg = useVariants? this.m_optConfig : this.m_shader.m_defaultOptionsConfig;
    //     let val = cfg.getFlag(options.flag);
    //     if(val == null) return;
    //     if(val == options.default) return;
        
    //     if(!useVariants){
    //         this.m_optConfig = cfg.clone();
    //         this.m_useVariants = true;
    //     }
    //     this.m_optConfig.setFlag(options.flag,options.default);
    //     this.m_program = null;
    // }


    // public getFlag(key:string):string{
    //     let optCfg = this.m_useVariants ? this.m_shader.m_defaultOptionsConfig : this.m_optConfig;
    //     return optCfg.getFlag(key);
    // }
    
    private m_applyTexCount = 0;

    public apply(glctx:GLContext){
        this.m_applyTexCount = 0;
        let program = this.program;

        let propertyblock = this.m_propertyBlock;
        let pu = propertyblock.uniforms;
        for(var key in pu){
            let u = pu[key];
            if(key === "uShadowMap"){
                //TODO
                // glctx.uniform1i(program.Uniforms[key],ShaderFX.GL_SHADOWMAP_TEX0_ID);
            }
            else{
                this.setUniform(glctx,program.Uniforms[key],u);
            }
        }

        // let puniformblocks = propertyblock.uniformsBlock;
        // if(puniformblocks != null){
        //     const glp = program.Program;
        //     for(var key in puniformblocks){
        //         let ind = Number(key);
        //         glctx.uniformBlockBinding(glp,ind,puniformblocks[ind]);
        //     }
        // }
    }
    
    /**
     * TODO clean apply process
     * especially for binded texture
     * @param gl 
     */
    public clean(glctx:GLContext){
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

    private setUniform(glctx:GLContext,loc:WebGLUniformLocation,mp:MaterialProperty){

        const val = mp.value;
        const type = mp.type;

        if(val == null && type != GL.SAMPLER_2D) return;
        switch(type){
            case GL.FLOAT_MAT4:
                glctx.uniformMatrix4fv(loc,false,val.raw);
                break;
            case GL.FLOAT:
                glctx.uniform1f(loc,val);
                break;
            case GL.FLOAT_VEC2:
                glctx.uniform2fv(loc,val);
                break;
            case GL.FLOAT_VEC3:
                glctx.uniform3fv(loc,val.raw);
                break;
            case GL.FLOAT_VEC4:
                glctx.uniform4fv(loc,val.raw);
                break;
            case GL.SAMPLER_CUBE:
                if(val != null){
                    let texCount = this.m_applyTexCount;
                    let tex:WebGLTexture = null;
                    if(val.getRawTexture != undefined){
                        tex = val.getRawTexture();
                    }
                    else if(val instanceof WebGLTexture){
                        tex= val;
                    }
                    if(tex == null){
                        //raw texture is null or onloading...
                        //TODO no internal texture_cube_map_support
                        //gl.uniform1i(loc,Material.DEF_TEXID_NUM);
                        return;
                    }
                    glctx.activeTexture(GL.TEXTURE4 + texCount);
                    glctx.bindTexture(GL.TEXTURE_CUBE_MAP,tex);
                    const locid = 4 + texCount;
                    glctx.uniform1i(loc,locid);
                    this.m_applyTexCount = texCount+1;
                    const extra = mp.extra;
                    if(extra != null){
                        glctx.bindSampler(locid,extra.rawobj);
                    }
                }
                else{
                    //texture is null
                    //use default white texture
                    //TODO no internal texture_cube_map_support
                    //gl.uniform1i(loc,Material.DEF_TEXID_NUM);
                }
                break;
            case GL.SAMPLER_2D:
                if(val != null){
                    let texCount = this.m_applyTexCount;
                    let tex:WebGLTexture = null;
                    if(val instanceof Texture2D){
                        tex = val.getRawTexture();
                    }
                    else if(val instanceof WebGLTexture){
                        tex= val;
                    }
                    if(tex == null){
                        //raw texture is null or onloading...
                        glctx.uniform1i(loc,Material.DEF_TEXID_NUM);
                        return;
                    }
                    glctx.activeTexture(GL.TEXTURE4 + texCount);
                    glctx.bindTexture(GL.TEXTURE_2D,tex);
                    const locid = 4 + texCount;
                    glctx.uniform1i(loc,locid);
                    this.m_applyTexCount = texCount+1;
                    const extra = mp.extra;
                    if(extra != null){
                        glctx.bindSampler(locid,extra.rawobj);
                    }
                }
                else{
                    //texture is null
                    //use default white texture
                    glctx.uniform1i(loc,Material.DEF_TEXID_NUM);
                }
                break;
        }
    }
}
