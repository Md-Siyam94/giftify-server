const { model } = require("mongoose");

const mongoose = require("mongoose");


const PaymentSchema = new mongoose.Schema({
    email: {
        type: String,
    },
    price: {
        type: Number,
    },
    transactionId: {
        type: String,
    },
    date: {
        type: String,
    },
    cartIds: {
        type: Array,
    },
    giftIds: {
        type: Array,
    },
    status: {
        type: String,
    }

}, { timestamps: true }
);


const Payment = mongoose.model("Payment", PaymentSchema);

module.exports = Payment