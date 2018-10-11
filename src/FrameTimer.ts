
const FRAME_INTERVAL = 60;
const FRAME_INTERVAL_P = FRAME_INTERVAL *1000;

export class FrameTimer{


    private m_ts:number =0;
    private m_delta:number = 0;

    private m_deltaaccu:number= 0;
    private m_accuCount:number =0;

    private m_fps:number = 0;
    private m_printfps:boolean = false;

    public get fps():number{
        return this.m_fps;
    }

    public constructor(printFPS:boolean = false){
        this.m_printfps = printFPS;
    }

    public tick(ts:number):number{
        let delta = ts - this.m_ts;
        this.m_delta = delta;
        this.m_ts = ts;

        if(this.m_printfps){
            this.m_deltaaccu += this.m_delta;
            let accuc = this.m_accuCount;
            accuc ++;
            if(accuc >=FRAME_INTERVAL){
                this.m_fps = FRAME_INTERVAL_P / this.m_deltaaccu;
                this.m_deltaaccu = 0;
                accuc = 0;
                console.log(`FPS ${this.m_fps}`);
            }
            this.m_accuCount = accuc;
        }

        return delta;
    }

}