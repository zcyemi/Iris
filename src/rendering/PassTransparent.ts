// import { ShaderTags, Comparison, CullingMode, BlendOperator } from "../shaderfx/Shader";
// import { Scene } from "../Scene";
// import { RenderPass } from "./RenderPass";

// export class PassTransparent extends RenderPass {
//     private m_tags: ShaderTags;

//     public constructor(pipeline: PipelineBase) {
//         super(pipeline);

//         let deftags = new ShaderTags();
//         deftags.blendOp = BlendOperator.ADD;
//         deftags.blend = true;
//         deftags.zwrite = false;
//         deftags.ztest = Comparison.LEQUAL;
//         deftags.culling = CullingMode.Back;
//         deftags.fillDefaultVal();
//         this.m_tags = deftags;
//     }

//     public render(scene?: Scene) {
//         // const pipe = this.pipeline;
//         // const gl = pipe.GL;
//         // const glctx = pipe.GLCtx;
//         // const deftags = this.m_tags;

//         // let queue = pipe.nodeList.nodeTransparent;
//         // if(queue.length == 0) return;

//         // //sm
//         // let state =pipe.stateCache;
//         // state.reset(deftags);

//         // pipe.activeDefaultTexture();

//         // //do draw
//         // let len = queue.length;
//         // let curprogram:GLProgram = null;

//         // const dataobj = pipe.shaderDataObj;

//         // // gl.enable(gl.BLEND);
//         // // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//         // for(let i=0;i<len;i++){
//         //     let node = queue[i];

//         //     if(node instanceof MeshRender){
//         //         let mat = node.material;
//         //         let mesh = node.mesh;
//         //         let program = mat.program;
//         //         node.refreshData(glctx);

//         //         if(program != curprogram){
//         //             let glp = program.Program;
//         //             gl.useProgram(glp);
//         //             pipe.uniformBindDefault(program);
//         //             curprogram = program;
//         //         }
//         //         state.apply(mat.shaderTags);
//         //         mat.apply(gl);
//         //         dataobj.setMtxModel(node.object.transform.objMatrix);
//         //         pipe.updateUniformBufferObject(dataobj);

//         //         node.bindVertexArray(glctx);
//         //         let indicedesc = mesh.indiceDesc;
//         //         gl.drawElements(gl.TRIANGLES, indicedesc.indiceCount,indicedesc.type, indicedesc.offset);
//         //         node.unbindVertexArray(glctx);

//         //         mat.clean(gl);
//         //     }

//         // }
//     }

// }
