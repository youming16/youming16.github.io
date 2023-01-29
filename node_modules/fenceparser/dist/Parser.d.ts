import { Token } from './utils';
export declare type OBJECT = {
    [key in string | number]: VALUE;
};
export declare type VALUE = OBJECT | Array<VALUE> | string | boolean | number;
export declare const parse: (input: Array<Token>) => Record<string, VALUE> | null;
