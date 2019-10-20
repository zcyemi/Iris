import { Component, Texture2D, GraphicsContext, Camera, Shader, Material, TextureDescUtility, TextureCreationDesc, MaterialPorpertyBlock, CameraCommandList } from "../core";
import { AssetsDataBase } from "../core/AssetsDatabase";
import { CommandBuffer, CommandBufferEvent } from "../core/CommandBuffer";
import { vec4, vec2 } from "../math";
import { ShaderFX } from "../core/ShaderFX";
import { GL } from "../gl";
import { Graphics } from "../core/Graphics";
import { GameTime } from "../core/GameTime";
import { Input } from "../misc";



export class SampleTextureRendering  extends Component{
    constructor() {
        super();
    }


    private SIM_SIZE:number = 512;

    private matAdvect:Material;
    private matForce:Material;
    private matJacobi1D:Material;
    private matJacobi2D:Material;
    private matProjFinish:Material;
    private matProjSetup:Material;
    private matFluid:Material;


    private texV1:Texture2D;
    private texV2:Texture2D;
    private texV3:Texture2D;
    
    private texP1:Texture2D;
    private texP2:Texture2D;

    private colRT1:Texture2D;
    private colRT2:Texture2D;

    private m_dx:number;
    private m_difAlphaPrec:number;

    private m_viscosity:number = 0.000001;
    private m_force:number = 300;
    private m_exponent:number = 200;

    private m_inited:boolean = false;
    private m_img:Texture2D;

    async onStart(){

        let bundle = AssetsDataBase.getLoadedBundle("iris");
        let img:Texture2D = await Texture2D.loadTexture2D("resource/testImg.png",false);

        this.m_img = img;


        const glctx = GraphicsContext.glctx;
        let avail_exts = glctx.getSupportExtensions();

        const EXT_color_buffer_float = "EXT_color_buffer_float";
        const OES_texture_float_linear ="OES_texture_float_linear";

        if(!avail_exts.includes(EXT_color_buffer_float) || !avail_exts.includes(OES_texture_float_linear)){
            console.log("Fluid Simulation not supported");
            return;
        }

        glctx.getExtension(EXT_color_buffer_float);
        glctx.getExtension(OES_texture_float_linear);

        this.matAdvect = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/advect"));
        this.matForce = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/force"));
        this.matJacobi1D = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/jacobi1d"));
        this.matJacobi2D = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/jacobi2d"));
        this.matProjFinish = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/projFinish"));
        this.matProjSetup = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/projSetup"))
        this.matFluid = new Material(ShaderFX.findShader(bundle,"@shaderfx/stableFluid/fluid"));


        let size = this.SIM_SIZE;

        let glconst = glctx.raw;

        let descRG32F:TextureCreationDesc = {internalformat:glconst.RG32F,format:glconst.RG};
        let descR32F:TextureCreationDesc = {internalformat: glconst.R32F,format:glconst.RED};
        let descRGBA8:TextureCreationDesc = {internalformat:glconst.RGBA8,format:glconst.RGBA};

        this.texV1 = Texture2D.createTexture2D(size,size,descRG32F,glctx);
        this.texV2 = Texture2D.createTexture2D(size,size,descRG32F,glctx);
        this.texV3 = Texture2D.createTexture2D(size,size,descRG32F,glctx);

        this.texP1 = Texture2D.createTexture2D(size,size,descR32F,glctx);
        this.texP2 = Texture2D.createTexture2D(size,size,descR32F,glctx);

        this.colRT1 = Texture2D.createTexture2D(size,size,descRGBA8,glctx);
        this.colRT2 = Texture2D.createTexture2D(size,size,descRGBA8,glctx);


        Graphics.blit(img,this.colRT2);

        let dx = 1.0/ this.SIM_SIZE;
        this.m_dx = dx;
        this.m_difAlphaPrec = dx* dx/ this.m_viscosity;


        this.m_inited =true;

        this.setupCommandBuffer();
    }

