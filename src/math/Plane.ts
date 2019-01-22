import { vec4, vec3, f32, glmath } from "./GLMath";
import { Ray } from "./Ray";


export class Plane extends vec4{
    
    public static fromNormalD(nor:vec3,D:f32){
        let nd = nor.Normalize();
        return new Plane([nd.x,nd.y,nd.z,D]);
    }
    
    public static fromPointDir(dir:vec3,point:vec3){
        let nd = dir.Normalize();
        let d = point.dot(nd);
        return new Plane([nd.x,nd.y,nd.z,-d]);
    }

    public get point():vec3{
        return new vec3(this.raw).mul(-this.w);
    }
    public get dir():vec3{
        return new vec3(this.raw);
    }
    /**
     * return null when two plane are parallel
     * @param p 
     */
    public getIntersectionWithPlane(p:Plane):Ray|null{
        let sdir = this.dir;
        let pdir = p.dir;

        let crossdir = sdir.cross(pdir);
        if(Math.abs(crossdir.length2) < glmath.eplison) return null;

        let cross = crossdir.normalized;
        let point = this.point;
        let dir = sdir.cross(cross).normalized;
        let ipoint = this.getIntersectionWithLine(Ray.fromPointDir(point,dir));
        return Ray.fromPointDir(ipoint,cross);
    }

    /**
     * return null when line is parallel to the plaen.
     * @param r 
     */
    public getIntersectionWithLine(r:Ray):vec3| null{
        let dir = this.dir;
        let rdotdir = dir.dot(r.direction);
        if(glmath.closeToZero(rdotdir)) return null;
        let off = r.origin.subToRef(this.point);
        let d = off.dot(dir) / rdotdir;
        return r.getPoint(-d);
    }

    public getIntersectionWithPlanes(p1:Plane,p2:Plane):vec3{
        let line = p1.getIntersectionWithPlane(p2);
        return this.getIntersectionWithLine(line);
    }

    public isPointAtPlane(p:vec3):boolean{
        return Math.abs(p.dot(this.dir) + this.raw[3]) < glmath.eplison;
    }

}
