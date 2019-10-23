const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const cors = require('cors');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const knex = require('knex');
const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        user : 'macairjps',
        password : '',
        database : 'smartbrain'
    }
});

//   db.select('*').from('users')
//   .then(data => console.log(data));
const app = express();

app.use(cors());
app.use(bodyParser.json());

// homepage
app.get("/", (req, res) => {
    res.send("working");
})

// signin: POST = success fail
app.post("/signin", (req, res) => signin.handleSignin(req, res, db, bcrypt))

// register a new user/add new user to db
// register: POST returns user
app.post("/register", (req, res) => register.handleRegister(req, res, db, bcrypt))

// profile/:userId: GET = user
app.get("/profile/:id", (req, res) => profile.handleProfileGet(req, res, db));

// image: PUT returns user with updated entries
app.put("/image", (req, res) => image.handleImage(req, res, db));

app.post("/imageurl", (req, res) => image.handleApiCall(req, res));


const port = process.env.PORT || 3000;
app.listen(process.env.PORT || 3000, () => {
    console.log("Listening on port", process.env.PORT);
});