    private setupCommandBuffer(){
        let cmdbuffer = new CommandBuffer("stable fluid");

        //advect
        cmdbuffer.blit(this.texV1,this.texV2,this.matAdvect);

        //diffuse
        cmdbuffer.blit(this.texV2,this.texV1);

        for(let t=0;t<20;t++){
            cmdbuffer.blit(this.texV2,this.texV3,this.matJacobi2D);
            cmdbuffer.blit(this.texV3,this.texV2,this.matJacobi2D);
        }

        //force
        cmdbuffer.blit(this.texV2,this.texV3,this.matForce);
        cmdbuffer.blit(this.texV3,this.texV1);
        
        //PROJECT
        cmdbuffer.blit(this.texV3,this.texV2,this.matProjSetup);
        //clear P1 to 0
        cmdbuffer.blit(null,this.texP1,null);
        //jacobi 1D
        for(let t=0;t<20;t++){
            cmdbuffer.blit(this.texP1,this.texP2,this.matJacobi1D);
            cmdbuffer.blit(this.texP2,this.texP1,this.matJacobi1D);
        }

        //projFinish
        cmdbuffer.blit(this.texP1,this.texV1,this.matProjFinish);

        //fluid
        cmdbuffer.blit(this.colRT1,this.colRT2,this.matFluid);
        cmdbuffer.drawScreenTexture(this.colRT2);


        //submit
        cmdbuffer.submit();

        let camera = this.gameobject.getComponent(Camera);
        camera.cmdList.add(CommandBufferEvent.beforePostProcess,cmdbuffer);

    }

    onUpdate(){
        

        if(!this.m_inited) return;

        //Texture2D.SwapContent(this.colRT2,this.colRT1)

        this.processInput();

        let ts = GameTime.time;
        let dt = GameTime.deltaTime;

        const glctx =  GraphicsContext.glctx;


        let mousepos = Input.snapshot.mousepos;

        //update advect
        this.matAdvect.setFloat('uDeltaTime',dt);

        
        //diffuse
        let dif_alpha = this.m_difAlphaPrec/ dt;
        let alpha = dif_alpha;
        let beta = alpha +4;

        this.matJacobi2D.setFloat('uAlpha',alpha);
        this.matJacobi2D.setFloat('uBeta',beta);
        this.matJacobi2D.setTexture('uSampler1',this.texV1);
        

        //add force

        let force = this.processInput();

        this.matForce.setFloat("uForceExponent",this.m_exponent);
        this.matForce.setVec2('uForceOrigin',mousepos.x,mousepos.y);
        this.matForce.setVec2('uForceVector',force[0],force[1]);

        //proj
        let dx = this.m_dx;
        let alpha1d =  -dx * dx;
        let beta1d = 4;
        this.matJacobi1D.setFloat('uAlpha',alpha1d);
        this.matJacobi1D.setFloat('uBeta',beta1d);
        this.matJacobi1D.setTexture('uSampler1',this.texV2);

        //proj finish

        this.matProjFinish.setTexture('uSampler1',this.texV3);

        //fluid

        this.matFluid.setTexture('uSampler1',this.texV1);
        this.matFluid.setFloat('uDeltaTime',dt);
        this.matFluid.setFloat('uForceExponent',this.m_exponent);
        this.matFluid.setVec2('uForceOrigin',mousepos.x,mousepos.y);
       
    }


    private m_onMouseDrag:boolean = false;

    private processInput():number[]{


        let input = Input.snapshot;

        let force = this.m_force;
        let forceX = 0;
        let forceY = 0;

        if(this.m_onMouseDrag){
            forceX  = force * input.mousepos.z;
            forceY = force * input.mousepos.w;

            if(input.getMouseUp(0)){
                this.m_onMouseDrag = false;
            }
        }
        else if(input.getMouseDown(0)){
            this.m_onMouseDrag = true;
        }

        return [forceX,forceY];

    }
}