import { GameObject } from "./GameObject";
import { Transform } from "./Transform";

export class Component{
    
    public gameobject?:GameObject;
    public get transform():Transform{
        return this.gameobject.transform;
    }
    public onUpdate?():void;
    public onStart?():void;
}