var User = require('../models/User')
const express = require("express");
const router = express.Router();
const db = require("mssql");
const bcrypt = require('bcrypt-nodejs');
const jwt = require("jsonwebtoken");
const {authUser} = require("./authentication");

const tokenCookie = "zboxmtotlm";
let generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}
let validPassword = function(password, hash){
  return bcrypt.compareSync(password, hash);
}

router.post("/register", async (req, res)=>{
  const { email, username, password } = req.body;
  try{
    let registrationAttempt = await User.register(email, username, password);
    if(registrationAttempt.success) return res.status(200).send();
    res.status(401).send({error: registrationAttempt.error});
  }
  catch(err){
    console.log(err);
    res.status(500).send({err})
  }
  finally{
    await db.close();
  }
});

router.post("/login", async (req, res)=>{
  const { email, password } =  req.body;
    try{
      console.log(generateHash("test"))
      let loginAttempt = await User.login(email, password);
      if(loginAttempt.success){
        let { userId, username, profileRef } = loginAttempt.tokenData;
        let dataJWT = {userId, username, profileRef, iat: Math.floor(Date.now() / 1000) - 30};
        let token = jwt.sign(dataJWT, process.env.JWT_SECRET);
        res.cookie("zboxmtotlm", token, {signed: true, httpOnly: true, sameSite: true, secure: true, maxAge: 50000000000});
        return res.status(200).send({token});
      }
      res.status(401).send({error: loginAttempt.error});
    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
    finally{
      //await db.close();
    }
});

router.post("/logout", async(req, res)=>{
  res.clearCookie(tokenCookie).status(200).send();
});

router.post("/auth", authUser, (req, res)=>{
  const { username, profileRef } = req.body.userDetails;
  res.status(200).send({username, profileRef});
});

router.get("/test", (req, res)=>{
  res.status(200).send(req.cookies);
});

module.exports = router;