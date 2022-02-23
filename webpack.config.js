/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
"use strict";

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require("path");
const webpack = require("webpack");

/** @type WebpackConfig */
const webExtensionConfig = {
    mode: "none",
    target: "webworker",
    entry: {
        extension: "./src/web/extension.ts",
    },
    output: {
        filename: "[name].js",
        path: path.join(__dirname, "./dist/web"),
        libraryTarget: "commonjs",
        devtoolModuleFilenameTemplate: "../../[resource-path]",
    },
    resolve: {
        mainFields: ["browser", "module", "main"],
        extensions: [".ts", ".js"],
        alias: {
            "process/browser": "process",
        },
        fallback: {
            assert: require.resolve("assert"),
            process: require.resolve("process/browser"),
        },
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "ts-loader",
                    },
                ],
            },
        ],
    },
    plugins: [],
    externals: {
        vscode: "commonjs vscode", // ignored because it doesn't exist
    },
    performance: {
        hints: false,
    },
    devtool: "nosources-source-map", // create a source map that points to the original source file
    infrastructureLogging: {
        level: "log", // enables logging required for problem matchers
    },
};

module.exports = [webExtensionConfig];
