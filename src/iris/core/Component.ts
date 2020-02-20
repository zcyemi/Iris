import { GameObject } from "./GameObject";
import { Transform } from "./Transform";
import { Scene } from "./Scene";

export class Component{

    public compType:string;

    public constructor(){
        this.compType = this.constructor.name;
    }
    public gameobject?:GameObject;
    public get transform():Transform{
        return this.gameobject.transform;
    }


    public onUpdate?():void;
    public onStart?():void;
    public onDestroy?():void;
}