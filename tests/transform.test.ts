import { Trans } from '../src/Trans';
import { vec3, quat, mat4, glmath } from 'wglut';

import{ expectVec3, expectQuat, expectPair} from './testhelper';
import { expect} from 'chai';

describe("Transform",()=>{

    it("childrens",()=>{
        let t1 = new Trans();
        let t2 = new Trans();
        t2.parent= t1;
        expect(t1.children.length).eq(1);
        expect(t2.parent,'parent of t2 must be t1').eq(t1);
        t2.parent = null;
        expect(t2.parent,'set parent null').eq(null);
        expect(t1.children.length).eq(0);

        t1.addChild(t2);
        expect(t2.parent).eq(t1);
        expect(t1.children.length).eq(1);

        t1.removeChild(t2);
        expect(t2.parent).eq(null);
        expect(t1.children.length).eq(0);
    });

    it("local-trs",()=>{
        let t = new Trans();

        let pos = vec3.Random();
        let rota = quat.Random();
        let scale = vec3.Random();

        let posc = pos.clone();
        let rotac = rota.clone();
        let scalec = scale.clone();

        t.setPosition(pos,false);
        t.setRotation(rota,false);
        t.setScale(scale);

        pos.mulNum(0.2);
        scale.mulNum(-0.1);
        rota.selfRota(quat.Random());

        expectVec3(posc,t.localPosition);
        expectVec3(scalec,t.localScale);
        expectQuat(rotac,t.localRoataion);
    })

    it("local-mtx",()=>{
        let t= new Trans();

        let pos = vec3.Random();
        let rota = quat.Random();
        let scale = vec3.Random();

        t.setPosition(pos,false);
        t.setRotation(rota,false);
        t.setScale(scale);

        let mtx = mat4.TRS(pos,rota,scale);
        let tlocalmtx = t.localMtx;
        expectPair(mtx.raw,tlocalmtx.raw);

        rota = rota.selfRota(quat.Random());
        t.setRotation(rota,false);
        mtx.setTRS(pos,rota,scale);
        expectPair(mtx.raw,t.localMtx.raw);

        pos = pos.add(vec3.Random());
        t.setPosition(pos,false);
        mtx.setTRS(pos,rota,scale);
        expectPair(mtx.raw,t.localMtx.raw);

        scale = scale.add(vec3.Random());
        t.setScale(scale);
        mtx.setTRS(pos,rota,scale);
        expectPair(mtx.raw,t.localMtx.raw);
    })

    it("world-trs-parent-null",()=>{
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

        expectVec3(posc,t.worldPosition);
        expectVec3(t.worldPosition,t.localPosition);

        expectQuat(rotac,t.worldRotation);
        expectQuat(t.worldRotation,t.localRoataion);
    
        expectVec3(scalec,t.localScale);
        expectVec3(t.worldScale,t.localScale);
    });

    it("local-world-position",()=>{
        let tp = new Trans();
        let tc = new Trans();
        tc.parent = tp;

        tp.setPosition(glmath.vec3(10,20,30));
        tc.setPosition(glmath.vec3(-10,20,-30));

        console.log(tc.worldPosition);
    });

    /** @todo */
    it("local-trs-with-parent",()=>{

        console.log('local-trs-with-parent');

        let tp = new Trans();
        let ppos = vec3.Random();
        let prota = quat.Random();
        let pscale = vec3.Random();
        tp.setPosition(ppos);
        tp.setScale(pscale);
        tp.setRotation(prota);

        let tc= new Trans();
        let cpos = vec3.Random();
        let crota= quat.Random();
        let cscale = vec3.Random();
        tc.setPosition(cpos,false);
        tc.setRotation(crota,false);
        tc.setScale(cscale);

        tc.parent = tp;

        let tc_wpos = tc.worldPosition.clone();

        let tc_wposc = tp.worldPosition.addToRef(tp.worldRotation.rota(tc.localPosition));
    })
});