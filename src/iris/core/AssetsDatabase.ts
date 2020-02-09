import { SerializeField, DataType, BinarySerializer } from 'ts-binary-serializer';
import { Utility } from './Utility';

export class BundleFileEntry{
    @SerializeField(DataType.String)
    public path:string;
    @SerializeField(DataType.String)
    public hash:string;
    @SerializeField(DataType.String)
    public restype:string;
    @SerializeField(DataType.Int32)
    public data_offset:number;
    @SerializeField(DataType.Int32)
    public data_size:number;
}

export class AssetsBundle{
    @SerializeField(DataType.String)
    public bundlename:string;
    @SerializeField(DataType.String,true)
    public res_types:string[];
    @SerializeField(DataType.Object,true,BundleFileEntry)
    public entry:BundleFileEntry[];
    @SerializeField(DataType.TypedArray,false,Uint8Array)
    public data:Uint8Array;

    public getResource(path:string):BundleFileEntry{
        return this.entry.find(e=>e.path == path);
    }

    public getResourceData(path:string):DataView{
        let entry = this.getResource(path);
        if(entry == null) return null;
        return new DataView(this.data,entry.data_offset,entry.data_size);
    }

}


export class AssetsDataBase{

    private static s_loadedBundles:Map<string,AssetsBundle> =new Map();

    public static async loadBundle(url:string):Promise<AssetsBundle>{
        
        if(Utility.StringIsNullOrEmptry(url)) return null;
        let arryabuffer = await Utility.loadFile(url);

        if(arryabuffer == null){
            throw new Error('bundle data is null');
        }

        let bundle = BinarySerializer.Deserialize(arryabuffer,AssetsBundle);

        if(bundle !=null){
            let bundleName= bundle.bundlename;

            let loadedBundles = AssetsDataBase.s_loadedBundles;
            if(loadedBundles.get(bundleName)!=null){
                console.warn(`[AssetDataBase] bundle:${loadedBundles} conflicted or alread loaded. skip`);
                return;
            }
            loadedBundles.set(bundleName,bundle);
        }
        else{
            throw new Error("deserial bundle failed");
        }

        return bundle;
    }

    public static getLoadedBundle(bundleName:string):AssetsBundle{
        return AssetsDataBase.s_loadedBundles.get(bundleName);
    }

    public static unloadAssetsBundle(bundle:AssetsBundle):boolean{
        if(bundle == null) return false;
        return AssetsDataBase.unloadAssetsBundleByName(bundle.bundlename);
    }

    public static unloadAssetsBundleByName(bundleName:string):boolean{
        if(AssetsDataBase.s_loadedBundles.has(bundleName)){
            AssetsDataBase.s_loadedBundles.delete(bundleName);
            return true;
        }
        return false;
    }

}