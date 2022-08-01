//
// This file is distributed under the MIT License. See LICENSE.md for details.
//

import {
    CancellationToken,
    Location,
    Position,
    ProviderResult,
    Range,
    ReferenceContext,
    ReferenceProvider,
    TextDocument,
    Uri,
} from "vscode";
import { removeTrailing } from "./common";
import { getFunctionFromLine } from "./lsp_model";
import { LspModelProvider } from "./lsp_model_provider";
import { Regexp } from "./regexp";

export class LLVMReferenceProvider implements ReferenceProvider {
    private lspModelProvider: LspModelProvider;

    constructor(lspModelProvider: LspModelProvider) {
        this.lspModelProvider = lspModelProvider;
    }

    provideReferences(
        document: TextDocument,
        position: Position,
        context: ReferenceContext,
        token: CancellationToken
    ): ProviderResult<Location[]> {
        const lspModel = this.lspModelProvider.getModel(document);
        const varRange = document.getWordRangeAtPosition(position, Regexp.identifier);
        const labelRange = document.getWordRangeAtPosition(position, Regexp.label);
        const functionInfo = getFunctionFromLine(lspModel, position.line);
        if (varRange !== undefined) {
            const varName = document.getText(varRange);
            if (functionInfo?.info.values.get(varName) !== undefined) {
                return this.transform(document.uri, functionInfo.info.users.get(varName));
            } else {
                const globalUsers = lspModel.global.users.get(varName);
                return this.transform(document.uri, globalUsers);
            }
        } else if (labelRange !== undefined && functionInfo !== undefined) {
            const fixedName = removeTrailing(`%${document.getText(labelRange)}`, ":");
            return this.transform(document.uri, functionInfo.info.users.get(fixedName));
        } else {
            return [];
        }
    }

    private transform(uri: Uri, ranges?: Range[]): Location[] {
        return ranges !== undefined ? ranges.map((e) => new Location(uri, e)) : [];
    }
}
