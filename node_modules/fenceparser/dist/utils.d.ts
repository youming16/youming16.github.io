export declare type Token = string | number | boolean;
export declare const isQuoted: (s: string) => boolean;
export declare class Iterator<T extends string | Array<Token>> {
    protected readonly input: T;
    protected error(err: string): void;
    protected start: number;
    protected current: number;
    protected peek(n?: number): T[number];
    protected advance(): T[number];
    protected isAtEnd(): boolean;
    constructor(input: T);
}
