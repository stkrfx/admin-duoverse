const mongoose = require('mongoose');

// Define the Match Schema
const withdrawSchema = new mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    upi: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
});

// Create a Match model
const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;
