const path = require("path");
var webpack = require("webpack");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./public/node_serial.js",
    output: {
        publicPath: "./",
        filename: "main.js",
        path: path.resolve(__dirname, "dist"),
    },
    externals: {
        "@brightsign/registry": "commonjs @brightsign/registry",
        "@brightsign/storageinfo": "commonjs @brightsign/storageinfo",
        "@brightsign/screenshot": "commonjs @brightsign/screenshot",
        "@brightsign/messageport": "commonjs @brightsign/messageport",
    },
    module: {
        noParse: function (content) {
            return /express/.test(content);
        },
    },
    plugins: [],
    target: "node",
};
