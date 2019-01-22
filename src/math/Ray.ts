import { vec3, f32 } from "./GLMath";


export class Ray{
    public origin:vec3;
    public direction:vec3;

    public constructor(origin?:vec3,dir?:vec3){
        this.origin = origin != null? origin: vec3.zero;
        this.direction = dir != null ? dir: vec3.forward;
    }

    public getPoint(d:number):vec3{
        return this.direction.mulNumToRef(d).add(this.origin);
    }

    public distantToPointSq(p:vec3){
        let toPoint = p.subToRef(this.origin);
        let cos = toPoint.dot(this.direction);
        return toPoint.length2 - cos * cos;
    }

    public distantToPoint(p:vec3){
        return Math.sqrt(this.distantToPointSq(p));
    }

    public sphereIntersect(pos:vec3,radius:f32):boolean{
        return this.distantToPointSq(pos) < radius * radius;
    }

    public isValid():boolean{
        return this.direction.isValid && this.origin.isValid;
    }
}
