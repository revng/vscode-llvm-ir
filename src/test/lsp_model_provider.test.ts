/* eslint-disable @typescript-eslint/no-explicit-any */

import * as fs from "fs";
import { EndOfLine, TextDocument, TextLine, Uri } from "vscode";
import { LspModelProvider } from "../web/llvmir/lsp_model_provider";

describe("LspModelProvider", () => {
    const lines: string[] = fs.readFileSync("src/test/data.ll", { encoding: "utf-8" }).split(/\r?\n/);
    const lineAt = function (line: number): TextLine {
        return {
            lineNumber: line,
            text: lines[line],
            range: null as any,
            rangeIncludingLineBreak: null as any,
            firstNonWhitespaceCharacterIndex: null as any,
            isEmptyOrWhitespace: null as any,
        };
    };
    const stubDocument: TextDocument = {
        uri: Uri.from({ scheme: "mock" }),
        fileName: "mock",
        isUntitled: false,
        isClosed: false,
        isDirty: false,
        languageId: "llvm-ir",
        version: 0,
        save: async function () {
            return false;
        },
        eol: EndOfLine.LF,
        lineCount: lines.length,
        lineAt: lineAt as any,
        getText: null as any,
        getWordRangeAtPosition: null as any,
        offsetAt: null as any,
        positionAt: null as any,
        validatePosition: null as any,
        validateRange: null as any,
    };

    const lmp = new LspModelProvider();
    const result = lmp.getModel(stubDocument);

    test("Function parsed", () => {
        expect(Array.from(result.functions.keys())).toEqual(["@main"]);
    });

    test("Checking globals", () => {
        expect(Array.from(result.global.values.keys())).toEqual(["@.fmtstr", "@.fizz", "@.buzz", "@.nl", "@printf"]);
    });

    test("Checking locals in @main", () => {
        const mainFunc = result.functions.get("@main");
        if (mainFunc !== undefined) {
            expect(Array.from(mainFunc.values.keys())).toContain("%didfizzorbuzz");
            expect(Array.from(mainFunc.values.keys())).toContain("%before");
        } else {
            expect(false).toBe(true);
        }
    });
});
