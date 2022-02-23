//
// This file is distributed under the MIT License. See LICENSE.md for details.
//

import { FoldingRange, Position, Range } from "vscode";

export class LspModel {
    public version: number;
    public global: VariablesInfo;
    public functions: Map<string, FunctionInfo>;
    public foldingRanges: FoldingRange[];

    constructor(version: number) {
        this.version = version;
        this.global = new VariablesInfo();
        this.functions = new Map<string, FunctionInfo>();
        this.foldingRanges = [];
    }
}

export class VariablesInfo {
    public values: Map<string, Position>;
    public users: Map<string, Range[]>;

    constructor() {
        this.values = new Map<string, Position>();
        this.users = new Map<string, Range[]>();
    }
}

export class FunctionInfo extends VariablesInfo {
    lineStart: number;
    lineEnd: number;

    constructor(lineStart: number) {
        super();
        this.lineStart = lineStart;
        this.lineEnd = -1;
    }
}

export interface FunctionInfoEntry {
    name: string;
    info: FunctionInfo;
}

export function getFunctionFromLine(model: LspModel, line: number): FunctionInfoEntry | undefined {
    const entries = Array.from(model.functions.entries());
    const find = entries.find((fi) => fi[1].lineStart <= line && fi[1].lineEnd >= line);
    return find !== undefined ? { name: find[0], info: find[1] } : undefined;
}
