import { FormattingOptions, TextEdit } from 'vscode-languageserver-types';
import { ConfigManager } from '../../../core/config';
import { AstroDocument } from '../../../core/documents';
import { FormattingProvider } from '../../interfaces';
import { LanguageServiceManager } from '../LanguageServiceManager';
export declare class FormattingProviderImpl implements FormattingProvider {
    private languageServiceManager;
    private configManager;
    constructor(languageServiceManager: LanguageServiceManager, configManager: ConfigManager);
    formatDocument(document: AstroDocument, options: FormattingOptions): Promise<TextEdit[]>;
}
