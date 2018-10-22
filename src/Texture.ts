import { GLContext } from "wglut";
import { GL } from "./GL";
import { ShaderFX } from "./shaderfx/ShaderFX";

export class TextureCreationDesc {
    public format: number;
    public internalformat: number;
    public mipmap: boolean = false;
    public min_filter: number;
    public mag_filter: number;
    public wrap_s: number;
    public wrap_t: number;

    public constructor(
        fmt: number,
        internalfmt: number,
        mipmap: boolean = false,
        min_filter: number = GL.LINEAR,
        mag_filter: number = GL.LINEAR,
        wrap_s: number = GL.CLAMP_TO_EDGE,
        wrap_t: number = GL.CLAMP_TO_EDGE) {
        this.format = fmt;
        this.internalformat = internalfmt;
        this.mipmap = mipmap;
        this.min_filter = min_filter;
        this.mag_filter = mag_filter;
        this.wrap_s = wrap_s;
        this.wrap_t = wrap_t;
    }
}

export class Texture {

    public static TEMP_TEXID: number;

    private m_raw: WebGLTexture;
    private m_width: number;
    private m_height: number;

    private m_desc: TextureCreationDesc;

    public get rawtexture(): WebGLTexture {
        return this.m_raw;
    }

    public get width():number{ return this.m_width;}
    public get height():number{return this.m_height;}

    public constructor(tex?: WebGLTexture, width: number = 0, heigt: number = 0, desc?: TextureCreationDesc) {
        this.m_raw = tex;
        this.m_width = width;
        this.m_height = heigt;
        this.m_desc = desc;
    }

    public static createTexture2D(width: number, height: number, desc: TextureCreationDesc, glctx: GLContext): Texture {
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

        let texture = new Texture(tex, width, height, desc);
        return texture;
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
        gl.bindTexture(gl.TEXTURE_2D, null);
        if (desc.mipmap) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }

        this.m_raw = tex;
        this.m_width = width;
        this.m_height = height;
    }

    public static crateEmptyTexture(width: number, height: number, glctx: GLContext): Texture {
        if (width < 2 || height < 2) {
            throw new Error('invalid texture size');
        }
        let gl = glctx.gl;
        let tex = gl.createTexture();
        gl.activeTexture(Texture.TEMP_TEXID);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, width, height);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.bindTexture(gl.TEXTURE_2D, null);

        return new Texture(tex, width, height);
    }

    public static createTextureSync(buffer: Uint8Array, mime: string, glctx: GLContext, callback?: (suc: boolean) => void): Texture {
        let blob = new Blob([buffer], { type: mime });
        let url = URL.createObjectURL(blob);
        var image = new Image();
        var tex = new Texture(null);
        image.onload = () => {
            let gl = glctx.gl;
            let rawtex = gl.createTexture();
            gl.activeTexture(Texture.TEMP_TEXID);
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

    public static async createTexture(buffer: Uint8Array, mime: string, glctx: GLContext): Promise<Texture> {
        return new Promise<Texture>((res, rej) => {
            var tex = Texture.createTextureSync(buffer, mime, glctx, (suc) => {
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