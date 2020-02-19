

export type EventFunc = (...data:any[])=>void;

export class EventListener{

    public invocationList:EventFunc[] = [];

    public register(f:EventFunc) {
        this.invocationList.push(f);
    }

    public remove(f:EventFunc){
        let ind = this.invocationList.indexOf(f);
        if(ind >=0){
            this.invocationList = this.invocationList.splice(ind,1);
        }
    }

    public Invoke(...data:any[]) {
        let list =this.invocationList;
        if(list.length ==0) return;
        list.forEach(f=>f(...data));
    }
}