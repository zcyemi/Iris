import { UIContainer } from "@zcyemi/entangui";

export interface IBaseComponentEditor{
    onGUI(comp:any);
}

export abstract class BaseComponentEditor<T> implements IBaseComponentEditor{
    public ui:UIContainer;
    
    public abstract onGUI(comp:T);

}

export class ComponentEditor{

    private static s_map:{[key:string]:IBaseComponentEditor} = {};

    public static register<T>(t:new()=>BaseComponentEditor<T>){
        const typename:string = t.prototype.constructor.name;

        const compname = typename.substr(0,typename.length-6);
        ComponentEditor.s_map[compname] = new t();
    }

    public static getEditor<T>(compname:string):BaseComponentEditor<T>{
        return <BaseComponentEditor<T>>ComponentEditor.s_map[compname];
    }
}