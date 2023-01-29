import { UserConfigSettings } from "shiki-twoslash";
import type { TwoSlashReturn } from "@typescript/twoslash";
/**
 * Keeps a cache of the JSON responses to a twoslash call in node_modules/.cache/twoslash
 * which should keep CI times down (e.g. the epub vs the handbook etc) - but also during
 * dev time, where it can be super useful.
 */
export declare const cachedTwoslashCall: (code: string, lang: string, settings: UserConfigSettings) => TwoSlashReturn | undefined;
