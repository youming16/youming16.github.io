"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AstroPlugin = void 0;
const vscode_languageserver_1 = require("vscode-languageserver");
const LanguageServiceManager_1 = require("../typescript/LanguageServiceManager");
const CompletionsProvider_1 = require("./features/CompletionsProvider");
class AstroPlugin {
    constructor(docManager, configManager, workspaceUris) {
        this.__name = 'astro';
        this.configManager = configManager;
        this.languageServiceManager = new LanguageServiceManager_1.LanguageServiceManager(docManager, workspaceUris, configManager);
        this.completionProvider = new CompletionsProvider_1.CompletionsProviderImpl(this.languageServiceManager);
    }
    async getCompletions(document, position, completionContext) {
        const completions = this.completionProvider.getCompletions(document, position, completionContext);
        return completions;
    }
    getFoldingRanges(document) {
        const foldingRanges = [];
        const { frontmatter } = document.astroMeta;
        // Currently editing frontmatter, don't fold
        if (frontmatter.state !== 'closed')
            return foldingRanges;
        // The way folding ranges work is by folding anything between the starting position and the ending one, as such
        // the start in this case should be after the frontmatter start (after the starting ---) until the last character
        // of the last line of the frontmatter before its ending (before the closing ---)
        // ---
        //		^ -- start
        // console.log("Astro")
        // ---								^ -- end
        const start = document.positionAt(frontmatter.startOffset + 3);
        const end = document.positionAt(frontmatter.endOffset - 1);
        return [
            {
                startLine: start.line,
                startCharacter: start.character,
                endLine: end.line,
                endCharacter: end.character,
                kind: vscode_languageserver_1.FoldingRangeKind.Imports,
            },
        ];
    }
}
exports.AstroPlugin = AstroPlugin;
