import { Texture2D } from './Texture2D';
import { GLUtility } from './gl/GLUtility';
import { GLContext } from './gl/GLContext';
import { ITexture, TextureCreationDesc, TextureDescUtility } from './Texture';
import { GL } from './gl/GL';

/**
 * TEXTURE_CUBE_MAP wrapped by Texture
 */
export class TextureCubeMap implements ITexture{
    private m_raw:WebGLTexture;
    protected m_width: number;
    protected m_height: number;
    protected m_desc: TextureCreationDesc;

    public getDesc():TextureCreationDesc{
        return this.m_desc;
    }
    public getRawTexture():WebGLTexture{
        return this.m_raw;
    }

    public constructor(tex?:WebGLTexture,width:number =0,height:number = 0,desc?:TextureCreationDesc){
        this.m_raw = tex;
        this.m_width = width;
        this.m_height = height;
        this.m_desc = desc == null ? null : TextureDescUtility.clone(desc);
    }

    public release(glctx:GLContext){
        if(this.m_raw != null){
            glctx.deleteTexture(this.m_raw);
            this.m_raw = null;
        }
        return;
    }
    
    /**
     * create cubemap texture with six-faces images
     * @param imgs 
     * @param glctx 
     */
    public static loadCubeMapImage(imgs:HTMLImageElement[],glctx:GLContext):TextureCubeMap| null{
        let texcube:TextureCubeMap = null;
            try{
                let gltexcube = glctx.createTexture();
                glctx.activeTexture(Texture2D.TEMP_TEXID);
                glctx.bindTexture(GL.TEXTURE_CUBE_MAP,gltexcube);

                let imgw:number = imgs[0].width;
                let imgh:number = imgs[0].height;
                for(let i=0;i<6;i++){
                    let img = imgs[i];
                    glctx.texImage2D(GL.TEXTURE_CUBE_MAP_POSITIVE_X +i,0,GL.RGB,imgw,imgh,0,GL.RGB,GL.UNSIGNED_BYTE,img);
                }
                glctx.texParameteri(GL.TEXTURE_CUBE_MAP,GL.TEXTURE_MIN_FILTER,GL.LINEAR);
                glctx.texParameteri(GL.TEXTURE_CUBE_MAP,GL.TEXTURE_MAG_FILTER,GL.LINEAR);
                glctx.texParameteri(GL.TEXTURE_CUBE_MAP,GL.TEXTURE_WRAP_S,GL.CLAMP_TO_EDGE);
                glctx.texParameteri(GL.TEXTURE_CUBE_MAP,GL.TEXTURE_WRAP_T,GL.CLAMP_TO_EDGE);
                glctx.texParameteri(GL.TEXTURE_CUBE_MAP,GL.TEXTURE_WRAP_R,GL.CLAMP_TO_EDGE);
                glctx.bindTexture(GL.TEXTURE_CUBE_MAP,null);

                let desc:TextureCreationDesc = {
                    format: GL.RGB,
                    internalformat:GL.RGB,
                    mipmap:false,
                    min_filter : GL.LINEAR,
                    mag_filter: GL.LINEAR
                };
                texcube = new TextureCubeMap(gltexcube,imgw,imgh,desc);
                texcube.m_raw = gltexcube;
                return texcube;
            }
            catch(e){
                console.error(e);
                return null;
            }
    }

    /**
     * create cubemap texture with six-faces images
     * @param urls [Front,Back,Up,Down,Right,Left]
     * @param glctx 
     */
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
            let texcube:TextureCubeMap| null = TextureCubeMap.loadCubeMapImage(imgs,glctx);
            res(texcube);
        });
    }
}
