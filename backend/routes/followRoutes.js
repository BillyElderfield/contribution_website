const express = require("express");
const router = express.Router();
const db = require("mssql");
const {authUser} = require("./authentication");
const Follow = require("../models/Follow")

router.get("/isFollowing/:profileRef", authUser, async(req, res)=>{
    try{
        const { profileRef } = req.params;
        const { userId } = req.body;
        const followers = Follow.followersByProfileRef(profileRef);
        const isFollowing = followers.reduce((prev, curr)=>{
            return {count: prev.count + (curr.follower == userId ? 1 : 0)}
        })
        res.status(200).send(isFollowing);
    }
    catch(err){
        console.log(err);
        res.status(500).send();
    }
})

router.get("/followStats/:profileRef", async (req, res)=>{
    try{
      const { profileRef } = req.params;
      let followStats = await Follow.getFollowStats(profileRef);
      res.status(200).send(followStats);
    }
    catch(err){
      console.log(err);
      res.status(500).send(err);
    }
    finally{
      await db.close();
    }
  });

module.exports = router;