const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    username: {
        type: String,
    },
    order: {
        type: String,
    },
    date: {
        type: Date,
    },
    hash: {
        type: String,
        unique: true,
    }
})

module.exports = mongoose.model('Order', OrderSchema);