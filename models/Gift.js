const { model } = require("mongoose");

const mongoose = require("mongoose")


const GiftSchema = new mongoose.Schema({
        title: {
                type: String,
                required: true,

        },
        description: {
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
        createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"

        },
        featured: {
                type: Boolean,
                required: true
        }


}, { timestamps: true }
);



const Gift = mongoose.model("Gift", GiftSchema);

module.exports = Gift