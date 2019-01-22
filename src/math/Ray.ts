import { vec3, f32 } from "./GLMath";


export class Ray{
    public origin:vec3;
    public direction:vec3;

    private constructor(origin?:vec3,dir?:vec3){
        this.origin = origin != null? origin.clone(): vec3.zero;
        this.direction = dir != null ? dir.Normalize(): vec3.forward;
    }

    public getPoint(d:number):vec3{
        return this.direction.mulNumToRef(d).add(this.origin);
    }

    public distantToPointSq(p:vec3){
        let toPoint = p.subToRef(this.origin);
        let cos = toPoint.dot(this.direction);
        return toPoint.length2 - cos * cos;
    }

    public static fromTo(from:vec3,to:vec3):Ray{
        let dir = to.subToRef(from).normalized;
        return new Ray(from,dir);
    }

    public static fromPointDir(origin:vec3,dir:vec3){
        return new Ray(origin,dir);
    }

    public distantToPoint(p:vec3){
        return Math.sqrt(this.distantToPointSq(p));
    }

    /**
     * return true when ray has any pointer intersects with the sphere
     * @param pos 
     * @param radius 
     */
    public sphereIntersect(pos:vec3,radius:f32):boolean{
        let v = this.distantToPointSq(pos) - radius * radius; 
        return v <=0;
    }

    public get isValid():boolean{
        return this.direction.isValid && this.origin.isValid;
    }
    
}
