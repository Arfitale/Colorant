const express = require("express");
const path = require("path");
const userData = require(path.resolve(__dirname, "./data/user.json"));

const app = express();
const port = 3000;

// Static Assets
app.use(express.static("./public"));


// ROUTE
app.get("/color-generator", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/generatorApp.html"));
})

app.get("/data", (req, res) => {
    res.json(userData);
})

app.all("*", (req, res) => {
    res.status(404).send("Error 404, page not found");
});

app.listen(port, () => {
    return;
})