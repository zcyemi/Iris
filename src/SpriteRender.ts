import { MeshRender } from "./MeshRender";
import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GraphicsRender } from "./GraphicsRender";
import { Texture2D } from "./Texture2D";
import { ShaderFX } from "./shaderfx/ShaderFX";
import { vec4 } from "./math/GLMath";
import { GLContext } from "./gl/GLContext";


export class SpriteRender extends MeshRender{

    private m_image:Texture2D;
    private m_imageDirty:boolean =false;
    public get image():Texture2D{ return this.m_image;}
    public set image(t:Texture2D){
        if(t == this.m_image) return;
        this.m_image = t;
        this.m_imageDirty = true;
    }
    public m_color:vec4 = vec4.one;
    private m_colorDirty:boolean = true;
    public set color(c:vec4){ this.m_color.set(c); this.m_colorDirty = true;}
    public get color():vec4{ return this.m_color;}

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
        if(this.m_colorDirty){
            this.m_colorDirty = false;
            this.material.setColor(ShaderFX.UNIFORM_MAIN_COLOR,this.m_color);
        }
    }
}
