import { GL } from "../gl/GL";
import { GLContext } from "../gl/GLContext";
import { Mesh, MeshDataBuffer } from "./Mesh";
import { AttrSemantic } from "./ShaderFX";

export class DynamicMesh extends Mesh {

    public constructor(name?: string) {
        super(name, true);
    }

    public refreshMeshBuffer(glctx: GLContext): boolean {
        if (this.m_bufferInited) return false;

        if (this.m_seperatedBuffer) {
            let vertexdesc = this.vertexDesc;

            for (const key in vertexdesc) {
                if (vertexdesc.hasOwnProperty(key)) {
                    let attr: AttrSemantic = AttrSemantic[key];
                    if (attr == null) continue;
                    const desc = vertexdesc[attr];

                    if (desc != null && this.bufferVertices[attr] == null) {
                        let glbuffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                        let databuffer = this.getVerticesData(attr);
                        if (databuffer) glctx.bufferData(GL.ARRAY_BUFFER, databuffer, GL.DYNAMIC_DRAW);
                        this.bufferVertices = glbuffer;
                        desc.offset = 0;
                    }
                }
            }

            glctx.bindBuffer(GL.ARRAY_BUFFER, null);

            //indices
            let dataIndices = this.dataIndices;
            let hasIndices = dataIndices != null && dataIndices.length != 0;
            if (hasIndices && this.bufferIndices == null) {
                let buffer = glctx.createBuffer();
                glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, buffer);
                glctx.bufferData(GL.ELEMENT_ARRAY_BUFFER, dataIndices, GL.STATIC_DRAW);
                glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER, null);
                this.bufferIndices = buffer;
            }
        }
        else {
            throw new Error('dynamic buffer only support seperated buffer currently');
        }
        this.m_bufferInited = true;

        return true;
    }

    public updateDataBufferVertices(attr: AttrSemantic, gl: GLContext, databuffer: MeshDataBuffer = null, databytes: number = undefined) {
        let data: MeshDataBuffer = null;

        let curdatabuffer = this.getVerticesData(attr);
        if (databuffer != null && databuffer != curdatabuffer) {
            data = databuffer;
        }
        else {
            data = curdatabuffer;
        }

        let posdesc = this.vertexDesc[attr];
        if (databytes != undefined) {
            if (databytes > data.byteLength) {
                throw new Error(`specific ${attr} databytes overflow!`);
            } else {
                posdesc.totalbytes = databytes;
            }
        } else {
            posdesc.totalbytes = data.byteLength;
        }
        let buffer = this.bufferVertices;
        if (buffer == null) {
            buffer = gl.createBuffer();
            this.bufferVertices = buffer;
        }

        gl.bindBuffer(GL.ARRAY_BUFFER, buffer);
        gl.bufferData(GL.ARRAY_BUFFER, data, GL.DYNAMIC_DRAW);
        gl.bindBuffer(GL.ARRAY_BUFFER, null);
    }

    public uploadDataBufferIndices(gl: WebGL2RenderingContext, databuffer: MeshDataBuffer = null, dynamicdraw: boolean = true) {
        let buffer = this.bufferIndices;
        if (buffer == null) throw new Error('normal buffer is null');
        let data: MeshDataBuffer = null;
        if (databuffer != null && databuffer != this.dataIndices) {
            if (databuffer.byteLength > this.dataIndices.byteLength) throw new Error('normal buffer overflow');
            data = databuffer;
        }
        else {
            data = this.dataIndices;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, dynamicdraw ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }
}
