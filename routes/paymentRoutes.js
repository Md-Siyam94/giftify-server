const mongoose = require("mongoose");
const express = require('express');
const Payment = require('../models/Payment');
const Cart = require('../models/Cart');


const router = express.Router();


// Get all payments for a specific user
router.get("/:email", async (req, res) => {
    const email = req.params.email;
    try {
        const payments = await Payment.find({ email: email }).sort({ createdAt: -1 });  // newest first
        if (payments.length === 0) {
            return res.status(404).json({ message: "No payment found for this email" });
        }
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



// Posting a payment
router.post("/create", async (req, res) => {
    try {
        const { cartIds, ...paymentData } = req.body;

        // Saving the payment
        const newPayment = new Payment({ ...paymentData, cartIds });
        const paymentResult = await newPayment.save();

        // Deleting all cart items by IDs
        const deleteResult = await Cart.deleteMany({
            _id: { $in: cartIds.map(id => new mongoose.Types.ObjectId(id)) }
        });

        res.status(201).json({
            success: true,
            message: "Payment created and cart items deleted.",
            payment: paymentResult,
            deletedCarts: deleteResult
        });
    } catch (error) {
        console.error("Payment error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});




module.exports = router