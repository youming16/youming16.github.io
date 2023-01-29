"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importVueIntegration = exports.importSvelteIntegration = exports.getPackagePath = exports.setIsTrusted = void 0;
const path_1 = require("path");
let isTrusted = true;
function setIsTrusted(_isTrusted) {
    isTrusted = _isTrusted;
}
exports.setIsTrusted = setIsTrusted;
function getPackagePath(packageName, fromPath) {
    const paths = [];
    if (isTrusted) {
        paths.unshift(fromPath);
    }
    try {
        const packageJSONPath = require.resolve(`${packageName}/package.json`, {
            paths,
        });
        return (0, path_1.dirname)(packageJSONPath);
    }
    catch (e) {
        return undefined;
    }
}
exports.getPackagePath = getPackagePath;
function importEditorIntegration(packageName, fromPath) {
    const pkgPath = getPackagePath(packageName, fromPath);
    if (pkgPath) {
        const main = (0, path_1.resolve)(pkgPath, 'dist', 'editor.cjs');
        return require(main);
    }
    return undefined;
}
function importSvelteIntegration(fromPath) {
    return importEditorIntegration('@astrojs/svelte', fromPath);
}
exports.importSvelteIntegration = importSvelteIntegration;
function importVueIntegration(fromPath) {
    return importEditorIntegration('@astrojs/vue', fromPath);
}
exports.importVueIntegration = importVueIntegration;
