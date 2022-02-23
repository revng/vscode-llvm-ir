module.exports = {
    verbose: true,
    roots: ["./src/test"],
    transform: {
        "^.+\\.tsx?$": "ts-jest",
    },
    testRegex: "\\.(test|spec|perf)\\.tsx?$",
    testPathIgnorePatterns: ["/node_modules/"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    moduleNameMapper: {
        "^vscode$": "<rootDir>/src/test/__mocks__/vscode.js",
    },
};
