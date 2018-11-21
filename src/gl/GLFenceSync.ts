import { GLContext } from "./GLContext";

/**
 * Wrapper of WebGLSync object and gl.fenceSync.
 */
export class GLFenceSync{
    private glctx:GLContext;
    private m_callback:()=>void;
    private m_signaled:boolean = false;
    private m_autoCheck:boolean;

    private m_syncObj:WebGLSync;

    private m_released:boolean=  false;

    /**
     * 
     * @param glctx 
     * @param autoCheckEmit GLContext will check fenceSyncStatus and emit callback when GLCtx call @function <checkAllFenceSync>
     */
    public constructor(glctx:GLContext,autoCheckEmit:boolean = false){
        this.glctx = glctx;
        this.m_autoCheck = autoCheckEmit;
    }

    public emit(onsignaled:()=>void){
        if(this.m_released) throw new Error('glFenceSync has beend releasd!');
        if(onsignaled == null) throw new Error('sync callback must not be error.');
        if(this.m_callback != null){
            console.error("emit must wait until previous sync signaled.");
            return;
        }
        
        this.m_callback = onsignaled;
        const gl = this.glctx.gl;
        this.m_signaled = false;
        this.m_syncObj = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);

        if(this.m_autoCheck){
            //register autocheck
            this.glctx.registFenceSync(this);
        }
    }

    public release(){
        if(this.m_released) return;
        let glctx = this.glctx;
        if(this.m_syncObj != null){
            glctx.unregistFenceSync(this);
            glctx.gl.deleteSync(this.m_syncObj);
            this.m_syncObj= null;            
        }
        this.glctx= null;
        this.m_callback = null;

        this.m_released = true;
    }
    
    public checkSignaled(autoEmitCallback:boolean = true):boolean{
        const sync = this.m_syncObj;
        if(sync == null) return this.m_signaled;

        const gl = this.glctx.gl;
        var status = gl.getSyncParameter(sync,gl.SYNC_STATUS);
        if(status == gl.SIGNALED){
            gl.deleteSync(sync);
            this.m_syncObj = null;
            this.m_signaled= true;

            if(autoEmitCallback){
                this.m_callback();
                this.m_callback = null;
            }
            
            if(this.m_autoCheck){
                this.glctx.unregistFenceSync(this);
            }
        }
        return this.m_signaled;
    }
}
