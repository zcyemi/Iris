import { Mesh } from "./Mesh";
import { Material } from "./Material";
import { GameObject } from "./GameObject";

export class MeshRender{
    public mesh:Mesh;
    public material:Material;
    public object:GameObject;

    public castShadow:boolean = true;

    public constructor(mesh?:Mesh,mat?:Material){
        this.mesh = mesh;
        this.material = mat; 
    }
}


