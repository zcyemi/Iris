import { Texture2DCreationDesc } from "./Texture2D";
import { GLContext } from "./gl/GLContext";


export interface ITexture{
    getRawTexture():WebGLTexture;
    getDesc():Texture2DCreationDesc;
    release(glctx:GLContext);
}