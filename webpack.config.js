const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        server: path.resolve(__dirname, "./src/js/generatorApp.js")
    },
    output: {
        filename: "app.bundle.js",
        path: path.resolve(__dirname, "./public/js/"),
        clean: true
    },

}