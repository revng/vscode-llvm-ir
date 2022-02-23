const glob = require("glob");

module.exports = {
    entryPoints: glob.sync("src/web/**/*.ts").filter((e) => !e.includes("test")),
};
