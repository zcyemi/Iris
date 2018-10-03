

export class ShaderSource {

    public variants: string[];

    private vs: string;
    private ps: string;

    public constructor(vs: string, ps?: string,variants?: string[]) {
        this.variants = variants;
        this.ps = ps;
        this.vs = vs;
    }
}
