import { RenderNodeList } from "../RenderNodeList";
import { Transform } from "../Transform";
import { Scene } from "../Scene";
import { Mesh } from "../Mesh";
import { Material } from "../Material";
import { mat4 } from "../math/GLMath";

export class PipelineUtility{

    public static traversalRenderNode(drawlist: RenderNodeList, obj: Transform) {
        let children = obj.children;
        if (children == null) return;
        for (let i = 0, len = children.length; i < len; i++) {
            let c = children[i];
            let cobj = c.gameobject;
            if (!cobj.active) continue;
            let crender = cobj.render;
            if (crender != null) {
                drawlist.pushRenderNode(crender);
            }
            PipelineUtility.traversalRenderNode(drawlist, c);
        }
    }

    /**
     * traversal all transform of scene object, then generate renderNodeList for further rendering.
     * @param scene 
     * @param nodelist 
     */
    public static generateDrawList(scene: Scene,nodelist:RenderNodeList) {
        nodelist.reset();
        PipelineUtility.traversalRenderNode(nodelist, scene.transform);
        nodelist.sort();
    }


}