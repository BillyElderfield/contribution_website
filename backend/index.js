var express = require('express');
const cors = require("cors");
var morgan = require('morgan');
const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
var bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const helmet = require("helmet");

var port = process.env.PORT || 7034

var app = express()

//TODO: Have cors domain whitelist
app.use(helmet());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors({ origin: 'https://localhost:3000', credentials: true }))

const userRoutes = require("./routes/userRoutes.js");
const contributionRoutes = require("./routes/contributionRoutes.js");
const followRoutes = require("./routes/followRoutes.js");
app.use("/user", userRoutes);
app.use("/contribution", contributionRoutes);
app.use("/follow", followRoutes);

app.use(morgan('dev'))

app.use(bodyParser.json())

app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))

const endpointError = {status: 404, error: "No Endpoint Found"}
app.use((req, res) => {
    res.status(404).send(endpointError);
});

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// app.get("/confirmation/:token", async (req, res)=>{
//     try{
//         let emailToken = jwt.verify(req.params.token, config.jwtSecret)
//         const toInsert = {forename: emailToken.forename, surname: emailToken.surname, email: emailToken.email, password: emailToken.password};
//         let insertingUser = await connection.query("INSERT INTO users SET ?", toInsert);
//         let userDetails = await connection.query("SELECT role, user_id FROM users WHERE email = ?", email);
//         let dataJWT = {email, role: userDetails[0].role, user_id: userDetails[0].user_id, iat: Math.floor(Date.now() / 1000) - 30};
//         const token = jwt.sign(dataJWT, config.jwtSecret);
//     }
//     catch(err){
//         console.log(err);
//         res.status(200).send({ok: false})
//     }
//     finally{
//         return res.redirect("http://localhost:3001/login");
//     }
// })

//Create the http server.

const httpsOptions = {
    key: fs.readFileSync("./ssl/localhost_7034.key"),
    cert: fs.readFileSync("./ssl/localhost_7034.cert")
}

let server = https.createServer(httpsOptions, app);
//let server = http.createServer(app);
server.listen(port);
console.log("The server has started on port " + port);
module.exports = app;