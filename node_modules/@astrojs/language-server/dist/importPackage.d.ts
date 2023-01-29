import type * as svelte from '@astrojs/svelte/dist/editor.cjs';
import type * as vue from '@astrojs/svelte/dist/editor.cjs';
export declare function setIsTrusted(_isTrusted: boolean): void;
export declare function getPackagePath(packageName: string, fromPath: string): string | undefined;
export declare function importSvelteIntegration(fromPath: string): typeof svelte | undefined;
export declare function importVueIntegration(fromPath: string): typeof vue | undefined;
