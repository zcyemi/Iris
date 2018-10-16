import { GLContext } from "wglut";


export class Texture{

    private m_raw:WebGLTexture;
    private m_width:number;
    private m_height:number;

    public get rawtexture():WebGLTexture{
        return this.m_raw;
    }

    public constructor(tex:WebGLTexture,width:number,heigt:number){
        this.m_raw = tex;
        this.m_width = width;
        this.m_height = heigt;
    }

    public static async createTexture(buffer:Uint8Array,mime:string,glctx:GLContext):Promise<Texture>{
        return new Promise<Texture>((res,rej)=>{
            let blob = new Blob([buffer],{type:mime});
            let url = URL.createObjectURL(blob);
            var image = new Image();
            image.onload = ()=>{
                let gl = glctx.gl;
                let rawtex = gl.createTexture();
                gl.bindTexture(gl.TEXTURE_2D,rawtex);
                gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);
                gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
                gl.generateMipmap(gl.TEXTURE_2D);
                gl.bindTexture(gl.TEXTURE_2D,null);
                let texture = new Texture(rawtex,image.width,image.height);
                res(texture);
            }
            image.onerror = (ev)=>{
                console.error(ev);
                rej(ev);
            }
            image.src = url;
        })
    }
}