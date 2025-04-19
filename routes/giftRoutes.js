const express = require('express');
const Gift = require("../models/Gift")

const router = express.Router();


router.get("/admin-stats", async (req, res) => {
    const totalGift = await Gift.estimatedDocumentCount();
    res.send({  totalGift });

});


// Get all gifts
router.get("/", async (req, res) => {
    const gifts = await Gift.find();
    res.json(gifts)
})

// Get single gift
router.get("/:email", async (req, res) => {
    const email = req.params.email;
    const gift = await Gift.findOne({ email: email });
    if (!gift) {
        return res.status(404).json({ message: "No gift found for this email" });
    }
    res.json(gift)
})



// Post gift
router.post("/create", async (req, res) => {
    const newGift = new Gift(req.body);
    await newGift.save();
    res.status(201).json({ success: true, data: newGift });
})



// Edit gift
router.patch("/update/:id", async (req, res) => {

    // below code is added by Hafiz
    const updatedGift = await Gift.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // returning the updated document
    );

    if (!updatedGift) {
        return res.status(404).json({ success: false, message: "Gift not found" });
    }

    res.json({ success: true, data: updatedGift });
    // above code is added by Hafiz

})

// Delelte gift
router.delete("/delete/:id", async (req, res) => {

    // below code is added by Hafiz
    const deletedGift = await Gift.findByIdAndDelete(req.params.id);
    if (!deletedGift) {
        return res.status(404).json({ success: false, message: "Gift not found" });
    }
    res.json({ success: true, data: deletedGift });
    // above code is added by Hafiz

})

// Latest Gift
router.get("/latest", async (req, res) => {
    try {
        const latestGifts = await Gift.find().sort({ createdAt: -1 }).limit(4);
        res.json(latestGifts);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router