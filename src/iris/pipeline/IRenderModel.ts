import { IRenderPipeline } from "./IRenderPipeline";
import { GLProgram, GLVertexArray, FrameBuffer } from "../gl";
import { ITexture, MeshRender, Material, Mesh, IGraphicObj, Camera } from "../core";
import { mat4, vec4 } from "../math";
import { PipelineClearInfo } from "./InternalPipeline";
import { CommandBuffer } from "../core/CommandBuffer";




export interface IRenderModel{

    getMaterialDefault():Material;
    getMaterialError():Material;

    bindDefaultUniform(program:GLProgram);
    updateDefaultUniform();
    updateCameraUnifomrm(camera:Camera);

    setShadowMapTex(tex:ITexture,index:number);


    drawFullScreen(tex:ITexture);
    drawScreenTex(tex:ITexture,rect:vec4);

    drawMeshRender(meshrender:MeshRender,objmtx?:mat4,material?:Material);
    drawMeshWithMat(mesh:Mesh,mat:Material,vao:GLVertexArray,objmtx?:mat4);

    clearFrameBufferTarget(clearinfo:PipelineClearInfo,fb:FrameBuffer);

    execCommand(cmdbufer:CommandBuffer);
}