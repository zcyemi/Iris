import { MeshRender } from "./MeshRender";
import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GraphicsRender } from "./GraphicsRender";
import { Texture } from "./Texture";
import { GLContext } from "wglut";
import { ShaderFX } from "./shaderfx/ShaderFX";


export class SpriteRender extends MeshRender{

    private m_image:Texture;
    private m_imageDirty:boolean =false;
    public get image():Texture{ return this.m_image;}
    public set image(t:Texture){
        if(t == this.m_image) return;
        this.m_image = t;
        this.m_imageDirty = true;
    }

    public constructor(){
        super();
        this.mesh = Mesh.Quad;
        this.material = new Material(GraphicsRender.globalRender.shaderLib.shaderSprite);
    }

    public refreshData(glctx:GLContext){
        super.refreshData(glctx);
        if(this.m_imageDirty){
            this.material.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,this.m_image);
            this.m_imageDirty = false;
        }
    }
}
