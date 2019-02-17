import { MapStr } from "./core/Utility";

var debugRegister:MapStr<(any)=>void> = {};

export function DebugEntry(cmd:string){
    return function (target:any, funcname: string, descriptor: PropertyDescriptor) {
        if(target instanceof Function){
            debugRegister[cmd] = target[funcname];
            return;
        }
        console.warn('debug entry only support static function.');
    }
}

export function DebugCmd(cmd:string,obj?:any){
    let func = debugRegister[cmd];
    if(func == null) {
        console.warn(`[DebugEntry] no cmd found: ${cmd}`);
        return;
    }
    func(obj);
}


window['DebugCmd'] = DebugCmd;