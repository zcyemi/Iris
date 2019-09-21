import { Texture2D } from "../core/Texture2D";

type OnFrameFunc = (t:number)=>void;

export class GLUtility{


    private static s_animationFrameRegisted:boolean = false;

    private static s_animationFrameFunc:OnFrameFunc[]= [];



    public static registerOnFrame(f:OnFrameFunc){
        if(!GLUtility.s_animationFrameRegisted){
            window.requestAnimationFrame(GLUtility.onAnimationFrame);
            GLUtility.s_animationFrameRegisted = true;
        }

        GLUtility.s_animationFrameFunc.push(f);
    }

    public static removeOnFrame(f:OnFrameFunc){
        let func = GLUtility.s_animationFrameFunc;
        let index = func.indexOf(f);
        if(index >=0 ){
            GLUtility.s_animationFrameFunc = func.splice(index,1);
        }
    }

    private static s_lastTime:number = 0;
    private static s_targetFPS:number = 60;
    private static s_frameInterval:number = 1000 / 60.0;

    public static setTargetFPS(fps:number){
        GLUtility.s_targetFPS = fps;
        GLUtility.s_frameInterval = 1000.0 / fps;
    }

    private static onAnimationFrame(t:number){

        let interval = GLUtility.s_frameInterval;

        let elapsed =  t- GLUtility.s_lastTime;

        if(elapsed >= interval){
            GLUtility.s_lastTime = t - elapsed % interval;
            let func = GLUtility.s_animationFrameFunc;
            for(let i=0,len= func.length;i<len;i++){
                func[i](t);
            }
        }
        window.requestAnimationFrame(GLUtility.onAnimationFrame);
    }

    public static async HttpGet(url:string,type:XMLHttpRequestResponseType):Promise<any>{
        return new Promise<any>((res,rej)=>{
            let xhr = new XMLHttpRequest();
            xhr.responseType = type;
            xhr.onload = evt=>{
                if(type == "blob" || type == "arraybuffer"){
                    res(xhr.response);
                }
                else{
                    res(xhr.responseText);
                }
            }
            xhr.onerror = evt=>{
                rej(evt.target);
            }
            xhr.open("GET",url,true);
            xhr.send();
        })
    }

    public static async loadImage(url:string):Promise<HTMLImageElement>{
        if(url == null) return null;
        return new Promise<HTMLImageElement>((res,rej)=>{
            var img =new Image();
            img.onload = ()=>{
                res(img);
            }
            img.onerror = ()=>{
                rej('image load failed');
            };
            img.src = url;
        });
    }


    public static saveTextureToImage(gl:WebGL2RenderingContext,texture:Texture2D,tempframebfufer:WebGLFramebuffer):HTMLImageElement{
        if (texture == null || tempframebfufer == null) return null;

        let curfb = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        let curtex = gl.getParameter(gl.TEXTURE_BINDING_2D);

        gl.bindFramebuffer(gl.FRAMEBUFFER, tempframebfufer);
        
        let rawtex = texture.getRawTexture();
        gl.bindTexture(gl.TEXTURE_2D, rawtex);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, rawtex, 0);

        let image = GLUtility.saveFrameBufferToImage(texture.width,texture.height,gl,tempframebfufer);

        gl.bindTexture(gl.TEXTURE_2D, curtex);
        gl.bindFramebuffer(gl.FRAMEBUFFER, curfb);

        return image;
    }

    public static saveFrameBufferToImageData(width:number,height:number,gl:WebGL2RenderingContext,targetframebuffer:WebGLFramebuffer):string{
        let w = width;
        let h = height;
        let data = new Uint8Array(w * h * 4);
        gl.readPixels(0,0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, data);

        let tempcanvas = document.createElement('canvas');
        tempcanvas.width = w;
        tempcanvas.height = h;

        var ctx2d = <CanvasRenderingContext2D>tempcanvas.getContext('2d');
        var imgdata = ctx2d.createImageData(w, h);
        imgdata.data.set(data);
        ctx2d.putImageData(imgdata, 0, 0);

        return tempcanvas.toDataURL();
    }

    public static saveFrameBufferToImage(width:number,height:number,gl:WebGL2RenderingContext,targetframebuffer:WebGLFramebuffer):HTMLImageElement{
        let image = new Image();
        image.src = GLUtility.saveFrameBufferToImageData(width,height,gl,targetframebuffer);
        return image;
    }
}
