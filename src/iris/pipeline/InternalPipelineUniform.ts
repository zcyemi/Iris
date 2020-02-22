import { ShaderData, ShaderBuffer, ShaderProperty, InitProp, ShaderUniformData } from "../core/ShaderBuffer";
import { vec4, mat4 } from "../math";
import { PropertyUpdater, Utility } from "../core";
import { extname } from "path";

export class ShaderDataBasis extends ShaderData {
    public screenParam: ShaderProperty<vec4> = InitProp(16,vec4, "_screenparam_");
    public time: ShaderProperty<vec4> = InitProp(16,vec4, "_time_");
   
    public ambientColor:ShaderProperty<vec4> =InitProp(16,vec4,'_ambientcolor_');
    public fogColor:ShaderProperty<vec4> = InitProp(16,vec4,'_fogcolor_');
    public fogParam:ShaderProperty<vec4> = InitProp(16,vec4,'_fogparam_');

    constructor() {
        super();
        this.setupProp();
    }
}


export class ShaderDataCamera extends ShaderData {

    public cameraPos: ShaderProperty<vec4> = InitProp(16,vec4, "_camera_pos_");
    public cameraMtxView: ShaderProperty<mat4> = InitProp(64,mat4, "_camera_mtx_view_");
    public cameraProjParam:ShaderProperty<vec4> =InitProp(16,vec4,"_camera_projparam_");
    public cameraMtxProj:ShaderProperty<mat4> = InitProp(64,mat4,"_camera_projparam_");
    public cameraMtxInvProj:ShaderProperty<mat4> = InitProp(64,mat4,"_camera_projparam_");

    constructor() {
        super();
        this.setupProp();
    }

}

export class ShaderDataObj extends ShaderData {

    public obj2world:ShaderProperty<mat4> = InitProp(64,mat4,'_obj2world_',mat4.Identity);

    constructor() {
        super();
        this.setupProp();
    }
}

export class UniformDataObj extends ShaderUniformData{
    public obj2world:mat4 = this.initProperty("obj2world",mat4,mat4.IdentityCached);

}

export class UniformDataBasis extends ShaderUniformData{
    //[width,height,1/wdith,1/height]
    public screenParam:vec4 = this.initProperty("screenParam",vec4);
    //[Time,deltaTime,sinTime,cosTime]
    public time:vec4 = this.initProperty("time",vec4);
    public ambientColor:vec4 = this.initProperty("ambientColor",vec4);
    public fogColor:vec4 = this.initProperty("fogColor",vec4);
    public fogParam:vec4 = this.initProperty("fogParam",vec4);
}

export class UniformDataCamera extends ShaderUniformData{
    public cameraPos:vec4 = this.initProperty("cameraPos",vec4);
    public cameraMtxView:mat4 = this.initProperty("cameraMtxView",mat4);
    //[near,far,1/near,1/far]
    public cameraProjParam:vec4 = this.initProperty("cameraProjParam",vec4);
    public cameraMtxProj:mat4 = this.initProperty("cameraMtxProj",mat4);
    public cameraMtxProjInv:mat4 = this.initProperty("cameraMtxProjInv",mat4);
}

export class ShaderDataLight extends ShaderData{

    public lightColor0:ShaderProperty<vec4> = InitProp(16,vec4,'lightColor0',vec4.one);
    public lightColor1:ShaderProperty<vec4> = InitProp(16,vec4,'lightColor1',vec4.one);
    public lightColor2:ShaderProperty<vec4> = InitProp(16,vec4,'lightColor2',vec4.one);
    public lightColor3:ShaderProperty<vec4> = InitProp(16,vec4,'lightColor3',vec4.one);

    public lightIntensity:ShaderProperty<vec4> = InitProp(16,vec4,'lightIntensity',vec4.one);

    public lightPosX:ShaderProperty<vec4> = InitProp(16,vec4,'lightPosX',vec4.one);
    public lightPosY:ShaderProperty<vec4> = InitProp(16,vec4,'lightPosY',vec4.one);
    public lightPosZ:ShaderProperty<vec4> = InitProp(16,vec4,'lightPosZ',vec4.one);
    
    public light_ambient:ShaderProperty<vec4> = InitProp(16,vec4,'light_ambient',vec4.one);
    public lightPrimePos:ShaderProperty<vec4> = InitProp(16,vec4,'lightPrimePos',vec4.one);
    public lightPrimeColor:ShaderProperty<vec4> = InitProp(16,vec4,'lightPrimeColor',vec4.one);

    constructor() {
        super();
        this.setupProp();
    }


}