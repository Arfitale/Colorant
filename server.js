const express = require("express");
const fs = require("fs");
const path = require("path");

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
    const formData = req.body;

    // if data is empty json
    if(!Object.keys(formData).length) {
        return res.status(400).json({msg: "something went error, try refresh the page"});
    }

    const {username, email, password} = formData;
    const userFile = email[0];

    // GET CURRENT ACCOUNT DATABASE
    let currentData = fs.readFileSync(path.join(__dirname, `/data/user/${userFile}.json`), "utf8");
    if(!currentData) {
        currentData = [];
    } else {
        currentData = JSON.parse(currentData);
    }

    // Merge current data with new data
    currentData.push(formData);
    const finalData = JSON.stringify(currentData);

    // WRITE NEW ACCOUNT TO DATABASE
    fs.writeFile(path.join(__dirname, `/data/user/${userFile.toLowerCase()}.json`), finalData, error => {
        if(error) {
            res.status(500).json({success: false})
        } else {
            const result = {
                success: true,
                msg: "account successful added in database",
                formData
            }
            res.status(201).json(result);
        }
    });
});


// OTHERS
app.all("*", (req, res) => {
    res.status(404).send("Error 404, page not found");
});

app.listen(port, () => {
    return;
})