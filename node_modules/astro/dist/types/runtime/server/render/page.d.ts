import type { SSRResult } from '../../../@types/astro';
import type { AstroComponentFactory } from './index';
export declare function renderPage(result: SSRResult, componentFactory: AstroComponentFactory, props: any, children: any, streaming: boolean): Promise<Response>;
