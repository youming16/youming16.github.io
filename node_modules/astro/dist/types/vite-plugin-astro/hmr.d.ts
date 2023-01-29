import type { PluginContext as RollupPluginContext } from 'rollup';
import type { HmrContext, ModuleNode, ViteDevServer } from 'vite';
import type { AstroConfig } from '../@types/astro';
import type { LogOptions } from '../core/logger/core.js';
import { cachedCompilation } from './compile.js';
interface TrackCSSDependenciesOptions {
    viteDevServer: ViteDevServer | null;
    filename: string;
    id: string;
    deps: Set<string>;
}
export declare function trackCSSDependencies(this: RollupPluginContext, opts: TrackCSSDependenciesOptions): Promise<void>;
export interface HandleHotUpdateOptions {
    config: AstroConfig;
    logging: LogOptions;
    compile: () => ReturnType<typeof cachedCompilation>;
}
export declare function handleHotUpdate(ctx: HmrContext, { config, logging, compile }: HandleHotUpdateOptions): Promise<ModuleNode[] | undefined>;
export {};
