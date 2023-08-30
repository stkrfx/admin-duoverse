const mongoose = require('mongoose');

// Define the Match Schema
const bannerSchema = new mongoose.Schema({
    banner: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: '#',
    },
});

// Create a Match model
const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;
