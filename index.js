const express = require("express");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const randomToken = require('random-token');
const cors = require("cors");
const app = express();
const port = 8081;

app.use(bodyParser.json());
app.use(cors()); 

class Post {
    title
    receiver
    sender
    post
    img
    url

    constructor(post<) {
        title = post.title;
        receiver = post.user;
        sender = username;
        post = post.post;
        img = post.img == undefined ? null : post.img;
        url = post.url == undefined ? null : post.url;
    }

    insert() {
        return `
        insert into userinfo (author, title, receiver, url, img, post)
        values (${sender}, ${title}, ${receiver}, ${url}, ${img}, ${post})`;
    }
};

const db = require('better-sqlite3')('messago_db/messago.db');
db.pragma('journal_mode = WAL');
const users = db.prepare('SELECT * FROM users;').all();
const userinfo = db.prepare('SELECT * FROM userinfo;').all();
const posts = db.prepare('SELECT * FROM posts;').all();

// console.log(users.find(e => e.username == username));

const tokens = {

};


app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.post('/token', (req, res) => {
    const { username, password } = req.body;
    
    let user = users.find(e => {
        console.log("e:",e.username);

        return e.username == username;
    });

    console.log("username: '%s'", username);

    if (user.username == undefined || user.username == null) {
        res.statusCode = 403;
        res.send(JSON.stringify({ status: "error", message: `Username ${username} doesn't exist in the db. Are you registered?`}));
    }

    let hash = user.password_hash;
    
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

app.post('/post', (req, res) => {
    const { username, token } = req.body.auth;
    
     if (tokens[username].token == undefined || tokens[username] == undefined) {
        res.statusCode = 403;
        res.send(JSON.stringify({ status: "error", message: `Username ${username} doesn't exist in the db. Are you registered?`}));
    }
    // console.log(tokens[username], token); 
    if (tokens[username].token == token) {
        const post = req.body.post;
        
        let data = new Post(post);
                
        posts.exec(data.insert());

        res.statusCode = 202;
        res.send(JSON.stringify({ status: "success", message: `Post successfully sent to ${data.receiver}!`}));

    }
});


app.listen(port, () => {
    console.log(`messago api server starting at http://localhost:${port}`);
});



