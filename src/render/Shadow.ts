

export enum ShadowCascade{
    NoCascade = 1,
    TwoCascade = 2,
    FourCascade = 4
}



export class ShadowConfig{

    public static readonly CASCADE_SPLIT_TWO_CASCADE:number[] = [0.333,0.667];
    public static readonly CASCADE_SPLIT_FOUR_CASCADE:number[] = [0.067,0.133,0.266,0.534];
    public static readonly CASCADE_SPLIT_NONE:number[] = [1.0];

    public cascade:ShadowCascade = ShadowCascade.NoCascade;
    public shadowDistance:number = 40.0;
    public cascadeSplit:number[] = ShadowConfig.CASCADE_SPLIT_NONE;
}