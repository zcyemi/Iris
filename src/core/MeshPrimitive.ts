import { GL } from "../gl";
import { Mesh, MeshTopology, MeshVertexAttrDesc } from "./Mesh";
import { AttrSemantic } from "./ShaderFX";

export class MeshPrimitive {
    private static s_quad: Mesh;
    private static s_cube: Mesh;
    private static s_sphere: Mesh;

    public static get Quad(): Mesh {
        if (MeshPrimitive.s_quad != null) return MeshPrimitive.s_quad;
        let quad = new Mesh();
        MeshPrimitive.s_quad = quad;

        let dataPosition = new Float32Array([
            -0.5, -0.5, 0, 1,
            0.5, -0.5, 0, 1,
            -0.5, 0.5, 0, 1,
            0.5, 0.5, 0, 1
        ]);
        let dataIndices = new Uint16Array([
            0, 1, 2,
            1, 3, 2
        ]);
        let dataUV = new Float32Array([
            0.0, 1.0,
            1.0, 1.0,
            0.0, 0.0,
            1.0, 0.0
        ]);

        quad.dataVertices[AttrSemantic.POSITION_0] = dataPosition;
        quad.dataVertices[AttrSemantic.TEXCOORD_0] = dataUV;
        quad.dataIndices = dataIndices;
        quad.name = "quad";
        let vertexdesc = quad.vertexDesc;
        vertexdesc.POSITION_0 = new MeshVertexAttrDesc(GL.FLOAT, 4, dataPosition.length * 4);
        vertexdesc.TEXCOORD_0 = new MeshVertexAttrDesc(GL.FLOAT, 2, dataUV.length * 4);
        quad.indiceDesc.set(MeshTopology.Triangles, dataIndices.length, GL.UNSIGNED_SHORT, 0);

        quad.calculateNormal();
        return quad;
    }

    public static get Sphere(): Mesh {
        if (MeshPrimitive.s_sphere != null) return MeshPrimitive.s_sphere;
        let sphere = new Mesh('sphere');
        MeshPrimitive.s_sphere = sphere;

        let slicey = 16;
        let slicer = slicey * 2;

        let radstep = Math.PI / slicey;

        let rad = -Math.PI / 2.0 + radstep;

        let positions: number[] = [];
        let uvs: number[] = [];

        let pcount = (slicey - 1) * (slicer + 1) + 2;
        positions.push(.0, -1.0, .0, 1.0);
        uvs.push(0.5, 0.0);

        for (let t = 1; t < slicey; t++) {
            let y = Math.sin(rad);
            let d = Math.cos(rad);

            let yaw = 0;

            let v = t * 1.0 / slicey;

            for (let s = 0; s <= slicer; s++) {
                let x = d * Math.cos(yaw);
                let z = d * Math.sin(yaw);
                positions.push(x, y, z, 1.0);
                uvs.push(s * 1.0 / slicer, v);
                yaw += radstep;
            }
            rad += radstep;
        }
        positions.push(.0, 1.0, .0, 1.0);
        uvs.push(0.5, 1.0);

        let indices: number[] = [];
        {
            //bottom
            for (let t = 1, tbmax = slicer; t <= tbmax; t++) {
                indices.push(0, t, t + 1);
            }
            //center
            let slicerlayer = slicer + 1;
            for (let t = 0; t < slicey - 2; t++) {
                let ib = 1 + t * slicerlayer;
                let it = ib + slicerlayer;
                for (let s = 0; s < slicerlayer; s++) {
                    let ibs = ib + s;
                    let its = it + s;
                    indices.push(ibs, ibs + 1, its + 1, ibs, its + 1, its);
                }
            }
            //top
            let imax = pcount - 1;
            let istart = imax - slicer - 1;
            for (let t = istart, ttmax = imax; t < ttmax; t++) {
                indices.push(imax, t, t + 1);
            }
        }

        let dataposition = new Float32Array(positions);
        sphere.dataVertices[AttrSemantic.POSITION_0] = dataposition;
        let dataindices = new Uint16Array(indices);
        sphere.dataIndices = dataindices;
        let datauv = new Float32Array(uvs);
        sphere.dataVertices[AttrSemantic.TEXCOORD_0] = datauv;
        sphere.dataVertices[AttrSemantic.NORMAL_0] = dataposition;

        let vertexdesc = sphere.vertexDesc;
        vertexdesc.POSITION_0 = new MeshVertexAttrDesc(GL.FLOAT, 4, dataposition.byteLength);
        vertexdesc.NORMAL_0 = new MeshVertexAttrDesc(GL.FLOAT, 4, dataposition.byteLength);
        vertexdesc.TEXCOORD_0 = new MeshVertexAttrDesc(GL.FLOAT, 2, datauv.byteLength);
        sphere.indiceDesc.set(MeshTopology.Triangles, indices.length, GL.UNSIGNED_SHORT, 0);

        return sphere;
    }

    public static get Cube(): Mesh {
        if (MeshPrimitive.s_cube != null) return MeshPrimitive.s_cube;

        let cube = new Mesh();
        MeshPrimitive.s_cube = cube;

        let dataPosition = new Float32Array([
            -1, 1, 1, 1,
            1, 1, 1, 1,
            -1, -1, 1, 1,
            1, -1, 1, 1,

            1, 1, 1, 1,
            1, 1, -1, 1,
            1, -1, 1, 1,
            1, -1, -1, 1,

            1, 1, -1, 1,
            -1, 1, -1, 1,
            1, -1, -1, 1,
            -1, -1, -1, 1,

            -1, 1, -1, 1,
            -1, 1, 1, 1,
            -1, -1, -1, 1,
            -1, -1, 1, 1,

            - 1, 1, -1, 1,
            1, 1, -1, 1,
            -1, 1, 1, 1,
            1, 1, 1, 1,

            -1, -1, 1, 1,
            1, -1, 1, 1,
            -1, -1, -1, 1,
            1, -1, -1, 1,
        ]);
        let dataUV = new Float32Array(48);
        for (var i = 0; i < 6; i++) {
            dataUV.set([0, 1, 1, 1, 0, 0, 1, 0], i * 8);
        }

        let dataIndices: number[] = [];
        for (let i = 0; i < 6; i++) {
            let k = i * 4;
            dataIndices.push(k, k + 1, k + 2, k + 1, k + 3, k + 2);
        }

        cube.dataIndices = new Uint16Array(dataIndices);
        cube.dataVertices[AttrSemantic.POSITION_0] = dataPosition;
        cube.dataVertices[AttrSemantic.TEXCOORD_0] = dataUV;
        cube.name = "cube";

        let vertexdesc = cube.vertexDesc;
        vertexdesc.POSITION_0 = new MeshVertexAttrDesc(GL.FLOAT, 4, dataPosition.length * 4);
        vertexdesc.TEXCOORD_0 = new MeshVertexAttrDesc(GL.FLOAT, 2, dataUV.length * 4);

        cube.indiceDesc.set(MeshTopology.Triangles, dataIndices.length, GL.UNSIGNED_SHORT, 0);

        cube.calculateNormal();
        return cube;
    }
}