import { vec3, quat, f32, mat4 } from "./GLMath";


export class Frustum{

    public top:f32;
    public bottom:f32;
    public left:f32;
    public right:f32;
    public near:f32;
    public far:f32;

    public static fromPerspectiveMtx(mtx:mat4):Frustum{
        let frustum = new Frustum();
        let mraw = mtx.raw;
        let a = mraw[10];
        let n = mraw[14]/(a-1);
        let n2 = n*2;
        let f = n - (a+1)/n2;
        let w =n2 / mraw[0];
        let h = n2 / mraw[5];

        frustum.near = n;
        frustum.far = f;
        frustum.left = w /2.0;
        frustum.right = frustum.left;
        frustum.top = h /2.0;
        frustum.bottom = h/ 2.0;
        return frustum;
    }


}