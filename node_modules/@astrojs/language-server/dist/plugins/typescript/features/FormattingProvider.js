"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormattingProviderImpl = void 0;
const typescript_1 = __importDefault(require("typescript"));
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const utils_1 = require("../utils");
class FormattingProviderImpl {
    constructor(languageServiceManager, configManager) {
        this.languageServiceManager = languageServiceManager;
        this.configManager = configManager;
    }
    async formatDocument(document, options) {
        const { lang, tsDoc } = await this.languageServiceManager.getLSAndTSDoc(document);
        const filePath = (0, utils_1.toVirtualAstroFilePath)(tsDoc.filePath);
        const formatConfig = await this.configManager.getTSFormatConfig(document, options);
        let frontmatterEdits = [];
        let scriptTagsEdits = [];
        if (document.astroMeta.frontmatter.state === 'closed') {
            const start = document.positionAt(document.astroMeta.frontmatter.startOffset + 3);
            start.line += 1;
            start.character = 0;
            const startOffset = document.offsetAt(start);
            const endOffset = document.astroMeta.frontmatter.endOffset;
            const astroFormatConfig = await this.configManager.getAstroFormatConfig(document);
            const settings = {
                ...formatConfig,
                baseIndentSize: astroFormatConfig.indentFrontmatter ? formatConfig.tabSize ?? 0 : undefined,
            };
            frontmatterEdits = lang.getFormattingEditsForRange(filePath, startOffset, endOffset, settings);
            if (astroFormatConfig.newLineAfterFrontmatter) {
                const templateStart = document.positionAt(endOffset + 3);
                templateStart.line += 1;
                templateStart.character = 0;
                frontmatterEdits.push({
                    span: { start: document.offsetAt(templateStart), length: 0 },
                    newText: '\n',
                });
            }
        }
        document.scriptTags.forEach((scriptTag) => {
            const { filePath: scriptFilePath, snapshot: scriptTagSnapshot } = (0, utils_1.getScriptTagSnapshot)(tsDoc, document, scriptTag.container);
            const startLine = document.offsetAt(vscode_languageserver_types_1.Position.create(scriptTag.startPos.line, 0));
            const initialIndentLevel = computeInitialIndent(document, startLine, options);
            const baseIndent = (formatConfig.tabSize ?? 0) * (initialIndentLevel + 1);
            const formatSettings = {
                baseIndentSize: baseIndent,
                indentStyle: typescript_1.default.IndentStyle.Smart,
                ...formatConfig,
            };
            let edits = lang.getFormattingEditsForDocument(scriptFilePath, formatSettings);
            if (edits) {
                edits = edits
                    .map((edit) => {
                    edit.span.start = document.offsetAt(scriptTagSnapshot.getOriginalPosition(scriptTagSnapshot.positionAt(edit.span.start)));
                    return edit;
                })
                    .filter((edit) => {
                    return (scriptTagSnapshot.isInGenerated(document.positionAt(edit.span.start)) &&
                        scriptTag.end !== edit.span.start &&
                        // Don't format the last line of the file as it's in most case the indentation
                        scriptTag.endPos.line !== document.positionAt(edit.span.start).line);
                });
                const endLine = document.getLineUntilOffset(document.offsetAt(scriptTag.endPos));
                if (isWhitespaceOnly(endLine)) {
                    const endLineStartOffset = document.offsetAt(vscode_languageserver_types_1.Position.create(scriptTag.endPos.line, 0));
                    const lastLineIndentRange = vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(scriptTag.endPos.line, 0), scriptTag.endPos);
                    const newText = generateIndent(initialIndentLevel, options);
                    if (endLine !== newText) {
                        edits.push({
                            span: {
                                start: endLineStartOffset,
                                length: lastLineIndentRange.end.character,
                            },
                            newText,
                        });
                    }
                }
            }
            scriptTagsEdits.push(...edits);
        });
        return [...frontmatterEdits, ...scriptTagsEdits].map((edit) => ({
            range: (0, utils_1.convertRange)(document, edit.span),
            newText: edit.newText,
        }));
    }
}
exports.FormattingProviderImpl = FormattingProviderImpl;
function computeInitialIndent(document, lineStart, options) {
    let content = document.getText();
    let i = lineStart;
    let nChars = 0;
    let tabSize = options.tabSize || 4;
    while (i < content.length) {
        let ch = content.charAt(i);
        if (ch === ' ') {
            nChars++;
        }
        else if (ch === '\t') {
            nChars += tabSize;
        }
        else {
            break;
        }
        i++;
    }
    return Math.floor(nChars / tabSize);
}
function generateIndent(level, options) {
    if (options.insertSpaces) {
        return repeat(' ', level * options.tabSize);
    }
    else {
        return repeat('\t', level);
    }
}
function repeat(value, count) {
    let s = '';
    while (count > 0) {
        if ((count & 1) === 1) {
            s += value;
        }
        value += value;
        count = count >>> 1;
    }
    return s;
}
function isWhitespaceOnly(str) {
    return /^\s*$/.test(str);
}
