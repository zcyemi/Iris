import * as chai from 'chai';
import { glmath, vec3 } from '../src/iris/math/GLMath';
import { Ray } from '../src/iris/math/Ray';
import { expectTrue, expectVec3 } from './testhelper';
const expect = chai.expect;

describe("ray",()=>{

    it("ctor-fromto",()=>{
        let pos = vec3.Random();
        var r = Ray.fromTo(pos,vec3.one);
        expectVec3(r.origin,pos);
        expectVec3(r.direction,vec3.one.sub(pos).normalized);
    });

    it("ctor-fromto-assign",()=>{
        let p1 = vec3.Random();
        let p2 = vec3.Random();
        let r1 = Ray.fromTo(p1,p2);
        expectVec3(r1.origin,p1);
        expect(r1.origin !== p1).eq(true);
    })

    it("ray-fromPointDir",()=>{
        let pos = vec3.Random();
        let dir= vec3.Random();
        var r= Ray.fromPointDir(pos,dir);
        expectVec3(r.direction,dir.normalized);
    });

    it("ray-fromPointDir-assign",()=>{
        let p1 = vec3.Random();
        let p2 = vec3.Random().normalized;
        let r1 = Ray.fromPointDir(p1,p2);
        expectTrue(r1.origin !== p1);
        expectTrue(r1.direction !== p2);
    });

    it("ray-getPoint",()=>{
        let ori = vec3.Random();
        let dir = vec3.one;
        let ray = Ray.fromPointDir(ori,dir);
        let p1 = ray.getPoint(1.0);
        let p2 = ray.getPoint(-1.0);

        expectVec3(p1,ori.addToRef(ray.direction));
        expectVec3(p1.addToRef(p2).mulNum(0.5),ori);
    });

    it("ray-distantToPoint",()=>{
        let ray = Ray.fromTo(vec3.Random(),vec3.Random());
        let p = vec3.Random();
        let dist = ray.distantToPoint(p);
        let off = p.subToRef(ray.origin);
        let proj = off.dot(ray.direction);
        let dist1 = Math.sqrt(off.length2 - proj * proj);
        expect(dist).closeTo(dist1,glmath.eplison);
    });

    it("sphere-intersect",()=>{
        let ray = Ray.fromPointDir(vec3.zero,vec3.Random());
        expectTrue(ray.sphereIntersect(vec3.zero,1.0));
    });

    it("sphere-intersect-tangency",()=>{
        let ray = Ray.fromPointDir(glmath.vec3(0,0,0.5),vec3.up);
        expect(ray.sphereIntersect(vec3.one.mulNum(0.5),0.5)).eq(true);
    })
})
