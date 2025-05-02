const express = require("express")
const User = require('../models/User')
const Payment = require('../models/Payment');
const { default: mongoose } = require("mongoose")

const router = express.Router();

//  Counting all user
router.get("/admin-stats", async (req, res) => {
        const totalUser = await User.estimatedDocumentCount();
        res.send({ totalUser });

});

// FOr Analytic counting user in monthly~~~~~~~~~~~~~~~~~
router.get('/monthly-users', async (req, res) => {
        try {
                const currentYear = new Date().getFullYear();

                const monthlyData = await User.aggregate([
                        {
                                $match: {
                                        createdAt: {
                                                $gte: new Date(`${currentYear}-01-01`),
                                                $lte: new Date(`${currentYear}-12-31`)
                                        }
                                }
                        },
                        {
                                $group: {
                                        _id: { $month: "$createdAt" },
                                        total: { $sum: 1 }
                                }
                        },
                        {
                                $sort: { "_id": 1 }
                        }
                ]);

                // Fill missing months with 0
                const fullData = Array.from({ length: 12 }, (_, i) => {
                        const found = monthlyData.find(item => item._id === i + 1);
                        return {
                                name: new Date(0, i).toLocaleString('default', { month: 'short' }),
                                users: found ? found.total : 0
                        };
                });

                res.json(fullData);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
});

// Get Purchasing user for Analytics Pie api
router.get("/purchase-stats", async (req, res) => {
        try {
                const totalUsers = await User.countDocuments();
                const usersWithPurchase = await Payment.distinct("email");
                const totalPurchased = usersWithPurchase.length;
                const totalNotPurchased = totalUsers - totalPurchased;
                res.json({
                        purchased: totalPurchased,
                        notPurchased: totalNotPurchased,
                        total: totalUsers
                });
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
});

// // Get latest 3 users
router.get("/latest-users", async (req, res) => {
        try {
                const latestUsers = await User.find()
                        .sort({ createdAt: -1 })
                        .limit(3);
                res.json(latestUsers);
        } catch (err) {
                res.status(500).json({ error: err.message });
        }
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