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
    let userLocalData = fs.readFileSync(path.join(__dirname, `/data/user/local/${userFile}.json`), "utf8");
    let usernameGlobalData = fs.readFileSync(path.join(__dirname, '/data/user/global/username.json'), "utf8");

    // CHECK LOCAL DATA
    if(!userLocalData) {
        userLocalData = [];
    } else {
        userLocalData = JSON.parse(userLocalData);
    }

    // CHECK USERNAME DATA
    if(!usernameGlobalData) {
        usernameGlobalData = [];
    } else {
        usernameGlobalData = JSON.parse(usernameGlobalData);
    }

    // Merge current data with new data
    userLocalData.push(formData);
    
    // ADD USERNAME EXISTANCE TO GLOBAL DATABASE
    usernameGlobalData.push(username);
    // sort username data array
    usernameGlobalData.sort((x, y) => x.localeCompare(y));
    
    // final output data
    const finalUserData = JSON.stringify(userLocalData);
    const finalUsernameGlobalData = JSON.stringify(usernameGlobalData);

    // POST USERNAME DATA
    fs.writeFile(path.join(__dirname, '/data/user/global/username.json'), finalUsernameGlobalData, error => {
        if(error) {
            return res.status(400).json({success: false, msg: "username has been used"})
        }
    })

    // WRITE NEW ACCOUNT TO DATABASE
    fs.writeFile(path.join(__dirname, `/data/user/local/${userFile.toLowerCase()}.json`), finalUserData, error => {
        if(error) {
            return res.status(500).json({success: false})
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