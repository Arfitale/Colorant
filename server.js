const express = require("express");
const path = require("path");
const userData = require(path.resolve(__dirname, "./data/user.json"));

const app = express();
const port = 3000;

// Static Assets
app.use(express.static("./public"));

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// ROUTE

// GET
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/home.html"));
});
app.get("/color-generator", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/generatorApp.html"));
});
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/signUp.html"));
});
app.get("/signin", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/signIn.html"));
})

// POST
app.post("/register", (req, res) => {
    const data = req.body;

    if(!Object.keys(data).length) {
        return res.status(400).json({msg: "something went error, try refresh the page"});
    }
    res.status(201).json(data);
});


// OTHERS
app.all("*", (req, res) => {
    res.status(404).send("Error 404, page not found");
});

app.listen(port, () => {
    return;
})