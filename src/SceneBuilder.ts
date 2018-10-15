import { GLTFdata, GLContext, GLTFnode, quat, GLTFfile } from "wglut";
import { Scene } from "./Scene";
import { GameObject } from "./GameObject";
import { Mesh } from "./Mesh";
import { MeshRender } from "./MeshRender";


export class SceneBuilder{


    private m_gltfData:GLTFdata;
    private m_glctx:GLContext;

    private gltf:GLTFfile;

    private buffers:{[index:number]:ArrayBuffer} = {};

    public constructor(gltfdata:GLTFdata,glctx:GLContext){
        this.m_gltfData = gltfdata;
        this.m_glctx = glctx;
        this.gltf= gltfdata.gltf;
    }

    public createScene(gltfdata:GLTFdata,glctx:GLContext):Scene{

        let gltf = gltfdata.gltf;
        let scenes = gltf.scenes;
        if(scenes == null) return null;

        let scene = scenes[gltf.scene];

        let nodes = gltf.nodes;

        var scenenodes = scene.nodes;

        let gscene = new Scene();

        for(let i=0,nodeslen = scenenodes.length;i<nodeslen;i++){
            let gobj = this.buildNode(nodes,nodeslen[i]);
            if(gobj != null){
                gscene.addChild(gobj);
            }
        }


        return null;
    }
    
    private buildNode(nodes:GLTFnode[],index:number): GameObject{
        let _node= nodes[index];

        var gobj = new GameObject();
        gobj.name = _node.name;
        if(_node.rotation){
            gobj.transform.setRotation(new quat(_node.rotation));
        }
        else if(_node.matrix){
            //Set matrix
            //TODO
            gobj.transform.ObjMatrix.raw = _node.matrix.slice(0);
        }

        if(_node.mesh){
            let meshrender = this.getMesh(_node.mesh);
            if(meshrender != null){
                gobj.render = meshrender;
            }
        }

        let _nodeChildren = _node.children;
        if(_nodeChildren!= null && _nodeChildren.length>0){
            for(let i=0,len = _nodeChildren.length;i< len;i++){
                let g = this.buildNode(nodes,_nodeChildren[i]);
                if(g != null){
                    gobj.addChild(g);
                }
            }
        }
        return gobj;
    }

    private getMesh(meshid:number):MeshRender{

        let _meshes = this.gltf.meshes;
        if(_meshes == null) return null;

        let _mesh = _meshes[meshid];
        if(_mesh == null) return null;

        var _primitives = _mesh.primitives;
        if(_primitives == null) return null;

        let mesh = new Mesh();
        mesh.name = _mesh.name;



        return null;
    }

    private getBuffer(bufferindex:number){
        let buffers = this.buffers;
        let cbuffer = buffers[bufferindex];
        if(cbuffer!= null){
             return cbuffer;
        }

        let _accessors = this.gltf.accessors;
        let _accessor = _accessors[bufferindex];
        

        let _bufferview = this.gltf.bufferViews[_accessor.bufferview];
        let rawBuffer = this.m_gltfData.rawBinary;

        let datview = new DataView(rawBuffer,_bufferview.byteOffset,_bufferview.byteLength);
    }
}