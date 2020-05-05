import { vec4, mat4 } from "../math";
import { ITexture } from "./Texture";
import { Skybox, SkyboxType } from "./Skybox";
import { Material } from "./Material";
import { Mesh } from "./Mesh";
import { GLVertexArray } from "../gl";
import { MeshRender } from "./MeshRender";
import { GameContext } from "./GameContext";
import { GraphicsObj } from "./IGraphicObj";
import { GraphicsRender } from "./GraphicsRender";
import { GraphicsContext } from "./GraphicsContext";
import { basename } from "path";
import { ShaderFX } from "./ShaderFX";
import { Shader } from "./Shader";



export enum CommandType{
    Invalid,
    ClearColor,
    ClearDepth,
    ClearColorDepth,
    Blit,
    Draw,
    DrawScreenTex,
    DrawSkybox,

}

export enum CommandBufferEvent{
    beforeOpaque,
    afterOpaque,
    beforeTransparent,
    afterTransparent,
    beforePostProcess,
    afterPostProcess,
    beforeGBuffer,
    afterGBuffer,
}


export class CommandItem{
    public type:CommandType;
    public args:any[];


    public temp_vao:GLVertexArray;

    public constructor(type:CommandType,args?:any[]){
        this.type = type;
        this.args =args;
    }

    public release(gr:GraphicsRender){
        let tempvao = this.temp_vao;
        if(tempvao!=null){
            gr.glctx.deleteGLVertexArray(tempvao);
            this.temp_vao = null;
        }
        this.args = null;
        this.type = CommandType.Invalid;
    }
}


export class CommandBuffer extends GraphicsObj{

    public name:string;
    public commandList:CommandItem[] = [];

    private m_valid:boolean = false;

    public get valid():boolean{ return this.m_valid;}

    public constructor(name:string){
        super();
        this.name = name;
    }

    public release(){
        this.clear();
    }

    public clear(){

        this.commandList.forEach(cmd=>{
            cmd.release(GraphicsContext.currentRender);
        });

        this.commandList = [];
        this.m_valid = false;
    }

    public submit(){
        this.m_valid = true;
    }

    public clearColor(color:vec4){
        this.commandList.push(new CommandItem(CommandType.ClearColor,[color]) )
    }

    public clearDepthStencil(depth:number,stencil?:number){
        this.commandList.push(new CommandItem(CommandType.ClearDepth,[depth,stencil]) )
    }
    public clearColorDepth(color:vec4,depth:number,stencil?:number){
        this.commandList.push(new CommandItem(CommandType.ClearColorDepth,[color,depth,stencil]));
    }

    public drawSkybox(skybox:Skybox){
        if(skybox == null) return;

        if(skybox.type == SkyboxType.Custom){
            throw new Error('not implemented');
        }
        const grender= GameContext.current.graphicsRender;

        let mat =<Material>grender.resSkyboxMat[skybox.objId];
        if(mat == null){
            let shader:Shader = null;
            switch(skybox.type){
                case SkyboxType.CubeMap:
                    shader = grender.getInternalShader("@sfx/skyboxCube");
                break;
                case SkyboxType.Procedural:
                    shader = grender.getInternalShader("@sfx/skyboxPCG");
                break;
                case SkyboxType.Tex360:
                    shader = grender.getInternalShader("@sfx/skyboxTex");
                break;
            }

            mat = new Material(shader);
            grender.resSkyboxMat[skybox.objId] = mat;
        }

        let tex = skybox.rawTex;
        if(tex!=null){
            mat.setMainTexture(tex);
        }

        let drawcmd = new CommandItem(CommandType.DrawSkybox,[mat]);
        this.commandList.push(drawcmd);
    }

    public blit(src:ITexture,dest:ITexture,material?:Material){
        this.commandList.push(new CommandItem(CommandType.Blit,[src,dest,material]));
    }

    public drawMesh(mesh:Mesh,material:Material,mtx?:mat4){
        let cmditem = new CommandItem(CommandType.Draw,[mesh,material,mtx]);
        cmditem.temp_vao = MeshRender.CreateVertexArrayObj(GameContext.current.graphicsRender.glctx,mesh,material.program);
        this.commandList.push(cmditem);
    }

    public drawScreenTexture(tex:ITexture){
        if(tex == null) return;

        this.commandList.push(new CommandItem(CommandType.DrawScreenTex,[tex]));
    }

    public setRenderTarget(){
        
    }

}