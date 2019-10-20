import { Component, Texture2D, GraphicsContext, Camera } from "../core";
import { AssetsDataBase } from "../core/AssetsDatabase";
import { CommandBuffer, CommandBufferEvent } from "../core/CommandBuffer";
import { vec4 } from "../math";


export class SampleTextureRendering  extends Component{
    constructor() {
        super();
    }

    async onStart(){

        let bundle = AssetsDataBase.getLoadedBundle("iris");
        console.log(bundle);

        let texture:Texture2D = await Texture2D.loadTexture2D("resource/testImg.png",false);

        console.log(texture);

        let cmdbuffer = new CommandBuffer("sample texture rendering");
        cmdbuffer.drawScreenTexture(texture);
        cmdbuffer.submit();


        let cam = this.gameobject.getComponent(Camera);
        cam.cmdList.add(CommandBufferEvent.beforePostProcess,cmdbuffer);
    }

    onUpdate(){

    }
}