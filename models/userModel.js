const mongoose = require('mongoose');
const validator = require("validator");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        validate: validator.isEmail,
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [5, 'Password must contain minnimum characters']
    },
    googleId: {
        type: String
    },
    coin: {
        type: Number,
    },
    verified:{
        type: Boolean
    }
}, {timestamps: true});

const User = mongoose.model("User", UserSchema);

module.exports = User;