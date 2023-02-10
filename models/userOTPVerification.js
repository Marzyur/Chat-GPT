const mongoose = require("mongoose");

const UserOTPVerificationSchema =  new mongoose.Schema({
    email : String,
    otp: String,
    createdAt: Date,
    expireAt: Date,
});

const UserOTPVerification = mongoose.model("UserOTPVerfication", UserOTPVerificationSchema);

module.exports = UserOTPVerification;