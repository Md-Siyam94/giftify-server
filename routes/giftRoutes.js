const express = require('express');
const Gift = require("../models/Gift")

const router = express.Router();


// Get all gifts
router.get("/", async(req, res)=>{
    const gifts = await Gift.find();
    res.json(gifts)
})

// Get single gift
router.get("/:email", async(req, res)=>{
    const email = req.params.email;
    const gift = await Gift.findOne({email: email});
    if(!gift){
        return res.status(404).json({ message: "No gift found for this email" });
    }
    res.json(gift)
})



// Post gift
router.post("/create", async(req, res)=>{
    const newGift = new Gift(req.body);
    await newGift.save();
    res.status(201).json({ success: true, data: newGift });
})



// Edit gift
router.patch("/update/:id", async(req, res)=>{

})

// Delelte gift
router.delete("/delete/:id", async(req, res)=>{

})

module.exports= router