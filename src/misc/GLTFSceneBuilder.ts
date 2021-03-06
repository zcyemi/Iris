import { GameObject } from "../core/GameObject";
import { Mesh, MeshDataBuffer, MeshVertexAttrDesc, MeshDataBufferIndices, MeshBufferUtility } from "../core/index";
import { MeshRender } from "../core/MeshRender";
import { GL } from "../gl/GL";
import { Material } from "../core/Material";
import { ShaderFXLibs } from "../shaderfx/ShaderFXLibs";
import { Shader, ShaderTags, CullingMode, BlendOperator, RenderQueue } from "../shaderfx/Shader";
import { Texture2D } from "../core/Texture2D";
import { GLTFdata, GLTFfile, GLTFnode } from "../gl/GLTFtool";
import { GLContext } from "../gl/GLContext";
import { glmath, quat, mat4, vec4 } from "../math/GLMath";


export class GLTFSceneBuilder{


    private m_gltfData:GLTFdata;
    private m_glctx:GLContext;
    private m_shaderfxlib:ShaderFXLibs;
    private m_pbrShader:Shader;
    private m_pbrBlendShader:Shader;

    private gltf:GLTFfile;

    private buffers:{[index:number]:MeshDataBuffer} = {};
    private buffersDesc:{[index:number]:MeshVertexAttrDesc} = {};

    private materials:{[index:number]:Material} = {};
    private images:{[index:number]:Texture2D} = {};

    public constructor(gltfdata:GLTFdata,glctx:GLContext,shaderlib:ShaderFXLibs){
        this.m_gltfData = gltfdata;
        this.m_glctx = glctx;
        this.m_shaderfxlib = shaderlib;

        this.m_pbrShader = shaderlib.shaderDiffuse;
        this.m_pbrBlendShader = shaderlib.shaderDiffuse;

        this.gltf= gltfdata.gltf;
    }

    public release(){

    }

    public createScene():GameObject{
        let gltf = this.gltf;
        let scenes = gltf.scenes;
        if(scenes == null) return null;

        let scene = scenes[gltf.scene];

        let nodes = gltf.nodes;

        var scenenodes = scene.nodes;

        let gsceneobj = new GameObject();

        for(let i=0,nodeslen = scenenodes.length;i<nodeslen;i++){
            let gobj = this.buildNode(nodes,scenenodes[i]);
            if(gobj != null){
                gobj.transform.parent = gsceneobj.transform;
            }
        }

        let gstrs = gsceneobj.transform;
        //gstrs.setScale(glmath.vec3(0.001,0.001,0.001));

        return gsceneobj;
    }

