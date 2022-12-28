const { randomBytes, createHash, randomInt } = require("crypto");
const { Schema, model } = require("mongoose");
const bcryptjs = require("bcryptjs");
const { genSalt, hash, compare } = bcryptjs;
const jwt = require('jsonwebtoken');
const { sign } = jwt;
const twofactor = require("node-2fa");
const ErrorResponse = require("../utils/errorResponse.js");

const UserSchema = new Schema({
    altid: {
        type: String,
        minlength: [10," Alternative ID should be minimum of 10 characters "],
	    unique: [true, " Alternative ID already exists in database! "],
        immutable: true,
    },
    username: {
        type:String,
        required: [true, " Please povide a username! "],
        minlength: [4, " Name should be minimum of 4 characters "],
	    unique: [true, " Username already exists in database! "],
        lowercase: true,
    }, 
    email: {
        type: String,
        required: [true, " Please provide a email! "],
        unique: [true, " Email already exists in database! "],
        lowercase: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, " Please provide a valid email! "
        ]
    },
    password: {
        type: String,
        required: [true, " Please add a password "],
        minlength:[8, " Password should be minimum of 8 characters "],
        select: false
    },
    role: {
        type: String,
        enum: ["normal", "admin"],
        required: [false, " Wish to change user role please go into database! "],
        default: "normal"
    },
    OTPToken: String,
    OTPTokenExpire: Date,
    verifiedEmail: Boolean,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verifiedPassword: Boolean,
    TwoFAKey: Object,
    verifiedTwoFA: Boolean,
    validatedTwoFA: Boolean,
    validationResetTime: Date,
    preferedTwoFA: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(password) {
    return await compare(password, this.password);
}

UserSchema.methods.setInit = async function (req, res, next) {

    try {
      if (!this.verifiedEmail) {
        return next(new ErrorResponse(`Your registered Email is not verified yet! Make sure proccess is completed in order to continue...`, 403));
      } else {

        if (!this.preferedTwoFA) { // normal user log in
            const token = this.getSignedToken();
            
            const { _doc, ...other } = this;
            const {_id, altid, password, TwoFAKey, ...data} = _doc;
            await res.status(201).json({
                success: true, 
                status: `LOGGED`, 
                message: `You have been logged in successfully!`, 
                token,
                data: data,
            });
        } else { // user with two factor is enable or turn on state

            if (!this.validationResetTime) {

                return next(new ErrorResponse(`You are in a state which [Token] of 2FA (Two Factor) authentication is expired! Please valid your token to continue...`, 422));

            } else {

                if (!this.validatedTwoFA) {
                    return next(new ErrorResponse(`You are in a state which 2FA (Two Factor) authentication is not validated! Please valid your authentication to continue...`, 422));
                } else {
                    
                    if (this.validationResetTime < Date.now()) {
                        return next(new ErrorResponse(`Your Two Factor Authentication Token is expired! Please Validated to continue...`, 422));
                    } else {
                        const token = this.getSignedToken();
                        
                        const { _doc, ...other } = this;
                        const {_id, altid, password, TwoFAKey, ...data} = _doc;

                        await res.status(201).json({
                            success: true, 
                            status: `SIGNED`, 
                            message: `You have been signed in successfully!`, 
                            token,
                            data: data
                        });
                    }

                }

            }

            
        }

      }
      
      

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
}

UserSchema.methods.getSignedToken = function() {
    return sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE});
}

UserSchema.methods.getOTPConfirmEmail = async function() {

    function reverseString(str) {
        return str.slice('').reverse('').join('');
    }

    const otpMath = `${
        Math.floor(
            Math.random() * 99999 + 100000
        )
    }`;

    const otpString = String(otpMath);

    let randomOTP = [...String(otpString)];
    const n1 = randomInt(1, 10);
    const n2 = randomInt(1, 10);
    randomOTP[0] = String(n1);
    randomOTP[5] = String(n2);
    
    const OTP = await reverseString(randomOTP);
    const ParseOTP = parseInt(OTP);

        // Hash the OTP
    const saltRounds = await genSalt(10);
    const hashedOTP = await hash(OTP, saltRounds);

    this.OTPToken = hashedOTP;
    this.OTPTokenExpire = Date.now() + 10 * (60 * 1000); // Equal 10 min [milliseconds]

    return ParseOTP;
}

UserSchema.methods.getResetPasswordToken = function() {
    const resetToken = randomBytes(20).toString("hex");

    this.resetPasswordToken = createHash("sha256")
        .update(resetToken)
        .digest("hex");
    this.resetPasswordExpire = Date.now() + 15 * (60 * 1000); // Equal 15 min [milliseconds]

    return resetToken;
}

UserSchema.methods.getTwoFAToken = function() {
    const temp_key = twofactor.generateSecret({ name: process.env.BRAND_NAME, account: this.username });
    this.TwoFAKey = temp_key;
    return temp_key;
}

UserSchema.methods.verifyTwoFAToken = function (token) {
    const result = twofactor.verifyToken(this.TwoFAKey.secret, token);
    // => { delta: 0 } 
    // {delta: -1} means that the client entered the key too late (a newer key was meant to be used). 
    // {delta: 1} means the client entered the key too early (an older key was meant to be used). 
    // {delta: 0} means the client was within the time frame of the current key.
    return result.delta;
}

UserSchema.methods.validateTwoFAToken = function(token) {
    const result = twofactor.verifyToken(this.TwoFAKey.secret, token);
    return result.delta;
}

const User = model("User", UserSchema);

module.exports = User;