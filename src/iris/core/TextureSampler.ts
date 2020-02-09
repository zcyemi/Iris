
export interface TextureSamplerCreationDesc{
    CompareFunc?: number;
    CompareMode?:number;
    MagFilter?:number;
    MinFileter?:number;
    WrapR?:number;
    WrapS?:number;
    WrapT?:number;
}

export class TextureSampler{

    private m_rawobj:WebGLSampler;
    public get rawobj():WebGLSampler{ return this.m_rawobj;}

    private constructor (){
    }

    public static create(gl:WebGL2RenderingContext,desc?:TextureSamplerCreationDesc):TextureSampler{

        desc = desc || {};
        let texsampler = new TextureSampler();
        
        let sampler = gl.createSampler();
        if(desc.CompareFunc != null) gl.samplerParameteri(sampler,gl.TEXTURE_COMPARE_FUNC,desc.CompareFunc);
        if(desc.CompareMode != null) gl.samplerParameteri(sampler,gl.TEXTURE_COMPARE_MODE,desc.CompareMode);
        if(desc.MagFilter != null) gl.samplerParameteri(sampler,gl.TEXTURE_MAG_FILTER,desc.MagFilter);
        if(desc.MinFileter != null) gl.samplerParameteri(sampler,gl.TEXTURE_MIN_FILTER,desc.MinFileter);
        if(desc.WrapR != null) gl.samplerParameteri(sampler,gl.TEXTURE_WRAP_R,desc.WrapR);
        if(desc.WrapS != null) gl.samplerParameteri(sampler,gl.TEXTURE_WRAP_S,desc.WrapS);
        if(desc.WrapT != null) gl.samplerParameteri(sampler,gl.TEXTURE_WRAP_T,desc.WrapT);

        texsampler.m_rawobj = sampler;
        
        return texsampler;
    }

    public release(gl:WebGL2RenderingContext){
        if(this.m_rawobj != null){
            gl.deleteSampler(this.m_rawobj);
        }
        this.m_rawobj = null;
    }

    

}