    private buildNode(nodes:GLTFnode[],index:number): GameObject{
        let _node= nodes[index];
        
        if(_node == null){
            console.error(nodes);
            console.error(index);
            throw new Error(`invalid node`);
        }

        var gobj = new GameObject();
        gobj.name = _node.name;
        if(_node.rotation){
            gobj.transform.setRotation(new quat(_node.rotation));
        }
        else if(_node.matrix){
            //Set matrix
            //TODO
            gobj.transform.localMatrix = new mat4( _node.matrix);
        }


        //gobj.transform.localScale = glmath.vec3(0.001,0.001,0.001);
        if(_node.mesh != undefined){
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
                    g.transform.parent= gobj.transform;
                }
            }
        }
        return gobj;
    }

    public getMesh(meshid:number):MeshRender{

        let _meshes = this.gltf.meshes;
        if(_meshes == null) return null;

        let _mesh = _meshes[meshid];
        if(_mesh == null) return null;

        var _primitives = _mesh.primitives;
        if(_primitives == null) return null;

        let mesh = new Mesh();
        mesh.name = _mesh.name;

        //TODO
        let _primitive = _primitives[0];
        let _attribute = _primitive.attributes;


        if(_attribute['NORMAL'] != null){
            let index=  _attribute['NORMAL'];
            let buffer = this.getBuffer(index);
            let desc = this.buffersDesc[index];
            mesh.setNormal(buffer,desc.type,desc.size);
        }

        if(_attribute['POSITION']!= null){
            let index = _attribute['POSITION'];
            let buffer = this.getBuffer(index);
            let desc = this.buffersDesc[index];
            mesh.setPosition(buffer,desc.type,desc.size);
        }

        if(_attribute['TEXCOORD_0']!= null){
            let index = _attribute['TEXCOORD_0'];
            let buffer = this.getBuffer(index);
            let desc = this.buffersDesc[index];
            mesh.setUV(buffer,desc.type,desc.size);
        }

        if(_attribute['TANGENT'] !=null){
            //TODO
        }

        //Indices
        {
            let index= _primitive.indices;
            if(index != null){
                let buffer = this.getBuffer(index);
                let desc = this.buffersDesc[index];
                let mode = _primitive.mode == null? 4:_primitive.mode;
                mesh.setIndices(<MeshDataBufferIndices>buffer,desc.type,mode);
            }
        }

        let mat:Material = null;

        let matid = _primitive.material;
        if(matid != null){
            mat = this.getMaterial(_primitive.material);
        }

        let meshrender = new MeshRender(mesh,mat);
        return meshrender;
    }

    private getBuffer(bufferindex:number){
        let buffers = this.buffers;
        let cbuffer = buffers[bufferindex];
        if(cbuffer!= null){
             return cbuffer;
        }

        let _accessors = this.gltf.accessors;
        let _accessor = _accessors[bufferindex];


        let _bufferview = this.gltf.bufferViews[_accessor.bufferView];
        if(_bufferview == null){
            console.error(_accessor);
            console.error(this.gltf.bufferViews[_accessor.bufferView]);
            throw new Error('buffer view is null');
        }
        let rawBuffer = this.m_gltfData.rawBinary;


        let dataType = _accessor.componentType;

        let dataBuffer: MeshDataBuffer = null;

        let dataBufferOffset = 0;
        if(_accessor.byteOffset != null) dataBufferOffset += _accessor.byteOffset;
        if(_bufferview.byteOffset != null) dataBufferOffset += _bufferview.byteOffset;

        let sizeType = _accessor.type;
        let size = this.getSize(sizeType);

        let componentLength = _accessor.count * size;

        if(dataType == GL.FLOAT){
            dataBuffer = new Float32Array(rawBuffer,dataBufferOffset,componentLength);
        }else if(dataType == GL.UNSIGNED_INT){
            dataBuffer = new Uint32Array(rawBuffer,dataBufferOffset,componentLength);
        }
        else if(dataType == GL.UNSIGNED_SHORT){
            dataBuffer = new Uint16Array(rawBuffer,dataBufferOffset,componentLength);
        }
        else{
            throw new Error("buffer datatype not supported." + dataType);
        }

        let totalbyte = componentLength * MeshBufferUtility.TypeSize(dataType);

        this.buffers[bufferindex] = dataBuffer;
        this.buffersDesc[bufferindex] = new MeshVertexAttrDesc(dataType,size,totalbyte);

        return dataBuffer;
    }


    private getSize(type:string):number{
        switch(type){
            case "SCALAR":
                return 1;
            case "VEC2":
                return 2;
            case "VEC3":
                return 3;
            case "VEC4":
                return 4;
            case "MAT2":
                return 4;
            case "MAT3":
                return 9;
            case "MAT4":
                return 16;
        }
        throw new Error(`invalid type ${type}`);
    }

    private getMaterial(index:number):Material{

        let _materials = this.gltf.materials;
        if(_materials == null) return null;

        let _material = _materials[index];

        let mat = new Material(this.m_pbrShader);
        mat.name= _material.name;

        let shadertags:ShaderTags= null;
        let shadertagsOverride:boolean = false;

        let matDoubleSided = _material.doubleSided;
        if(matDoubleSided == true){
            if(shadertags == null) shadertags = new ShaderTags();
            shadertags.culling = CullingMode.None;
            shadertagsOverride = true;
        }

        let alphaMode = _material.alphaMode;
        if(alphaMode == "BLEND"){
            if(shadertags == null) shadertags = new ShaderTags();
            shadertags.blendOp = BlendOperator.ADD;
            shadertags.queue = RenderQueue.Transparent;
            shadertagsOverride = true;

            mat.setShader(this.m_pbrBlendShader);
        }

        if(shadertagsOverride){

            if(shadertags.queue == null) shadertags.queue = RenderQueue.Opaque;
            mat.shaderTags = shadertags;
        }

        //pbr property
        let _pbrMetallicRoughness = _material.pbrMetallicRoughness;
        if(_pbrMetallicRoughness != null){

            let _baseCOlorFactor = _pbrMetallicRoughness.baseColorFactor
            if(_baseCOlorFactor != null){
                mat.setColor(ShaderFXLibs.SH_PBR_BaseColorFactor,new vec4(_baseCOlorFactor));
            }

            let _baseColorTexture = _pbrMetallicRoughness.baseColorTexture;
            if(_baseColorTexture != null){
                let tex = this.getImage(_baseColorTexture.index);
                if(tex !=null) mat.setTexture(ShaderFXLibs.SH_PBR_BaseColorTexture,tex);
            }

            let _metallicFactor = _pbrMetallicRoughness.metallicFactor;
            if(_metallicFactor != null){
                mat.setFloat(ShaderFXLibs.SH_PBR_MetallicFactor,_metallicFactor);
            }

            let _roughnessFactor = _pbrMetallicRoughness.roughnessFactor;
            if(_roughnessFactor != null){
                mat.setFloat(ShaderFXLibs.SH_PBR_RoughnessFactor,_roughnessFactor);
            }

            let _metallicRoughnessTexture = _pbrMetallicRoughness.metallicRoughnessTexture;
            if(_metallicRoughnessTexture != null){
                let tex = this.getImage(_metallicRoughnessTexture.index);
                mat.setTexture(ShaderFXLibs.SH_PBR_MetallicRoughnessTexture,tex);
            }
        }

        //emissive property
        let _emissiveFactor = _material.emissiveFactor;
        if(_emissiveFactor != null){
            mat.setColor(ShaderFXLibs.SH_PBR_EmissiveFactor,glmath.vec4(_emissiveFactor[0],_emissiveFactor[1],_emissiveFactor[2],0));
        }
        let _emissiveTexture = _material.emissiveTexture;
        if(_emissiveTexture != null){
            let tex = this.getImage(_emissiveTexture.index);
            mat.setTexture(ShaderFXLibs.SH_PBR_EmissiveTexture,tex);
        }

        this.materials[index] = mat;
        return mat;
    }

    public getImage(index:number){
        let img = this.images[index];
        if(img != null){
            return img;
        }

        let _images = this.gltf.images;
        let _image = _images[index];

        let mime = _image.mimeType ;
        if(mime != "image/png" && mime !="image/jpg"){
            throw new Error(`invalid mime type ${mime}`);
        }

        let _bufferview = this.gltf.bufferViews[_image.bufferView];
        if(_bufferview == null){
            return null;
        }
        let rawBuffer = this.m_gltfData.rawBinary;
        let uint8array = new Uint8Array(rawBuffer,_bufferview.byteOffset,_bufferview.byteLength);

        let texture = Texture2D.createTextureSync(uint8array,_image.mimeType,this.m_glctx);
        this.images[index] = texture;
        return texture;
    }
}
