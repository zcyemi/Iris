import { vec4 } from "../math";
import { ITexture } from "./Texture";
import { Skybox } from "./Skybox";


export enum CommandType{
    ClearColor,
    ClearDepth,
    ClearColorDepth,
    Blit,
    Draw,

}

export class CommandItem{
    public type:CommandType;
    public args:any[];

    public constructor(type:CommandType,args?:any[]){
        this.type = type;
        this.args =args;
    }
}


export class CommandBuffer{

    public name:string;
    public commandList:CommandItem[] = [];

    private m_valid:boolean = false;

    public get valid():boolean{ return this.m_valid;}

    public constructor(name:string){
        this.name = name;
    }

    public clear(){
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

    }

    public blit(src:ITexture,dest:ITexture){

    }

    public draw(){

    }

    public setRenderTarget(){
        
    }

}