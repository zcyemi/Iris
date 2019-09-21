import { Trans } from '../src/Trans';
import { expectVec3, expectQuat, expectPair, expectMat4, expectVec4, expectTrue } from './testhelper';
import { expect } from 'chai';
import { quat, vec3, mat4, glmath } from '../src/math/GLMath';
import { Plane } from '../src/math/Plane';
import { Ray } from '../src/math/Ray';


describe("plane", () => {
    it("plane-point", () => {
        let plane = Plane.fromNormalD(vec3.one, -Math.sqrt(3));
        expect(plane.isPointAtPlane(vec3.one)).eq(true);
        expect(plane.isPointAtPlane(vec3.zero)).eq(false);

        for (var t = 0; t < 10; t++) {
            let p = Plane.fromNormalD(vec3.Random(), Math.random() * 10);
            let pp = p.point;
            expect(p.isPointAtPlane(pp)).eq(true);
        }
    });

    it("plane-creation", () => {
        let plane = Plane.fromNormalD(vec3.one, -Math.sqrt(3));
        let plane2 = Plane.fromPointDir(vec3.one, vec3.one);
        expectVec4(plane, plane2);
    })

    it("plane-line", () => {
        let plane = Plane.fromNormalD(vec3.up, -1);
        let ray = Ray.fromPointDir(vec3.zero, glmath.vec3(1, 1, 0));
        let point = plane.getIntersectionWithLine(ray);
        expect(plane.isPointAtPlane(point)).eq(true);
    })
    it("plane-line2", () => {
        for (let t = 0; t < 20; t++) {
            let plane = Plane.fromNormalD(vec3.Random(), Math.random() * 10);
            let ray = Ray.fromPointDir(vec3.Random(), vec3.Random());
            let p = plane.getIntersectionWithLine(ray);
            expect(plane.isPointAtPlane(p)).eq(true);
        }
    })

    it("plane-line-parallel", () => {
        let p = Plane.fromPointDir(vec3.one, vec3.zero);
        let line = Ray.fromPointDir(glmath.vec3(1, 0, 0), glmath.vec3(-1, 1, 0));
        let point = p.getIntersectionWithLine(line);
        expect(point).to.eq(null);
        let line1 = Ray.fromPointDir(vec3.zero, vec3.Random());
        let point1 = p.getIntersectionWithLine(line1);
        expectVec3(point1, vec3.zero);
    });

    it("plane-plane", () => {
        for (let t = 0; t < 20; t++) {
            let p1 = Plane.fromNormalD(vec3.Random(), Math.random());
            let p2 = Plane.fromNormalD(vec3.Random(), Math.random());
            let line = p1.getIntersectionWithPlane(p2);
            if (line != null) {
                expectTrue(line.isValid);
                expect(line.direction.dot(p1.dir)).closeTo(0, glmath.eplison);
                expect(line.direction.dot(p2.dir)).closeTo(0, glmath.eplison);

                expectTrue(p1.isPointAtPlane(line.origin));
                expectTrue(p2.isPointAtPlane(line.origin));
            }
        }
    });

    it("plane-plane-parallel", () => {
        let dir = glmath.vec3(5, 10, 20);
        let p1 = Plane.fromNormalD(dir, 10);
        let p2 = Plane.fromNormalD(dir, -5);

        let line1 = p1.getIntersectionWithPlane(p2);
        let line2 = p2.getIntersectionWithPlane(p1);

        expect(line1).eq(null);
        expect(line2).eq(null);
    });

    it("plane-planes-verify",()=>{
        for(let t=0;t<20;t++){
            let p1 = Plane.fromNormalD(vec3.Random(), Math.random());
            let p2 = Plane.fromNormalD(vec3.Random(), Math.random());
            let p3 = Plane.fromNormalD(vec3.Random(), Math.random());
    
            let point1 = p1.getIntersectionWithPlanes(p2,p3);
            let point2 = p1.getIntersectionWithLine(p2.getIntersectionWithPlane(p3));
            let point3 = p2.getIntersectionWithLine(p3.getIntersectionWithPlane(p1));
            let point4 = p3.getIntersectionWithLine(p1.getIntersectionWithPlane(p2));
            expectVec3(point1,point2);
            expectVec3(point1,point3);
            expectVec3(point1,point4);
        }
    });
})
