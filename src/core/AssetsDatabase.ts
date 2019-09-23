

export class AssetsBundle{
    public bundleName:string;
}


export class AssetsDataBase{


    public static async loadBundle(url:string):Promise<AssetsBundle>{
        return;
    }

    public unloadAssetsBundle(bundle:AssetsBundle){

    }

    public unloadAssetsBundleByName(bundleName:string){

    }

    public getAsset(path:string):any{
        return null;
    }




}