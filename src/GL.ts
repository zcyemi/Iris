

export interface GLInterface{

    readonly Float:number;
}

class GLImpl implements GLInterface{
    public readonly Float:number = 10;
}

export const GL = new GLImpl();