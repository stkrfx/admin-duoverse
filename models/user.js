const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    fullName: {
        type: String,
    },
    picture: {
        type: String,
    },
    mobile: {
        type: String,
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
        type: String,
        default: '0',
    },
    coins:{
        type: String,
        default: '0',
    },
    earnings:{
        type: String,
        default: '0',
    },
    matches: [
        {
            matchId: {
                type: String,
            },
            score: {
                type: Number
            }
        }
    ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
