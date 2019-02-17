import { expectPair } from './testhelper';
import { mat3, quat, vec3, mat4, vec4 } from '../src/math/index';
import * as chai from 'chai';
const expect = chai.expect;


describe("glmath", () => {
    it("colne-mat3", () => {
        let mtx = mat3.fromRS(quat.Random(), vec3.Random());
        let raw = mtx.raw.slice(0);
        let mtxc = mtx.clone();
        let rawclone = mtxc.raw;
        expectPair(raw, rawclone);
        expectPair(mtx.raw, rawclone);
        expect(mtx.raw).not.eq(mtxc.raw);
    });
    it("colne-mat4", () => {
        let mtx = mat4.TRS(vec3.Random(), quat.Random(), vec3.Random());
        let raw = mtx.raw.slice(0);
        let mtxc = mtx.clone();
        let rawclone = mtxc.raw;
        expectPair(raw, rawclone);
        expectPair(mtx.raw, rawclone);
        expect(mtx.raw).not.eq(mtxc.raw);
    });
    it("colne-vec3", () => {
        let v = vec3.Random();
        let vc = v.clone();
        expectPair(v.raw, vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
    it("colne-vec4", () => {
        let v = vec4.Random();
        let vc = v.clone();
        expectPair(v.raw, vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
    it("colne-quat", () => {
        let v = quat.Random();
        let vc = v.clone();
        expectPair(v.raw, vc.raw);
        expect(v.raw).not.eq(vc.raw);
    });
})
