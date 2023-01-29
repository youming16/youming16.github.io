import { lex } from './Lexer';
import { parse } from './Parser';
export { lex, parse };
declare const _default: (input: string) => Record<string, import("./Parser").VALUE> | null;
export default _default;
