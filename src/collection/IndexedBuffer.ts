export class IndexedBuffer<T>{

    public array:T[] = [];
    public capacity:number = 0;
    public size:number = 0;

    public push(t:T){
        const idx = this.size;
        if(idx>= this.capacity){
            this.array.push(t);
            this.capacity++;
        }
        else{
            this.array[idx] = t;
        }
        this.size =idx +1;
    }

    public empty(){
        this.size = 0;
    }
    public release(){
        this.array = [];
        this.size = 0;
        this.capacity = 0;
    }
}

export type TypedArray = Float32Array | Int32Array | Uint8Array | Uint16Array | Int16Array |Int8Array | Uint32Array;
export class IndexedTypedBuffer<T extends TypedArray>{
    public array:T;
    private m_capacity:number;
    public size:number = 0;

    private m_type:new(size:number)=>T;

    public get capacity():number{return this.m_capacity;}

    public constructor(type:new(size:number)=>T,size:number = 128){
        this.array = new type(size);
        this.m_capacity = size;
        this.m_type = type;
    }
    
    public push(val:any){
        if(this.size >= this.m_capacity){
            this.extendArray();
        }
        this.array[this.size] = val;
        this.size++;
    }

    public checkExten(newsize:number):boolean{
        if(this.size+newsize >= this.m_capacity){
            this.extendArray();
            return true;
        }
        return false;
    }

    private extendArray(){
        let capa = this.m_capacity * 2;
        this.m_capacity = capa;
        let newary = new this.m_type(capa);
        newary.set(this.array,0);
        this.array = newary;
    }

    public empty(){
        this.size = 0;
    }

    public release(){
        this.array = null;
        this.m_capacity = 0;
        this.size = 0;
    }
}