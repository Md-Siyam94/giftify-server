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
        // checking existing user or not
        const query = { email: newUser.email }
        const existingUser = await User.findOne(query);
        if (existingUser) {
                return res.send({ message: "User Already Exists" })
        }
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
})


// Get single user by Email
router.get("/:email", async (req, res) => {
        const email = req.params.email;
        try {
                const user = await User.findOne({ email });
                if (!user) return res.status(404).json({ message: "User not found" });
                res.json(user);
        } catch (error) {
                res.status(500).json({ error: error.message });
        }
});

// Update a user by Id
router.patch("/update/:id", async (req, res) => {
        try {
                const updatedUser = await User.findByIdAndUpdate(
                        req.params.id,
                        { $set: req.body },
                        { new: true }
                );

                if (!updatedUser) {
                        return res.status(404).json({ success: false, message: "User not found" });
                }

                res.json({ success: true, data: updatedUser });
        } catch (error) {
                res.status(500).json({ success: false, error: error.message });
        }
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