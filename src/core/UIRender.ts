import { BaseRender } from "./BaseRender";
import { GLContext } from "../gl";
import { GraphicsRender } from "./GraphicsRender";
import { RenderModel } from "../pipeline";
import { RenderQueue } from "../shaderfx";
import { TextBuilder } from "../misc/TextBuilder";
import { SpriteBatch } from "../misc/SpriteBatch";
import { Color } from "./Color";

export class UIRender extends BaseRender {
    private m_sprBatch: SpriteBatch;
    private m_text: TextBuilder;
    public constructor(grender: GraphicsRender) {
        super();
        var batch = new SpriteBatch(512, grender);
        batch.drawRect([100, 100, 100, 10], Color.YELLOW, 0);
        batch.drawRect([200, 10, 30, 100], Color.BLUE, 0);
        this.m_sprBatch = batch;
        let text = new TextBuilder(512, grender);
        text.drawText("HELLOWORLD-&", 0, 100, 100, 20);

        this.m_text = text;
    }

    public get renderQueue(): RenderQueue { return RenderQueue.Overlay; }

    public refreshData(glctx: GLContext) {
        this.m_sprBatch.refreshData(glctx);
        this.m_text.refreshData(glctx);
    }

    public release(glctx: GLContext) {
    }

    public draw(gl: GLContext, model: RenderModel) {
        this.refreshData(gl);
        let sb = this.m_sprBatch;
        model.drawMeshWithMat(sb.mesh, sb.material, sb.vao, null, true);
        let text = this.m_text;
        model.drawMeshWithMat(text.mesh, text.material, text.vao, null, true);
    }
}