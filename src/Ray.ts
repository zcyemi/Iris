import { vec3 } from "./math/GLMath";


export class Ray{
    public origin:vec3;
    public direction:vec3;

    public constructor(origin?:vec3,dir?:vec3){
        this.origin = origin != null? origin: vec3.zero;
        this.direction = dir != null ? dir: vec3.forward;
    }
}