const express = require("express")
const User = require('../models/User')
const { default: mongoose } = require("mongoose")

const router = express.Router();

//  Counting all user
router.get("/admin-stats", async (req, res) => {
        const totalUser = await User.estimatedDocumentCount();
        res.send({ totalUser });

});

// get all user
router.get("/", async (req, res) => {
        const users = await User.find();
        res.json(users)
})

// Post a user
router.post("/create", async (req, res) => {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
})

// get single user
router.get("/:email", async (req, res) => {

})
// Update a user
router.patch("/update/:id", async (req, res) => {

})
// delete a user
router.delete("/delete/:id", async (req, res) => {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
        res.json({ success: true, data: deletedUser });

})



module.exports = router;