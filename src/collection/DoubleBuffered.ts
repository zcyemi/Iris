

export class DoubleBuffered<T extends Object>{
    public back:T;
    public front:T;

    public constructor(back:T,front:T){
        this.back= back;
        this.front= front;
    }

    public static create<T extends Object>(back:T,front:T){
        return new DoubleBuffered<T>(back,front);
    }

    public swap(){
        let temp = this.back;
        this.back = this.front;
        this.front = temp;
    }
}