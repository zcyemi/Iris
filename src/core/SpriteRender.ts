import { MeshRender } from "./MeshRender";
import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GraphicsRender } from "./GraphicsRender";
import { Texture2D } from "./Texture2D";
import { vec4 } from "../math/GLMath";
import { GLContext } from "../gl/GLContext";
import { ShaderFX } from "./ShaderFX";
import { MeshPrimitive } from "./MeshPrimitive";


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
        this.mesh = MeshPrimitive.Quad;

        let shader = ShaderFX.findShader("iris","@shaderfx/sprite");
        this.material = new Material(shader);
    }

    public refreshData(glctx:GLContext){
        super.refreshData(glctx);
        if(this.m_imageDirty){
            this.material.setTexture("MainTexture",this.m_image);
            this.m_imageDirty = false;
        }
        if(this.m_colorDirty){
            this.m_colorDirty = false;
            this.material.setColor("MainColor",this.m_color);
        }
    }
}
