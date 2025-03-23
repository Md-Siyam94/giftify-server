const express = require("express")
const User = require('../models/User')
const { default: mongoose } = require("mongoose")

const router = express.Router();

// get all user
router.get("/", async(req, res)=>{
        const users = await User.find();
        res.json(users)
})

// Post a user
router.post("/create", async(req, res)=>{
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
})

// get single user
router.get("/:email", async(req, res)=>{

})
// Update a user
router.patch("/update/:id", async(req, res)=>{

})
// delete a user
router.delete("/delete/:id", async(req, res)=>{

})



module.exports = router;