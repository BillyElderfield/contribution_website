const jwt = require("jsonwebtoken")
const tokenCookie = "zboxmtotlm";
const User = require("../models/User");

function getTokenValues(values, req, res){
    const token = req.signedCookies[tokenCookie]
    console.log("Dd: " + token)
    if(!token || typeof token === "undefined") {
        res.status(401).send({error: "Invalid auth token."});
        return {error: true};
    }
    let returnValues = {error: false};
    return jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
        if (err) {
            res.status(500).send({error: "Error verifying your token."});
            return {error: true};
        }
        for(let i = 0; i < values.length; i++){
            returnValues[values[i]] = decoded[values[i]];
        }
        return returnValues;
    });
  }

authUser = async (req, res, next)=>{
    const {error, userId, username, profileRef} = getTokenValues(["userId", "username", "profileRef"], req, res);
    if(!error){
        if(!await User.validUserId(userId)){
            return res.status(401).send("Invalid auth token.");
        }
        req.body.userDetails = {userId, username, profileRef};
        next();
    }
}

  module.exports = {authUser}