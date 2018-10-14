import {GLContext, GLUtility } from 'wglut';

export class TextureCubeMap{
    
    private m_rawTex:WebGLTexture;

    public get gltex():WebGLTexture{
        return this.m_rawTex;
    }

    private constructor(){

    }

    public release(glctx:GLContext){
        if(this.m_rawTex){
            glctx.gl.deleteTexture(this.m_rawTex);
            this.m_rawTex = null;
        }
        return;
    }

    public static async loadCubeMap(urls:string[],glctx:GLContext):Promise<TextureCubeMap>{
        if(urls == null || urls.length != 6) return null;
        return new Promise<TextureCubeMap>(async(res,rej)=>{

            let imgpromises:Promise<HTMLImageElement>[] = [];
            var imgurls = urls;
            for(var i=0;i<6;i++){
                imgpromises.push(GLUtility.loadImage(imgurls[i]));
            }

            let imgs = await Promise.all(imgpromises);
            if(imgs.length != 6){
                rej('load image failed!');
                return;
            }

            let texcube:TextureCubeMap = null;

            try{
                let gl = glctx.gl;
                let gltexcube = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_CUBE_MAP,gltexcube);
    
                for(let i=0;i<6;i++){
                    let img = imgs[i];
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X +i,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
                }
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_R,gl.CLAMP_TO_EDGE);
    
                texcube = new TextureCubeMap();
                texcube.m_rawTex = gltexcube;
            }
            catch(e){
                rej(e);
                return;
            }
            res(texcube);
        });
    }
}