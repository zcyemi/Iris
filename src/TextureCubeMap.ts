import { Texture2D } from './Texture2D';
import { GLUtility } from './gl/GLUtility';
import { GLContext } from './gl/GLContext';
import { ITexture, TextureCreationDesc, TextureDescUtility } from './Texture';

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
            glctx.gl.deleteTexture(this.m_raw);
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
                let gl = glctx.gl;
                let gltexcube = gl.createTexture();
                gl.activeTexture(Texture2D.TEMP_TEXID);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP,gltexcube);

                let imgw:number = imgs[0].width;
                let imgh:number = imgs[0].height;
                for(let i=0;i<6;i++){
                    let img = imgs[i];
                    gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X +i,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,img);
                }
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_CUBE_MAP,gl.TEXTURE_WRAP_R,gl.CLAMP_TO_EDGE);
                gl.bindTexture(gl.TEXTURE_CUBE_MAP,null);

                let desc:TextureCreationDesc = {
                    format: gl.RGB,
                    internalformat:gl.RGB,
                    mipmap:false,
                    min_filter : gl.LINEAR,
                    mag_filter: gl.LINEAR
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
