const express = require("express");

const app = express();
const port = 3000;

app.get("/color-generator", (req, res) => {
    res.send("hello world!");
});

app.listen(port, () => {
    return;
})