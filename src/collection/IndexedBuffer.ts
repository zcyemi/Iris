

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