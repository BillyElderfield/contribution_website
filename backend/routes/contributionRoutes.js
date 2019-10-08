const express = require("express");
const router = express.Router();
const db = require("mssql");
const Contribution = require("../models/Contribution");
const { authUser } = require("./authentication");

router.post("/create", authUser, async (req, res)=>{
    const { userDetails, date, duration, task } = req.body;
    try{
        createContribution = await Contribution.create(userDetails.userId, date, duration, task)
        res.status(200).send()
    }
    catch(err){
        console.log(err)
        res.status(500).send({err})
    }
    finally{
        await db.close();
    }
});

router.get("/:profileRef", async (req, res)=>{
    const { profileRef } = req.params;
    try{
        contributions = await Contribution.getContributionsByProfileRef(profileRef);
        res.status(200).send(contributions);
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
    finally{
        await db.close();
    }
});

module.exports = router;