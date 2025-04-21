const { model } = require("mongoose");

const mongoose = require("mongoose")


const CartSchema = new mongoose.Schema({
    giftId: {
        type: String,
    },
    email: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rating: {
        type: Number // optional by default
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"

    },
    featured: {
        type: Boolean,

    }

}, { timestamps: true }
);


const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart