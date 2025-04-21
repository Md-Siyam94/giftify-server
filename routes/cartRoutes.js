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