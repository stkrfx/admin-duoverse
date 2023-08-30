const mongoose = require('mongoose');

// Define the Match Schema
const notifySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        required: true,
    },
});

// Create a Match model
const Notify = mongoose.model('Notify', notifySchema);

module.exports = Notify;
