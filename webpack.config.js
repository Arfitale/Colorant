const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        generatorApp: path.resolve(__dirname, "./src/js/generatorApp.js"),
        home: path.resolve(__dirname, "./src/js/home.js"),
        signUp: path.resolve(__dirname, "./src/js/signUp.js"),
        signIn: path.resolve(__dirname, "./src/js/signIn.js")
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "./public/js/"),
        clean: true
    },

}