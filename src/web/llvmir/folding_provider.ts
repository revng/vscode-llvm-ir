//
// This file is distributed under the MIT License. See LICENSE.md for details.
//

import {
    CancellationToken,
    FoldingContext,
    FoldingRange,
    FoldingRangeProvider,
    ProviderResult,
    TextDocument,
} from "vscode";
import { LspModelProvider } from "./lsp_model_provider";

export class LLVMIRFoldingProvider implements FoldingRangeProvider {
    constructor(private tokenModelProvider: LspModelProvider) {}

    provideFoldingRanges(
        document: TextDocument,
        context: FoldingContext,
        token: CancellationToken
    ): ProviderResult<FoldingRange[]> {
        const documentMap = this.tokenModelProvider.getModel(document);
        return documentMap.foldingRanges;
    }
}
