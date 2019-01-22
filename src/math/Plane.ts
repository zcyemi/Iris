import { vec4, vec3, f32, glmath } from "./GLMath";
import { Ray } from "./Ray";


export class Plane extends vec4{
    
    public static fromNormalD(nor:vec3,D:f32){
        let nd = nor.normalized();
        return new Plane([nd.x,nd.y,nd.z,D]);
    }
    
    public static fromPointDir(dir:vec3,point:vec3){
        let nd = dir.normalized();
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

        let cross = crossdir.normalize;
        let point = this.point;
        let dir = sdir.cross(cross).normalize;
        let ipoint = this.getIntersectionWithLine(new Ray(point,dir));
        return new Ray(ipoint,cross);
    }

    public getIntersectionWithLine(r:Ray):vec3{
        let off = r.origin.subToRef(this.point);
        let dir = this.dir;
        let d = off.dot(dir) / dir.dot(r.direction);
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
