

export enum GLCmdType{
    bindFrameBuffer,
    blitFrameBuffer,

    bindBuffer,
    bindVertexArray,

    uniformBlockBinding,

    viewport,
    colorMask,
    depthFunc,
    depthMask,
    depthRange,
    blendEquation,
    pipelineBlendParam,
    blendFunc,
    cullFace,
    clearColor,
    clearDepth,
    polygonOffset,
    frontFace,

    clear,
    drawElements,

    useProgram,

    bufferData,
}

export class GLCmdData{
    public type:GLCmdType;
    public label:string;
    public parameter:any;

    public constructor(type:GLCmdType,label:string,parameter:any){
        this.type =type;
        this.label= label;
        this.parameter = parameter;
    }
}

export class GLCmdRecord{
    public commands:GLCmdData[] = [];

    public Record(cmd:GLCmdType,label:string,param:any){
        this.commands.push(new GLCmdData(cmd,label,param));
    }
}