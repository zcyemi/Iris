import { CommandBuffer } from "./CommandBuffer";
import { ITexture } from "./Texture";



export class Graphics {
    
    private static cmdbuffer:CommandBuffer = new CommandBuffer('internal graphics');

    private static s_dirty:boolean = false;

    private constructor() {
    }

    public static onFrame():CommandBuffer{
        if(Graphics.s_dirty){
            let cmdbuffer = Graphics.cmdbuffer;
            cmdbuffer.submit();
            Graphics.s_dirty = false;
            return cmdbuffer;
        }
        return null;
    }

    public static blit(src:ITexture,desc:ITexture){
        Graphics.cmdbuffer.blit(src,desc);     

        Graphics.s_dirty = true;
    }

}