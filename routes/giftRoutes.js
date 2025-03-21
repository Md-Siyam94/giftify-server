const express = require('express');
const Gift = require("../models/Gift")

const router = express.Router();


// Get all gifts
router.get("/get", async(req, res)=>{
    const gifts = await Gift.find();
    res.json(gifts)
})

// Get single gift
router.get("/get/:id")



// Post gift
router.post("/create", async(req, res)=>{
    const newGift = new Gift(req.body);
    await newGift.save();
    res.status(201).json({ success: true, data: newGift });
})



// Edit gift
router.put("/update/:id", async(req, res)=>{

})

// Delelte gift
router.delete("/delete/:id", async(req, res)=>{

})

module.exports= router