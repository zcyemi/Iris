import { vec4 } from "../math";
import { PropertyUpdater } from "./Utility";


export class GraphicsSettings {

    constructor() {}

    private static s_ambienColor:vec4 = vec4.one;
    private static s_fogColor:vec4 = vec4.one;
    private static s_fogParam:vec4 = vec4.zero;

    private static s_updater :PropertyUpdater = PropertyUpdater.create(null,null,true);

    public static get ambientColor():vec4{ return GraphicsSettings.s_ambienColor;}
    public static set ambientColor(col:vec4){ GraphicsSettings.s_ambienColor = col;}

    public static get fogColor():vec4{ return GraphicsSettings.s_fogColor;}
    public static set fogColor(col:vec4){ GraphicsSettings.s_fogColor = col;}

    public static get fogParam():vec4{ return GraphicsSettings.s_fogParam;}
    public static set fogParam(val:vec4){GraphicsSettings.s_fogParam = val;}
    
    public static update():boolean{
        return GraphicsSettings.s_updater.update();
    }
}