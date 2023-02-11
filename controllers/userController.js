const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const UserOTPVerfication = require('../models/userOTPVerification')
const { sendMail } = require("../middleware/sendMail");
const { MongoAWSError } = require('mongodb');
const UserOTPVerification = require('../models/userOTPVerification');
// const passport = require('passport')
// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://www.example.com/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));


exports.authentication = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userExist = await User.findOne({email});
        if (userExist){
            const match = await bcrypt.compare(password, userExist.password)
            if(match){
                if(userExist.verified){
                res.status(200).json({
                    status: "Success",
                    userData: userExist
                })}
                else{
                    await UserOTPVerfication.deleteMany({email});
                    sendOTPVerificationEmail(userExist, res)
                }
            }
            else{
                res.status(404).json({
                    status: "Failed",
                    message: "Email or password doesn't match"
                })
            }
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(password, salt);
            const newUser = await User({
                email,
                password: securePassword,
                verified: false,
            });

            newUser
            .save()
            .then((result) => {
                sendOTPVerificationEmail(result, res)
            })
            .catch((err)=>{
                res.json({
                    status: "FAILED",
                    message : "An error occured while saving user account"
                });
            })
        }
    }
    catch(err){
        res.status(400).json({
            error: err
        })
    }
}
const sendOTPVerificationEmail = async ({email}, res) => {
    try{
        await UserOTPVerfication.deleteMany({email});
        const otp =`${Math.floor(1000 + Math.random() * 9000)}`;
          const salt = await bcrypt.genSalt(10);
          const secureOTP = await bcrypt.hash(otp, salt);
          const newOTPVerification = await new UserOTPVerfication({
            email: email,
            otp: secureOTP,
            createdAt: Date.now(),
            expireAt: Date.now() + 300000
          });
          await newOTPVerification.save();
          await sendMail({
            email: email,
            subject: "OTP for verification at Chat GPT",
            html: `<p><b>${otp}</b> is your OTP for verification at Chat GPT</p>
            <p>This OTP is valid only for 5 mintues</p>
            <p></p>
            <p>Thanks and Regards,</p>
            <p>Team Chat GPT</p>`
          });
          res.json({
            status: "PENDING",
            message: "Verification otp email sent"
          })
    }
    catch(error){
        res.json({
            staus: "FAILED",
            message: error.messages
        })
    }
}

exports.verifyOTP = async (req, res) =>{
    try{
        const {email, otp} = req.body;
        if(!email || !otp) {
            throw Error("Empty otp details are not allowed")
        }
        else{
             const userOTPVerficationRecords = await UserOTPVerfication.find({
                email
             });
             if (userOTPVerficationRecords.length <= 0){
                throw new Error(
                    "Account record doesn't exist or haas been verified already. Please sign up or signin again"
                )
             }
             else{
                const {expireAt} = userOTPVerficationRecords[0];
                const securedOTP = userOTPVerficationRecords[0].otp;

                if(expireAt < Date.now()){
                    await UserOTPVerfication.deleteMany({email});
                    throw new Error("Code has expired. Please request again.");
                }
                else{
                    const validOTP = await bcrypt.compare(otp, securedOTP)

                    if(!validOTP){
                        throw new Error("Invalid code passed. Check your inbox.")
                    }
                    else{
                        //success
                        const user = await User.updateOne({email}, {verified: true});
                        await UserOTPVerification.deleteMany({email});
                        res.json({
                            status: "Verified",
                            user: user
                        })
                    }
                }
             }
        }
    }
    catch(error) {
        res.json({
            status: "FAILED",
            message: error.message
        })
    }
}

exports.resendOTP = async (req, res) =>{
    try{
        const {email} = req.body;
        if (!email) {
            throw Error("Empty user details are not allowed");
        }
        else{
            await UserOTPVerfication.deleteMany({email});
            sendOTPVerificationEmail({email}, res);
        }
    }
    catch(error){
        res.json({
        status: "FAILED",
        message: error.message
        })
    }
}

exports.forgotPassword = async (req, res) =>{
    try{
        const {email} = req.body;
        if(!email){
            res.status(502).json({
                status: "FAILED",
                message: "Email is required"
            })
        }
        else{
            await UserOTPVerfication.deleteMany({email});
            sendOTPVerificationEmail(userExist, res);
        }
    }
    catch(err){
        res.json({
            status: "FAILED",
            message: err.message
        })
    }
}

exports.resetPassword = async (req, res) =>{
    try{
        const {email, password} =  req.body;
        const emailExist = await UserOTPVerfication.find({email});
        if(emailExist){
            res.json({
                status: "FAILED",
                message: "user email not verified"
            })
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const securePassword = await bcrypt.hash(password, salt);
            const updateUser = await User.findOneAndUpdate({email},{password: securePassword});
            res.json({
                status: "Success",
                message: "User password updated successfully"
            })
        }
    }
    catch(err){
        res.json({
            status : "FAILED",
            message: err.message
        })
    }
}