import { Mesh, MeshDataBuffer } from "./Mesh";
import { GLContext } from "./gl/GLContext";
import { GL } from "./gl/GL";


export class DynamicMesh extends Mesh{
    
    public constructor(name?:string){
        super(name,true);
    }

    public refreshMeshBuffer(glctx:GLContext){
        if(this.m_bufferInited) return;


        if(this.m_seperatedBuffer){
            let vertexdesc = this.vertexDesc;
            
            let posdesc = vertexdesc.position;
            if(posdesc != null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datapos = this.m_dataPosition;
                if(datapos) glctx.bufferData(GL.ARRAY_BUFFER,datapos,GL.DYNAMIC_DRAW);
                this.bufferVertices = buffer;
                posdesc.offset = 0;
            }

            let uvdesc = vertexdesc.uv;
            if(uvdesc !=null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datauv = this.m_dataUV;
                if(datauv) glctx.bufferData(GL.ARRAY_BUFFER,datauv,GL.DYNAMIC_DRAW);
                this.bufferUV = buffer;
                posdesc.offset = 0;
            }

            let normaldesc = vertexdesc.normal;
            if(normaldesc != null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datanormal = this.m_dataNormal;
                if(datanormal) glctx.bufferData(GL.ARRAY_BUFFER,datanormal,GL.DYNAMIC_DRAW);
                this.bufferNormal = buffer;
                posdesc.offset = 0;
            }
            glctx.bindBuffer(GL.ARRAY_BUFFER,null);
            
            //indices
            let dataIndices = this.m_dataIndices;
            let hasIndices = dataIndices != null && dataIndices.length !=0;
            if(hasIndices){
                let buffer = glctx.createBuffer();
                glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,buffer);
                glctx.bufferData(GL.ELEMENT_ARRAY_BUFFER,dataIndices,GL.STATIC_DRAW);
                glctx.bindBuffer(GL.ELEMENT_ARRAY_BUFFER,null);
                this.bufferIndices = buffer;
            }
        }
        else{
            throw new Error('dynamic buffer only support seperated buffer currently');
        }
        this.m_bufferInited = true;

    }

    public uploadDataBufferPosition(gl:WebGL2RenderingContext,databuffer:MeshDataBuffer = null){
        let buffer = this.bufferVertices;
        if(buffer == null) throw new Error('buffer is null');

        let data:MeshDataBuffer = null;
        if(databuffer!=null && databuffer != this.m_dataPosition){
            if(databuffer.byteLength > this.m_dataPosition.byteLength) throw new Error('buffer overflow');
            data = databuffer;
        }
        else{
            data = this.m_dataPosition;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }

    public uploadDataBufferUV(gl:WebGL2RenderingContext,databuffer:MeshDataBuffer = null){
        let buffer = this.bufferUV;
        if(buffer == null) throw new Error('uvbuffer is null');
        let data:MeshDataBuffer = null;
        if(databuffer!=null && databuffer != this.m_dataUV){
            if(databuffer.byteLength > this.m_dataUV.byteLength) throw new Error('uvbuffer overflow');
            data = databuffer;
        }
        else{
            data = this.m_dataUV;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }

    public uploadDataBufferNormal(gl:WebGL2RenderingContext,databuffer:MeshDataBuffer = null){
        let buffer = this.bufferNormal;
        if(buffer == null) throw new Error('normal buffer is null');
        let data:MeshDataBuffer = null;
        if(databuffer!=null && databuffer != this.m_dataNormal){
            if(databuffer.byteLength > this.m_dataNormal.byteLength) throw new Error('normal buffer overflow');
            data = databuffer;
        }
        else{
            data = this.m_dataNormal;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }

    public uploadDataBufferIndices(gl:WebGL2RenderingContext,databuffer:MeshDataBuffer = null,dynamicdraw:boolean = true){
        let buffer = this.bufferIndices;
        if(buffer == null) throw new Error('normal buffer is null');
        let data:MeshDataBuffer = null;
        if(databuffer!=null && databuffer != this.m_dataIndices){
            if(databuffer.byteLength > this.m_dataIndices.byteLength) throw new Error('normal buffer overflow');
            data = databuffer;
        }
        else{
            data = this.m_dataIndices;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
        gl.bufferData(gl.ARRAY_BUFFER,data,dynamicdraw? gl.DYNAMIC_DRAW:gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER,null);
    }


    

}
