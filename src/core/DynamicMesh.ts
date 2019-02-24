import { Mesh, MeshDataBuffer } from "./Mesh";
import { GLContext } from "../gl/GLContext";
import { GL } from "../gl/GL";


export class DynamicMesh extends Mesh{
    
    public constructor(name?:string){
        super(name,true);
    }

    public refreshMeshBuffer(glctx:GLContext):boolean{
        if(this.m_bufferInited) return false;


        if(this.m_seperatedBuffer){
            let vertexdesc = this.vertexDesc;
            
            let posdesc = vertexdesc.position;
            if(posdesc != null && this.bufferVertices == null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datapos = this.m_dataPosition;
                if(datapos) glctx.bufferData(GL.ARRAY_BUFFER,datapos,GL.DYNAMIC_DRAW);
                this.bufferVertices = buffer;
                posdesc.offset = 0;
            }

            let uvdesc = vertexdesc.uv;
            if(uvdesc !=null && this.bufferUV == null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datauv = this.m_dataUV;
                if(datauv) glctx.bufferData(GL.ARRAY_BUFFER,datauv,GL.DYNAMIC_DRAW);
                this.bufferUV = buffer;
                uvdesc.offset = 0;
            }

            let normaldesc = vertexdesc.normal;
            if(normaldesc != null && this.bufferNormal == null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datanormal = this.m_dataNormal;
                if(datanormal) glctx.bufferData(GL.ARRAY_BUFFER,datanormal,GL.DYNAMIC_DRAW);
                this.bufferNormal = buffer;
                normaldesc.offset = 0;
            }

            let colordesc = vertexdesc.color;
            if(colordesc != null && this.bufferColor == null){
                let buffer = glctx.createBufferAndBind(GL.ARRAY_BUFFER);
                let datacolor = this.m_dataColor;
                if(datacolor) glctx.bufferData(GL.ARRAY_BUFFER,datacolor,GL.DYNAMIC_DRAW);
                this.bufferColor = buffer;
                colordesc.offset = 0;
            }
            glctx.bindBuffer(GL.ARRAY_BUFFER,null);
            
            //indices
            let dataIndices = this.m_dataIndices;
            let hasIndices = dataIndices != null && dataIndices.length !=0;
            if(hasIndices && this.bufferIndices == null){
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

        return true;
    }

    public uploadDataBufferPosition(gl:GLContext,databuffer:MeshDataBuffer = null,databytes:number = undefined){
        let data:MeshDataBuffer = null;
        if(databuffer!=null && databuffer != this.m_dataPosition){
            data = databuffer;
        }
        else{
            data = this.m_dataPosition;
        }

        let posdesc =this.vertexDesc.position;
        if(databytes != undefined){
            if(databytes > data.byteLength){
                throw new Error('specific positionbuffer databytes overflow!');
            }else{
                posdesc.totalbytes = databytes;
            }
        }else{
            posdesc.totalbytes = data.byteLength;
        }
        let buffer = this.bufferVertices;
        if(buffer == null){
            buffer = gl.createBuffer();
            this.bufferVertices = buffer;
        }

        gl.bindBuffer(GL.ARRAY_BUFFER,buffer);
        gl.bufferData(GL.ARRAY_BUFFER,data,GL.DYNAMIC_DRAW);
        gl.bindBuffer(GL.ARRAY_BUFFER,null);
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

    public uploadDataBufferColor(gl:GLContext,databuffer:MeshDataBuffer = null,databytes:number = undefined){
        
        let data:MeshDataBuffer = null;
        if(databuffer!=null && databuffer != this.m_dataColor){
            data = databuffer;
        }
        else{
            data = this.m_dataColor;
        }

        let colordesc =this.vertexDesc.color;
        if(databytes != undefined){
            if(databytes > data.byteLength){
                throw new Error('specific colorbuffer databytes overflow!');
            }else{
                colordesc.totalbytes = databytes;
            }
        }else{
            colordesc.totalbytes = data.byteLength;
        }
        let buffer = this.bufferColor;
        if(buffer == null){
            buffer = gl.createBuffer();
            this.bufferColor = buffer;
        }

        gl.bindBuffer(GL.ARRAY_BUFFER,buffer);
        gl.bufferData(GL.ARRAY_BUFFER,data,GL.DYNAMIC_DRAW);
        gl.bindBuffer(GL.ARRAY_BUFFER,null);
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
