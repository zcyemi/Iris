import { Camera, ClearType, Component, GameObject, Material, MeshRender, Skybox } from "../../iris/core";
import { AssetsDataBase } from "../../iris/core/AssetsDatabase";
import { GameContext } from "../../iris/core/GameContext";
import { MeshPrimitive } from "../../iris/core/MeshPrimitive";
import { ShaderFX } from "../../iris/core/ShaderFX";
import { mat4, quat, vec4, vec3 } from "../../iris/math";
import { SampleBase } from "../sampleBase";
import { CameraFreeFly } from "../../iris";


class SelfRotaComp extends Component{

    private m_rota:quat;

    public onStart(){
        this.m_rota = quat.fromEulerDeg(1.5,-1,0.8);
    }

    public onUpdate(){
        this.gameobject.transform.applyRotate(this.m_rota);
    }
}


export class SampleBasisCube extends SampleBase{
    private m_cube:GameObject;
    private m_camera:GameObject;

    onInit(){
        if(this.m_cube == null){
            let cube = new GameObject("Cube");
            cube.addComponent(new SelfRotaComp());
            this.m_cube = cube;

            cube.transform.setScaleRaw([0.2,0.2,0.2]);

            let bundle = AssetsDataBase.getLoadedBundle("iris");
            let shader = ShaderFX.findShader(bundle,'@sfx/debug');
            let mat = new Material(shader);
            mat.setMainColor(vec4.Random());
            let mesh = MeshPrimitive.Cube;
            let meshRender = new MeshRender(mesh,mat);
            cube.render = meshRender;
        }
        else{
            this.m_cube.active = true;
        }

        if(this.m_camera == null){
            let camera = Camera.CreatePersepctive(60,null,0.01,1000);
            camera.clearType = ClearType.Skybox;
            camera.skybox = Skybox.createFromProcedural();
            camera.background = new vec4([1,0,0,1.0]);
            camera.clearDepth = true;
            camera.depthValue = -1000;
            var camobj = new GameObject("Simpel Camera");
            camobj.transform.applyTranslate(new vec3([0,0,3]));

            camobj.addComponent(camera);
            camobj.addComponent(new CameraFreeFly());
            this.m_camera = camobj;
        }
    }

    onDestroy(){
        this.m_cube.active =false;
        GameContext.current.destroy(this.m_camera);
        this.m_camera = null;
    }
}



window['mat4'] = mat4;
window['vec4'] = vec4;