import { GLContext } from "./gl/GLContext";
import { GL } from "./gl/GL";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { ITexture } from "./Texture";
import { undefinedOr } from "./Utility";



export interface TextureCreationDesc {
    format?: number;
    internalformat?: number;
    mipmap?: boolean;
    min_filter?: number;
    mag_filter?: number;
    wrap_s?: number;
    wrap_t?: number;
}


export class Texture2DCreationDesc implements TextureCreationDesc {
    public format: number;
    public internalformat: number;
    public mipmap?: boolean = false;
    public min_filter?: number;
    public mag_filter?: number;
    public wrap_s?: number;
    public wrap_t?: number;

    public static get DefaultRGBA():Texture2DCreationDesc{
        let desc = new Texture2DCreationDesc();
        desc.format = GL.RGBA;
        desc.internalformat =GL.RGBA;
        desc.fillDefault();
        return desc;
    }

    public static get DefaultRGB():Texture2DCreationDesc{
        let desc = new Texture2DCreationDesc();
        desc.format = GL.RGB;
        desc.internalformat =GL.RGB;
        desc.fillDefault();
        return desc;
    }

    public fillDefault(){
        this.wrap_s = undefinedOr(this.wrap_s,GL.CLAMP_TO_EDGE);
        this.wrap_t = undefinedOr(this.wrap_t,GL.CLAMP_TO_EDGE);
        this.min_filter = undefinedOr(this.min_filter,GL.LINEAR);
        this.mag_filter = undefinedOr(this.mag_filter,GL.LINEAR);
        this.mipmap = undefinedOr(this.mipmap,false);
    }

    public clone() {
        let c = Object.create(Texture2DCreationDesc.prototype);
        for (let p in this) {
            c[p] = this[p];
        }
        return c;
    }
}

export class Texture2D implements ITexture {

    public static TEMP_TEXID: number;

    protected m_raw: WebGLTexture;
    protected m_width: number;
    protected m_height: number;
    protected m_desc: Texture2DCreationDesc;

    public getDesc():Texture2DCreationDesc{
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
        this.m_desc = desc == null ? null : desc.clone();
    }

    public release(glctx:GLContext){
        if(this.m_raw !=null){
            glctx.gl.deleteTexture(this.m_raw);
            this.m_raw = null;
        }
        return;
    }


    public static createTexture2D(width: number, height: number, desc: Texture2DCreationDesc, glctx: GLContext): Texture2D {
        let gl = glctx.gl;

        let tex = gl.createTexture();
        gl.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texStorage2D(gl.TEXTURE_2D, 1, desc.internalformat, width, height);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, desc.mag_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, desc.min_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, desc.wrap_s);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, desc.wrap_t);
        if (desc.mipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);

        let texture = new Texture2D(tex, width, height, desc);
        return texture;
    }

    public static createTexture2DImage(img:HTMLImageElement,desc:TextureCreationDesc,glctx:GLContext):Texture2D{
        const gl = glctx.gl;
        let tex = gl.createTexture();
        try {
            gl.bindTexture(gl.TEXTURE_2D, tex);
            gl.texImage2D(gl.TEXTURE_2D, 0, desc.format, desc.internalformat, gl.UNSIGNED_BYTE, img);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, desc.mag_filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, desc.min_filter);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, desc.wrap_s);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, desc.wrap_t);
            if(desc.mipmap){
                gl.generateMipmap(gl.TEXTURE_2D);
            }
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return new Texture2D(tex, img.width, img.height, desc);
        }
        catch (e) {
            gl.deleteTexture(tex);
            return null;
        }
    }

    public static loadTexture2D(url: string, glctx: GLContext, alpha: boolean = true): Promise<Texture2D> {

        return new Promise<Texture2D>((res, rej) => {
            var img = new Image();
            const gl = glctx.gl;
            img.onload = () => {
                try {
                    let desc = alpha? Texture2DCreationDesc.DefaultRGBA: Texture2DCreationDesc.DefaultRGB;
                    var tex = Texture2D.createTexture2DImage(img,desc,glctx);
                    res(new Texture2D(tex, img.width, img.height, desc));
                }
                catch (e) {
                    gl.deleteTexture(tex);
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

        let gl = glctx.gl;

        gl.deleteTexture(this.m_raw);

        let desc = this.m_desc;

        let tex = gl.createTexture();
        gl.activeTexture(ShaderFX.GL_TEXTURE_TEMP);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texStorage2D(gl.TEXTURE_2D, 1, desc.internalformat, width, height);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, desc.mag_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, desc.min_filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, desc.wrap_s);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, desc.wrap_t);
        if (desc.mipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.bindTexture(gl.TEXTURE_2D, null);

        this.m_raw = tex;
        this.m_width = width;
        this.m_height = height;
    }

    public static crateEmptyTexture(width: number, height: number, glctx: GLContext): Texture2D {
        if (width < 2 || height < 2) {
            throw new Error('invalid texture size');
        }
        let gl = glctx.gl;
        let tex = gl.createTexture();
        gl.activeTexture(Texture2D.TEMP_TEXID);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return new Texture2D(tex, width, height);
    }

    public static createTextureSync(buffer: Uint8Array, mime: string, glctx: GLContext, callback?: (suc: boolean) => void): Texture2D {
        let blob = new Blob([buffer], { type: mime });
        let url = URL.createObjectURL(blob);
        var image = new Image();
        var tex = new Texture2D(null);
        image.onload = () => {
            let gl = glctx.gl;
            let rawtex = gl.createTexture();
            gl.activeTexture(Texture2D.TEMP_TEXID);
            gl.bindTexture(gl.TEXTURE_2D, rawtex);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.bindTexture(gl.TEXTURE_2D, null);
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
