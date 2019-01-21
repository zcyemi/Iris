import { Trans } from '../src/Trans';
import { expectVec3, expectQuat, expectPair, expectMat4, expectVec4 } from './testhelper';
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
        let ray = new Ray(vec3.zero, glmath.vec3(1, 1, 0));
        let point = plane.getIntersectionWithLine(ray);
        expect(plane.isPointAtPlane(point)).eq(true);
    })
    it("plane-line2", () => {
        for (let t = 0; t < 20; t++) {
            let plane = Plane.fromNormalD(vec3.Random(), Math.random() * 10);
            let ray = new Ray(vec3.Random(), vec3.Random());
            let p = plane.getIntersectionWithLine(ray);
            expect(plane.isPointAtPlane(p)).eq(true);
        }
    })
    it("plane-plane", () => {
        for (let t = 0; t < 20; t++) {
            let p1 = Plane.fromNormalD(vec3.Random(), Math.random() * 10);
            let p2 = Plane.fromNormalD(vec3.Random(), Math.random() * 10);

            let line = p1.getIntersectionWithPlane(p2);

            expect(line.direction.dot(p1.dir)).closeTo(0,glmath.eplison);
            expect(line.direction.dot(p2.dir)).closeTo(0,glmath.eplison);
        }
    });
})