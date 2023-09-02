const mongoose = require('mongoose');

// Define the Match Schema
const matchSchema = new mongoose.Schema({
    matchUid:{
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    subCategory: {
        type: String,
        required: true,
    },
    teamType: {
        type: String,
        required: true,
    },
    coverPhoto: {
        type: String,
    },
    prizePool: {
        type: String,
        required: true,
    },
    perKill: {
        type: String,
        required: true,
    },
    entryFee: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    totalSpots: {
        type: Number,
        required: true,
    },
    spectateLink: {
        type: String,
        required: true,
    },
    matchId: {
        type: String,
        required: true,
    },
    matchPass: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        default: 'pening'
    },
    users: [
        {
            user:{
                type:String
            },
            paid:{
                type:String
            },
            bgmi:{
                type:String
            },
            freefire:{
                type:String
            },
            score:{
                type:Number
            }
        }
    ]
});

// Create a Match model
const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
