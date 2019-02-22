import { IndexedTypedBuffer } from "../collection";
import { vec4 } from "../math";
import { FontInfo } from "./FontInfo";

export class TextBuilder{

    public vertexbuffer:IndexedTypedBuffer<Float32Array>;
    public uvbuffer:IndexedTypedBuffer<Float32Array>;

    public constructor(defaultSize:number = 512){
        this.vertexbuffer = new IndexedTypedBuffer(Float32Array,defaultSize);
        this.uvbuffer = new IndexedTypedBuffer(Float32Array,defaultSize);
    }

    public drawTextRect(content:string,rect:vec4){
        this.drawText(content,rect.x,rect.y,rect.z,rect.w);
    }

    public drawText(content:string,x:number,y:number,w:number,h:number){
        if(content == null || content === '') return;

        let len =content.length;

        const vertbuffer = this.vertexbuffer;
        const uvbuffer = this.uvbuffer;
        
        let vertary = vertbuffer.array;
        let vertsize = vertbuffer.size;

        let uvary = uvbuffer.array;
        let uvsize = uvbuffer.size;

        let xbase = x;
        let ybase = y;

        for(let t =0;t<len;t++){
            let c = content.charCodeAt(t);
            
            let g = FontInfo.glyphData[c];
            if(g == null) continue;
        
        
            let x1 = xbase + g.lb;
            let x2 = x1 + g.x2 - g.x1;
            let y1 = ybase - g.y + g.y1;
            let y2 = ybase + g.y2 - g.y;

            if(vertbuffer.checkExten(12)){
                vertary = vertbuffer.array;
            }

            vertary[vertsize] = x1;
            vertary[vertsize+1] = y1;
            vertary[vertsize+2] = 0;

            vertary[vertsize+3] = x2;
            vertary[vertsize+4] = y1;
            vertary[vertsize+5] = 0;

            vertary[vertsize+6] = x2;
            vertary[vertsize+7] = y2;
            vertary[vertsize+8] = 0;

            vertary[vertsize+9] = x1;
            vertary[vertsize+10] = y2;
            vertary[vertsize+11] = 0;

            if(uvbuffer.checkExten(8)){
                uvary = uvbuffer.array;
            }

            let u1 = g.x1 / 128.0;
            let u2 = g.x2 / 128.0;
            let v1 = g.y1 / 128.0;
            let v2 = g.y2 / 128.0;
            

            uvary[uvsize] = u1;
            uvary[uvsize+1] = v1;

            uvary[uvsize+2] = u2;
            uvary[uvsize+3] = v1;

            uvary[uvsize+4] = u2;
            uvary[uvsize+5] = v2;

            uvary[uvsize+6] = u1;
            uvary[uvsize+7] = v2;

            uvsize +=8;

            vertsize+=12;

            xbase = Math.round(x2 + g.rb);
        }

        vertbuffer.size= vertsize;
    }
}