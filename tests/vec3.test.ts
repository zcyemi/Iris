import * as chai from 'chai';
import { glmath, vec3 } from '../src/iris/math/GLMath';
import { expectVec3 } from './testhelper';
const expect = chai.expect;

describe('vec3',()=>{
    it('ctor', () => {
        let v = glmath.vec3(1, 2, 3);
        expect(v.raw).that.deep.eq([1, 2, 3]);
    });
    it('clone', () => {
        let v = glmath.vec3(1, 2, 3);
        let v1 = v.clone();
        v.x = 2;
        expect(v1.raw).that.deep.eq([1, 2, 3]);
        expect(v.x).that.eq(2);
    })
    it('ctor null', () => {
        let v3 = new vec3();
        expect(v3.raw).to.be.an('array').that.deep.eq([0, 0, 0]);
    });
    it('toVec4', () => {
        let v3 = glmath.vec3(1, 2, 3);
        let v4 = v3.vec4(5);
        expect(v4.w).to.equal(5);
    });
    it('cross-crossverify', () => {
        let v1 = vec3.Random().normalized;
        let v2 = vec3.Random().normalized;
    
        let cross = vec3.Cross(v1, v2);
        let dot = v1.dot(v2);
        expect(cross.length2 + dot * dot).to.closeTo(1.0, 0.00001);
    })
    it('cross', () => {
        let c = vec3.up.cross(vec3.down).normalized;
        let cs = vec3.SafeCross(vec3.up, vec3.down).normalized;
    
        expect(cs.x).not.eq(NaN);
        expect(cs.y).not.eq(NaN);
        expect(cs.z).not.eq(NaN);
    })

    it('cross-self',()=>{
        let v = vec3.one;
        let cross = v.cross(v);
        expectVec3(cross,vec3.zero);
    })

    it('cross-zero',()=>{
        let v = vec3.one;
        let zero = vec3.zero;
        let cross = v.cross(zero);
        expectVec3(cross,vec3.zero);
    })

    it("dot-zero",()=>{
        let v = vec3.Random();
        let z = vec3.zero;
        expect(v.dot(z)).closeTo(0,glmath.eplison);
    })

    it("dot-perpendicular",()=>{
        let v1 = vec3.Random();
        let v2 = vec3.Random();
        let v3 = v1.cross(v2);
        expect(v1.dot(v3)).closeTo(0,glmath.eplison);
    })

    it('normalize', () => {
        let v = vec3.Random();
        let vn1 = v.Normalize();
        expect(vn1.raw).not.eq(v.raw);
        let vn = v.normalized;
        expect(vn).eq(v);
        expectVec3(vn1, v);
    })

    it("isValid",()=>{
        let v1 = vec3.Random();
        expect(v1.isValid).eq(true);
        let v2 = glmath.vec3(NaN,NaN,1.0);
        expect(v2.isValid).eq(false);
        let v3 = glmath.vec3(NaN,NaN,NaN);
        expect(v3.isValid).eq(false);
        let v4 = glmath.vec3(NaN,1.0,NaN);
        expect(v4.isValid).eq(false);
        let v5 = glmath.vec3(1.0,NaN,NaN);
        expect(v5.isValid).eq(false);
    })
});

