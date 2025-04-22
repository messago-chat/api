const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const randomToken = require('random-token');
const cors = require("cors");
const app = express();
const port = 8081;

app.use(bodyParser.json());
app.use(cors()); 

const db = {
    "nikeedev": { "password_hash": "$2b$10$ATQVxqdvNvj583rhkIIgveZKPkTIU7sZdcnsq.y23IV.ik4brK/z2" }
};

const tokens = {

};


app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.post('/token', (req, res) => {
    const { username, password } = req.body;
    if (db[username] == undefined || db[username] == null) {
        res.statusCode = 403;
        res.send(JSON.stringify({ status: "error", message: `Username ${username} doesn't exist in the db. Are you registered?`}));
    }

    let hash = db[username].password_hash;
    
    if (bcrypt.compareSync(password, hash)) {
        if (Object.hasOwn(username)) {
            delete tokens[username];
        }
        let token = randomToken(32);

        tokens[username] = { "token": token };
        
        res.statusCode = 200;
        res.send(JSON.stringify({ status: "success", token: token }));
    } else {
        res.statusCode = 403;
        res.send(JSON.stringify({ status: "error", message: `Username or password is incorrect, failed to generate new token.`}));
    }
});

app.post('/check', (req, res) => {
    const { username, token } = req.body;
    if (tokens[username].token == undefined || tokens[username] == undefined) {
        res.statusCode = 403;
        res.send(JSON.stringify({ status: "error", message: `Username ${username} doesn't exist in the db. Are you registered?`}));
    }
    // console.log(tokens[username], token); 
    if (tokens[username].token == token) {
        res.statusCode = 200;
        res.send(JSON.stringify({ status: "success", exists: true }));
    } else {
        res.statusCode = 403;
        res.send(JSON.stringify({ status: "error", exists: false, message: `Token doesn't exist; generate new token.`}));
    }
});


app.listen(port, () => {
    console.log(`messago api server starting at http://localhost:${port}`);
});


