import { IndexedTypedBuffer } from "../collection";
import { vec4 } from "../math";
import { FontInfo } from "./FontInfo";
import { DynamicMesh, Material, MeshBufferUtility, MeshTopology, GraphicsRender, MeshRender, TextureDescUtility, Texture2D } from "../core";
import { GLVertexArray, GLConst, GLContext, GL } from "../gl";
import { ShaderFX } from "../shaderfx";

export class TextBuilder {

    public textPosBuffer: IndexedTypedBuffer<Float32Array>;
    public textUVBuffer: IndexedTypedBuffer<Float32Array>;

    private static s_indicesBuffer: Uint16Array;
    private m_isdirty: boolean = true;
    public mesh: DynamicMesh;
    public vao: GLVertexArray;
    public material: Material;

    public constructor(defaultSize: number = 512, grender: GraphicsRender) {
        this.textPosBuffer = new IndexedTypedBuffer(Float32Array, defaultSize);
        this.textUVBuffer = new IndexedTypedBuffer(Float32Array, defaultSize);

        let indicesArray = new Uint16Array(128 * 6);
        MeshBufferUtility.IndicesBufferFillQuad(indicesArray, 128);
        TextBuilder.s_indicesBuffer = indicesArray;

        let mesh = new DynamicMesh('textbatch');

        mesh.setIndices(indicesArray, GLConst.UNSIGNED_SHORT, MeshTopology.Triangles);
        mesh.setPosition(this.textPosBuffer.array, GLConst.FLOAT, 3);
        mesh.setUV(this.textUVBuffer.array, GLConst.FLOAT, 2);
        mesh.refreshMeshBuffer(grender.glctx);

        let mat = this.material;
        if (mat == null) {
            mat = new Material(grender.shaderLib.shaderText);
            

            var tex = Texture2D.createTexture2DImage(FontInfo.image,{
                internalformat: GL.RGBA,
                format:GL.RGBA,
                mipmap:true,
            },grender.glctx);
            mat.setTexture(ShaderFX.UNIFORM_MAIN_TEXTURE,tex);
            this.material = mat;
        }

        let vao = this.vao;
        if (vao == null) {
            this.vao = MeshRender.CreateVertexArrayObj(grender.glctx, mesh, mat.program);
        }
        this.mesh = mesh;
    }

    public refreshData(glctx: GLContext) {
        if (!this.m_isdirty) return;
        this.m_isdirty = false;

        let mesh = this.mesh;
        let posbuffer = this.textPosBuffer;
        let uvbuffer = this.textUVBuffer;
        mesh.uploadDataBufferPosition(glctx, posbuffer.array, posbuffer.size * 4);
        mesh.uploadDataBufferUV(glctx, uvbuffer.array, uvbuffer.size * 4);
        mesh.setIndicesCount(posbuffer.size / 4 * 3);
    }

    public drawTextRect(content: string, rect: vec4) {
        this.drawText(content, rect.x, rect.y, rect.z, rect.w);
    }

    public drawText(content: string, x: number, y: number, w: number, h: number) {
        if (content == null || content === '') return;

        let len = content.length;

        const posbuffer = this.textPosBuffer;
        const uvbuffer = this.textUVBuffer;

        let posary = posbuffer.array;
        let possize = posbuffer.size;

        let uvary = uvbuffer.array;
        let uvsize = uvbuffer.size;

        let xbase = x;
        let ybase = y;

        for (let t = 0; t < len; t++) {
            let c = content.charCodeAt(t);

            let g = FontInfo.glyphData[c];
            if (g == null) continue;


            let x1 = xbase + g.lb;
            let x2 = x1 + g.x2 - g.x1;
            let y1 = ybase - g.y + g.y1;
            let y2 = ybase + g.y2 - g.y;

            if (posbuffer.checkExten(12)) {
                posary = posbuffer.array;
            }

            posary[possize] = x1;
            posary[possize + 1] = y1;
            posary[possize + 2] = 0;

            posary[possize + 3] = x2;
            posary[possize + 4] = y1;
            posary[possize + 5] = 0;

            posary[possize + 6] = x2;
            posary[possize + 7] = y2;
            posary[possize + 8] = 0;

            posary[possize + 9] = x1;
            posary[possize + 10] = y2;
            posary[possize + 11] = 0;

            if (uvbuffer.checkExten(8)) {
                uvary = uvbuffer.array;
            }

            let u1 = g.x1 / 128.0;
            let u2 = g.x2 / 128.0;
            let v1 = g.y1 / 128.0;
            let v2 = g.y2 / 128.0;


            uvary[uvsize] = u1;
            uvary[uvsize + 1] = v1;

            uvary[uvsize + 2] = u2;
            uvary[uvsize + 3] = v1;

            uvary[uvsize + 4] = u2;
            uvary[uvsize + 5] = v2;

            uvary[uvsize + 6] = u1;
            uvary[uvsize + 7] = v2;

            uvsize += 8;

            possize += 12;

            xbase = x2 + g.rb;
        }

        posbuffer.size = possize;
        uvbuffer.size = uvsize;

        this.m_isdirty  =true;
    }
}