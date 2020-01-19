const mongoose = require("mongoose");
const {Schema} = require('mongoose')

// A simple user database blueprint
const UserSchema = new Schema({
    name: String,
    emailAddress:{
        type: String,
        required: true,
        unique: true,
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = User = mongoose.model('User', UserSchema);