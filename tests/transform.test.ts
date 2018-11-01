import { Trans } from '../src/Trans';
import { vec3, quat, mat4, glmath } from 'wglut';

import { expectVec3, expectQuat, expectPair, expectMat4 } from './testhelper';
import { expect } from 'chai';

describe("Transform", () => {

    it("childrens", () => {
        let t1 = new Trans();
        let t2 = new Trans();
        t2.parent = t1;
        expect(t1.children.length).eq(1);
        expect(t2.parent, 'parent of t2 must be t1').eq(t1);
        t2.parent = null;
        expect(t2.parent, 'set parent null').eq(null);
        expect(t1.children.length).eq(0);

        t1.addChild(t2);
        expect(t2.parent).eq(t1);
        expect(t1.children.length).eq(1);

        t1.removeChild(t2);
        expect(t2.parent).eq(null);
        expect(t1.children.length).eq(0);
    });

    it("local-trs", () => {
        let t = new Trans();

        let pos = vec3.Random();
        let rota = quat.Random();
        let scale = vec3.Random();

        let posc = pos.clone();
        let rotac = rota.clone();
        let scalec = scale.clone();

        t.setPosition(pos, false);
        t.setRotation(rota, false);
        t.setScale(scale);

        pos.mulNum(0.2);
        scale.mulNum(-0.1);
        rota.selfRota(quat.Random());

        expectVec3(posc, t.localPosition);
        expectVec3(scalec, t.localScale);
        expectQuat(rotac, t.localRoataion);
    })

    it("local-mtx", () => {
        let t = new Trans();

        let pos = vec3.Random();
        let rota = quat.Random();
        let scale = vec3.Random();

        t.setPosition(pos, false);
        t.setRotation(rota, false);
        t.setScale(scale);

        let mtx = mat4.TRS(pos, rota, scale);
        let tlocalmtx = t.localMtx;
        expectPair(mtx.raw, tlocalmtx.raw);

        rota = rota.selfRota(quat.Random());
        t.setRotation(rota, false);
        mtx.setTRS(pos, rota, scale);
        expectPair(mtx.raw, t.localMtx.raw);

        pos = pos.add(vec3.Random());
        t.setPosition(pos, false);
        mtx.setTRS(pos, rota, scale);
        expectPair(mtx.raw, t.localMtx.raw);

        scale = scale.add(vec3.Random());
        t.setScale(scale);
        mtx.setTRS(pos, rota, scale);
        expectPair(mtx.raw, t.localMtx.raw);
    })

    it("world-trs-parent-null", () => {
        let t = new Trans();
        let pos = vec3.Random();
        let rota = quat.Random();
        let scale = vec3.Random();

        let posc = pos.clone();
        let rotac = rota.clone();
        let scalec = scale.clone();
        t.setPosition(pos);
        t.setRotation(rota);
        t.setScale(scale);

        pos.mulNum(0.2);
        scale.mulNum(-0.1);
        rota.selfRota(quat.Random());

        expectVec3(posc, t.worldPosition);
        expectVec3(t.worldPosition, t.localPosition);

        expectQuat(rotac, t.worldRotation);
        expectQuat(t.worldRotation, t.localRoataion);

        expectVec3(scalec, t.localScale);
        expectVec3(t.worldScale, t.localScale);
    });

    it("local-world-position", () => {
        let tp = new Trans();
        let tc = new Trans();
        tc.parent = tp;

        let posp = vec3.Random();
        let posc = vec3.Random();

        tp.setPosition(posp);
        tp.setScale(vec3.Random());
        tp.setRotation(quat.Random());

        tc.setPosition(posc, false);
        expectVec3(posc, tc.localPosition);
        let wpos = tp.worldMtx.mulvec(posc.vec4(1.0));
        expectVec3(wpos.vec3(), tc.worldPosition);
    });

    it("mtx",()=>{
        let tp = new Trans();
        let tc = new Trans();

        tp.setPosition(vec3.Random());
        tp.setRotation(quat.Random());
        tp.setScale(vec3.Random());

        let mtxpl = mat4.TRS(tp.localPosition,tp.localRoataion,tp.localScale);
        expectPair(tp.localMtx.raw,mtxpl.raw);
        expectPair(tp.worldMtx.raw,mtxpl.raw);

        tc.setPosition(vec3.Random(),false);
        tc.setRotation(quat.Random(),false);
        tc.setScale(vec3.Random());

        tc.parent = tp;

        let mtxcl = mat4.TRS(tc.localPosition,tc.localRoataion,tc.localScale);
        expectPair(tc.localMtx.raw,mtxcl.raw);
        let mtxcw = tp.worldMtx.mul(tc.localMtx);
        expectMat4(mtxcw,tc.worldMtx);
    })

    it("TRS-change-parent",()=>{
        let tc = new Trans();
        tc.setPosition(vec3.Random());
        tc.setScale(vec3.Random());
        tc.setRotation(quat.Random());

        let tp1 = new Trans();
        tp1.setPosition(vec3.Random());
        tp1.setScale(vec3.Random());
        tp1.setRotation(quat.Random());

        let tcmtxw1 = tc.worldMtx.clone();
        expectMat4(tcmtxw1,tc.localMtx);
        tc.parent = tp1;
        let tcmtxw2 = tc.worldMtx.clone();
        expectMat4(tcmtxw2,tp1.worldMtx.mul(tc.localMtx));

        let tp2 = new Trans();
        tp2.setPosition(vec3.Random());
        tp2.setScale(vec3.Random());
        tp2.setRotation(quat.Random());

        tc.parent = tp2;
        expectMat4(tc.worldMtx,tp2.worldMtx.mul(tc.localMtx));

        tc.parent = null;
        expectMat4(tc.worldMtx,tc.localMtx);
    })

    // it("local-world-rotation", () => {
    //     let tp = new Trans();
    //     let tc = new Trans();
    //     tc.parent = tp;

    //     let rotac = quat.fromEulerDeg(30, 20, 70);
    //     let rotap = quat.fromEulerDeg(-30, 20, 70);

    //     //tp.setPosition(vec3.Random());
    //     //let s = new vec3([0.4093266829772244,-0.2521217534790319,-0.020216660723659352]);
    //     tp.setScale(glmath.vec3(1,2,1));
    //     tp.setRotation(rotap);
    //     tc.setRotation(rotac, false);

    //     let dir = vec3.up;
    //     let dirRota = tc.worldRotation.rota(dir.mulToRef(tc.worldScale)).normalize;

    //     let dirRotaVerify = tp.worldMtx.mul(tc.localMtx).mulvec(dir.vec4(0)).vec3().normalize;
    // })

});