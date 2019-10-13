import { GLContext } from "../gl/GLContext";
import { ITexture, TextureCreationDesc, TextureDescUtility } from "./Texture";
import { GL } from "../gl/GL";
import { ShaderFX } from "./ShaderFX";

export class Texture2D implements ITexture {
    public static TEMP_TEXID: number;

    protected m_raw: WebGLTexture;
    protected m_width: number;
    protected m_height: number;
    protected m_desc: TextureCreationDesc;

    public getDesc():TextureCreationDesc{
        return this.m_desc;
    }

    public getRawTexture(): WebGLTexture {
        return this.m_raw;
    }

    public get width(): number { return this.m_width; }
    public get height(): number { return this.m_height; }

    public constructor(tex?: WebGLTexture, width: number = 0, heigt: number = 0, desc?: TextureCreationDesc) {
        this.m_raw = tex;
        this.m_width = width;
        this.m_height = heigt;
        this.m_desc = desc == null ? null : TextureDescUtility.clone(desc);
    }

    public release(glctx:GLContext){
        if(this.m_raw !=null){
            glctx.deleteTexture(this.m_raw);
            this.m_raw = null;
        }
        return;
    }

    public static createTexture2D(width: number, height: number, desc: TextureCreationDesc, glctx: GLContext): Texture2D {
        TextureDescUtility.fillDefault(desc);
        let tex = glctx.createTexture();
        glctx.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
        glctx.bindTexture(GL.TEXTURE_2D, tex);
        glctx.texStorage2D(GL.TEXTURE_2D, 1, desc.internalformat, width, height);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, desc.mag_filter);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, desc.min_filter);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, desc.wrap_s);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, desc.wrap_t);
        if(desc.compare_mode != null){
            glctx.texParameteri(GL.TEXTURE_2D,GL.TEXTURE_COMPARE_MODE,desc.compare_mode);
        }
        if (desc.mipmap) {
            glctx.generateMipmap(GL.TEXTURE_2D);
        }
        glctx.bindTexture(GL.TEXTURE_2D, null);
        let texture = new Texture2D(tex, width, height, desc);
        return texture;
    }

    public static createTexture2DImage(img:HTMLImageElement,desc:TextureCreationDesc,glctx:GLContext):Texture2D{
        let tex = glctx.createTexture();

        TextureDescUtility.fillDefault(desc);

        try {
            glctx.bindTexture(GL.TEXTURE_2D, tex);
            glctx.texImage2D(GL.TEXTURE_2D, 0,desc.internalformat,img.width,img.height,0,desc.format, GL.UNSIGNED_BYTE, img);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, desc.mag_filter);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, desc.min_filter);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, desc.wrap_s);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, desc.wrap_t);
            if(desc.mipmap){
                glctx.generateMipmap(GL.TEXTURE_2D);
            }
            glctx.generateMipmap(GL.TEXTURE_2D);
            glctx.bindTexture(GL.TEXTURE_2D, null);
            return new Texture2D(tex, img.width, img.height, desc);
        }
        catch (e) {
            glctx.deleteTexture(tex);
            return null;
        }
    }

    public static loadTexture2D(url: string, glctx: GLContext, alpha: boolean = true): Promise<Texture2D> {
        return new Promise<Texture2D>((res, rej) => {
            var img = new Image();
            img.onload = () => {
                try {
                    let desc = alpha? TextureDescUtility.DefaultRGBA: TextureDescUtility.DefaultRGB;
                    var tex = Texture2D.createTexture2DImage(img,desc,glctx);
                    res(new Texture2D(tex, img.width, img.height, desc));
                }
                catch (e) {
                    glctx.deleteTexture(tex);
                    rej(e);
                }

            };
            img.onerror = (ev: Event | string) => {
                rej(ev);
            }
            img.src = url;
        });
    }

    public resize(width: number, height: number, glctx: GLContext) {
        if (width == this.m_width && height == this.m_height) return;

        glctx.deleteTexture(this.m_raw);

        let desc = this.m_desc;

        let tex = glctx.createTexture();
        glctx.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
        glctx.bindTexture(GL.TEXTURE_2D, tex);
        glctx.texStorage2D(GL.TEXTURE_2D, 1, desc.internalformat, width, height);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, desc.mag_filter);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, desc.min_filter);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, desc.wrap_s);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, desc.wrap_t);
        if (desc.mipmap) {
            glctx.generateMipmap(GL.TEXTURE_2D);
        }
        glctx.bindTexture(GL.TEXTURE_2D, null);

        this.m_raw = tex;
        this.m_width = width;
        this.m_height = height;
    }

    public static crateEmptyTexture(width: number, height: number, glctx: GLContext): Texture2D {
        if (width < 2 || height < 2) {
            throw new Error('invalid texture size');
        }
        let tex = glctx.createTexture();
        glctx.activeTexture(Texture2D.TEMP_TEXID);
        glctx.bindTexture(GL.TEXTURE_2D, tex);
        glctx.texStorage2D(GL.TEXTURE_2D, 1, GL.RGBA8, width, height);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
        glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
        glctx.bindTexture(GL.TEXTURE_2D, null);

        return new Texture2D(tex, width, height);
    }

    public static createTextureSync(buffer: Uint8Array, mime: string, glctx: GLContext, callback?: (suc: boolean) => void): Texture2D {
        let blob = new Blob([buffer], { type: mime });
        let url = URL.createObjectURL(blob);
        var image = new Image();
        var tex = new Texture2D(null);
        image.onload = () => {
            let rawtex = glctx.createTexture();
            glctx.activeTexture(Texture2D.TEMP_TEXID);
            glctx.bindTexture(GL.TEXTURE_2D, rawtex);
            glctx.texImage2D(GL.TEXTURE_2D, 0, GL.RGB, image.width, image.height, 0, GL.RGB, GL.UNSIGNED_BYTE, image);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MIN_FILTER, GL.LINEAR);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_MAG_FILTER, GL.LINEAR);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_S, GL.CLAMP_TO_EDGE);
            glctx.texParameteri(GL.TEXTURE_2D, GL.TEXTURE_WRAP_T, GL.CLAMP_TO_EDGE);
            glctx.generateMipmap(GL.TEXTURE_2D);
            glctx.bindTexture(GL.TEXTURE_2D, null);
            tex.m_width = image.width;
            tex.m_height = image.height;
            tex.m_raw = rawtex;

            if (callback != null) callback(true);
        }
        image.onerror = (ev) => {
            console.error(ev);
            if (callback != null) callback(false);
        }
        image.src = url;
        return tex;
    }

    public static async createTexture(buffer: Uint8Array, mime: string, glctx: GLContext): Promise<Texture2D> {
        return new Promise<Texture2D>((res, rej) => {
            var tex = Texture2D.createTextureSync(buffer, mime, glctx, (suc) => {
                if (suc) {
                    res(tex);
                }
                else {
                    rej('failed');
                }
            })
        })
    }
}
