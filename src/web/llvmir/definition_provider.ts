//
// This file is distributed under the MIT License. See LICENSE.md for details.
//

import { CancellationToken, DefinitionLink, DefinitionProvider, Position, Range, TextDocument } from "vscode";
import { getFunctionFromLine } from "./lsp_model";
import { LspModelProvider } from "./lsp_model_provider";
import { Regexp } from "./regexp";

export class LLVMIRDefinitionProvider implements DefinitionProvider {
    private lspModelProvider: LspModelProvider;

    constructor(tokenModelProvider: LspModelProvider) {
        this.lspModelProvider = tokenModelProvider;
    }

    provideDefinition(
        document: TextDocument,
        position: Position,
        token: CancellationToken
    ): DefinitionLink[] | undefined {
        const lspModel = this.lspModelProvider.getModel(document);
        const varRange = document.getWordRangeAtPosition(position, Regexp.identifier);
        const varName = document.getText(varRange);
        const functionInfo = getFunctionFromLine(lspModel, position.line);
        if (varName !== undefined) {
            if (functionInfo !== undefined) {
                return this.transform(document, varName, lspModel.global.values, functionInfo.info.values);
            } else {
                return this.transform(document, varName, lspModel.global.values);
            }
        }
        return undefined;
    }

    private transform(
        document: TextDocument,
        varName: string,
        globals: Map<string, Position>,
        locals?: Map<string, Position>
    ): DefinitionLink[] | undefined {
        let position;
        if (locals !== undefined) {
            position = locals.get(varName);
        }

        if (position === undefined) {
            position = globals.get(varName);
        }

        if (position !== undefined) {
            const line = document.lineAt(position.line).text;
            const range = new Range(position, position.with(undefined, position.character + varName.length));
            const previewRange = new Range(position.line, 0, position.line, line.length);
            return [
                {
                    targetUri: document.uri,
                    targetRange: previewRange,
                    targetSelectionRange: range,
                },
            ];
        }
    }
}
