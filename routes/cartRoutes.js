const express = require('express');
const Cart = require('../models/Cart');

const router = express.Router();




// Get all cart's all gifts
router.get("/", async (req, res) => {
    const carts = await Cart.find();
    res.json(carts)
})



// Get specific user's cart
router.get("/:email", async (req, res) => {
    const email = req.params.email;
    const cart = await Cart.findOne({ email: email });
    if (!cart) {
        return res.status(404).json({ message: "No cart found for this email" });
    }
    res.json(cart)
})



// Post gift into cart
router.post("/create", async (req, res) => {
    const newCart = new Cart(req.body);
    await newCart.save();
    res.status(201).json({ success: true, data: newCart });
})


router.patch('/item/:id', async (req, res) => {
    const { id } = req.params;
    // pull in both quantity *and* message fields
    const { quantity, receiver, message, sender } = req.body; // ← updated

    // build a dynamic $set payload
    const updateFields = {};

    // ── quantity logic (unchanged) ──
    if (quantity !== undefined) { // ← now only runs if quantity was passed
        if (typeof quantity !== 'number' || quantity < 1) {
            return res
                .status(400)
                .json({ success: false, message: 'Quantity must be a positive number' });
        }
        updateFields.quantity = quantity; // ← existing behavior
    }

    // ── new message logic ──
    if (receiver !== undefined || message !== undefined || sender !== undefined) { // ← new
        // basic validation
        if (typeof receiver !== 'string' || !receiver.trim()) {
            return res
                .status(400)
                .json({ success: false, message: 'Receiver name is required' });
        }
        if (typeof message !== 'string' || !message.trim()) {
            return res
                .status(400)
                .json({ success: false, message: 'Message text is required' });
        }
        if (typeof sender !== 'string' || !sender.trim()) {
            return res
                .status(400)
                .json({ success: false, message: 'Sender identifier is required' });
        }

        // set the new message fields
        updateFields.receiver = receiver; // ← new
        updateFields.message = message;  // ← new
        updateFields.sender = sender;   // ← new
    }

    // if nothing valid to update, bail out
    if (Object.keys(updateFields).length === 0) { // ← new
        return res
            .status(400)
            .json({ success: false, message: 'No valid fields provided to update' });
    }

    try {
        // apply both quantity and/or message updates in one go
        const updatedItem = await Cart.findByIdAndUpdate(
            id,
            { $set: updateFields },           // ← updated
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res
                .status(404)
                .json({ success: false, message: 'Cart item not found' });
        }

        // Success — return the updated cart item (with quantity and/or message)
        res.json({ success: true, data: updatedItem });
    } catch (err) {
        console.error('Error updating cart item:', err);
        res
            .status(500)
            .json({ success: false, message: 'Server error while updating cart item' });
    }
});



// DELETE a specific cart item by ID
router.delete("/item/:id", async (req, res) => {
    const { id } = req.params;
    const result = await Cart.findByIdAndDelete(id);
    if (!result) {
        return res.status(404).json({ message: "Cart item not found or already deleted" });
    }
    res.json({ success: true, message: "Cart item deleted" });
});



// DELETE all carts for a specific user
router.delete("/clear/:email", async (req, res) => {
    const email = req.params.email;
    const result = await Cart.deleteMany({ email: email });
    if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No cart found to delete" });
    }
    res.json({ success: true, message: "Cart cleared", deletedCount: result.deletedCount });
});


module.exports = router