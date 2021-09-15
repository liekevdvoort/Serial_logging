const path = require("path");
var webpack = require("webpack");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: "./public/node_serial.js",
    output: {
        path: path.join(__dirname, "dist", "build"),
        publicPath: "/",
        libraryTarget: "commonjs2",
        filename: "main.js",
    },
    externals: {
        express: "express",
        // "@brightsign/registry": "commonjs @brightsign/registry",
        // "@brightsign/storageinfo": "commonjs @brightsign/storageinfo",
        // "@brightsign/screenshot": "commonjs @brightsign/screenshot",
        // "@brightsign/messageport": "commonjs @brightsign/messageport",
    },
    plugins: [],
    target: "node",
};
