const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
    },
    mobile: {
        type: String,
        required: true,
    },
    referralCode: {
        type: String,
    },
    bgmi: {
        type: String,
    },
    freefire: {
        type: String,
    },
    username: {
        type: String,
        unique: true,
    },
    bonus:{
        type: Number,
        default: 0,
    },
    coins:{
        type: Number,
        default: 0,
    },
    earnings:{
        type: Number,
        default: 0,
    },
    kills:{
        type: Number,
        default: 0,
    },
    otp:{
        type: String,
        required: true,
    },
    deposit:{
        type:String,
        default: 0,
    },
    matches: [
        {
            matchId: {
                type: String,
            },
            score: {
                type: Number,
                default:0,
            }
        }
    ],
    wallet:[
        {
            type: {
                type: String,
            },
            date: {
                type: Date,
            },
            amt:{
                type: String,
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
