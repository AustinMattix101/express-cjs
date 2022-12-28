const { v4 } = require('uuid');
const { createHash } = require("crypto");
const bcryptjs = require('bcryptjs');
const { compare } = bcryptjs;
const User = require("../models/User.js");
const Profiles = require("../models/Profile.js");
const ErrorResponse = require("../utils/errorResponse.js");
const sendEmail = require("../utils/sendEmail.js");
const { deleteProfileByUsername } = require("./profile.js");
const { tRegister, tForgotpassword, tResetpassword, tSendEmailConfirm, tVerifyEmail } = require("../middlewares/emailTemplate");

module.exports.getHello = function (req, res) {
    res.json({ message: `Welcome to Camunited Auth API!` });
};

module.exports.register = async function (req, res, next) {

    const altid = v4();

    const { username, email, password, accepttos, ...other } = req.body;

    try {
        if (!username || !email || !password || !accepttos) {
            return next(new ErrorResponse(`Please provide account detail in order to create a new account!`, 400));
        }

        const user = await User.create({
            altid,
            username,
            email,
            password
        });

        const profile = await Profiles.create({
            altid,
            username,
            accepttos,
            ...other
        });

        const message = tRegister(user.username);

        console.log(`CreatedCongratulations: ${message}`);

        sendEmail({
            to: user.email,
            subject: "Congratulations, Account has been created!",
            text: message,
        });

        await res.status(201).json({
            success: true,
            status: `CREATED`,
            message: `Account Create successfully!`,
            data: {
                email: user.email,
                username: user.username,
            }
        });

        console.log(`User Register: 
        Account Data: ${user},
        Profile Data: ${profile}`);

    } catch (error) {
        await User.deleteOne({ altid });
        await Profiles.deleteOne({ altid });
        next(error);
    }
};

module.exports.login = async function (req, res, next) {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide an email and password", 400));
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(new ErrorResponse(`Log Email Not Found! [ Invalid credentials]: ${email}`, 401));
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse("Log Password incorrect! [Invalid credentials]", 401));
        }

        await user.setInit(req, res, next);

        console.log(`User Login: ${user}`);

    } catch (error) {
        next(error);
    }
};

module.exports.forgotpassword = async function (req, res, next) {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return next(new ErrorResponse(`Email could not be found! Email: ${email}`, 404));
        } else {

            if (!user.verifiedEmail) {
                return next(new ErrorResponse(`Your registered Email is not verified yet! Make sure proccess is completed in order to continue...`, 403));
            } else {

                const resetToken = user.getResetPasswordToken();

                await user.save();

                const message = tForgotpassword(resetToken);

                console.log(`ResetPasswordEmailToken: ${message}`);

                try {
                    await sendEmail({
                        to: user.email,
                        subject: "Password Reset Request",
                        text: message
                    });
                    await res.status(201).json({
                        success: true,
                        status: `PENDING`,
                        message: `Reset Password Email have been Sent to Email: ${user.email}!`,
                        data: { email: user.email }
                    });
                } catch (error) {
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpire = undefined;

                    await user.save();

                    return next(new ErrorResponse("Email could not be send!", 500));
                }

            }
        }
    } catch (error) {
        next(error);
    }
};

module.exports.resetpassword = async function (req, res, next) {
    const resetPasswordToken = createHash("sha256").update(req.params.resetToken).digest("hex");

    function sendEmailHelper (user) {

        const message = tResetpassword(user.username);

        console.log(`PasswordResetCongratulations: ${message}`);

        return sendEmail({
            to: user.email,
            subject: "Congratulations, Your Password has been reseted!",
            text: message
        });
    }

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return next(new ErrorResponse("Error: [Invalid Reset Token!] Make sure your token is valid!", 400));
        } else {
            if (!user.verifiedEmail) {

                return next(new ErrorResponse(`Your registered Email is not verified yet! Make sure proccess is completed in order to continue...`, 403));

            } else {

                if (!user.preferedTwoFA) {

                    user.password = req.body.password;
                    user.verifiedPassword = undefined;
                    user.resetPasswordToken = undefined;
                    user.resetPasswordExpire = undefined;

                    await user.save();

                    sendEmailHelper(user);

                    await res.status(201).json({
                        success: true,
                        status: `RESETED`,
                        message: `Password Reseted Successfully on Email ${user.email}`,
                        data: { email: user.email }
                    });

                } else {

                    if (!user.validationResetTime) {
                        return next(new ErrorResponse(`You are in a state which [Token] of 2FA (Two Factor) authentication is expired! Please valid your token to continue...`, 401));

                    } else {

                        if (!user.validatedTwoFA) {
                            return next(new ErrorResponse(`You are in a state which 2FA (Two Factor) authentication is not validated! Please valid your authentication to continue...`, 401));
                        } else {

                            if (user.validationResetTime < Date.now()) {
                                return next(new ErrorResponse(`Your Two Factor Authentication Token is expired! Please Validated to continue...`, 401));
                            } else {
                                user.password = req.body.password;
                                user.verifiedPassword = undefined;
                                user.resetPasswordToken = undefined;
                                user.resetPasswordExpire = undefined;

                                await user.save();

                                sendEmailHelper(user);

                                await res.status(201).json({
                                    success: true,
                                    status: `RESETED`,
                                    message: `Password Reseted Successfully on Email ${user.email}`,
                                    data: { email: user.email }
                                });
                            }

                        }

                    }

                }

            }
        }

    } catch (error) {
        next(error);
    }
};

module.exports.sendEmailConfirm = async function (req, res, next) {
    // Confirm Email after Register
    const { email } = req.body;
    const user = await User.findOne({ email });

    try {
        if (!email) {
            return next(new ErrorResponse(`Please provide a email address to get an email of confirmation!`, 400));
        }

        if (!user) {
            return next(new ErrorResponse(`Email you given not found! Email: ${email}`, 404));
        }

        if (user.verifiedEmail) {
            return next(new ErrorResponse(`You Email confirmation was passed! [Configuraton is true]`, 403));
        }

        const OTP = await user.getOTPConfirmEmail();
        console.log(`OTP:`, OTP);
        await user.save();

        const message = tSendEmailConfirm(OTP);

        console.log(`OTPConfirmEmail: ${message}`);

        await sendEmail({
            to: user.email,
            subject: "Email Confirmation Request",
            text: message
        });

        await res.status(201).json({
            success: true,
            status: `PENDING`,
            message: `Email Confirmation have been Sent to ${user.email}`,
            data: { email: user.email }
        });

    } catch (error) {
        user.OTPToken = undefined;
        user.OTPTokenExpire = undefined;

        await user.save();

        console.log(`Error: ${error}`);
        next(error);
    }
};

module.exports.verifyEmail = async function (req, res, next) {
    const { token, email } = req.body;

    try {
        if (!token || !email) {
            return next(new ErrorResponse(`Please provide an email and confirm token!`, 400));

        } else {

            const user = await User.findOne({ email });

            if (!user) {
                return next(new ErrorResponse("Email not found! Make sure your email is correct!!", 400));
            } else {

                if (user.verifiedEmail) {
                    return next(new ErrorResponse(`You Email confirmation was passed! [Configuraton is true]`, 403));

                } else {

                    if (user.OTPTokenExpire < Date.now()) {
                        return next(new ErrorResponse(`Your Email confirmation token was expired! Please Resend a new one!`, 403));

                    } else {

                        const verified = await compare(token, user.OTPToken);

                        if (!verified) {
                            return next(new ErrorResponse(`Your token is invalid`, 401));

                        } else {

                            user.verifiedEmail = true;
                            user.OTPToken = undefined;
                            user.OTPTokenExpire = undefined;
                            await user.save();

                            const message = tVerifyEmail(user.username);

                            console.log(`VerifiedCongratulations: ${message}`);

                            sendEmail({
                                to: user.email,
                                subject: "Congratulations, Email of your account has been verified!",
                                text: message
                            });

                            await res.status(201).json({
                                success: true,
                                status: `VERIFIED`,
                                message: `Email Confirmation Verified Successfully on Email: ${user.email}!`,
                                data: { email: user.email },
                            });
                        }
                    }

                }
            }

        }

    } catch (error) {
        next(error);
    }
};

module.exports.altPasswordConfirm = async function (req, res, next) {
    // Confirm Password in order to make some sensitive changes!
    const { altid } = req.user;
    const { password } = req.body;
    const user = await User.findOne({ altid }).select("+password");

    try {
        if (!password) {
            return next(new ErrorResponse(`Please provide a password to pass through!`, 400));
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return next(new ErrorResponse("Password incorrect, Invalid credentials", 401));
        }

        if (user.verifiedPassword) {
            return next(new ErrorResponse(`You password verification was passed! [Configuraton is true]`, 403));
        }

        user.verifiedPassword = true;

        await user.save();

        await res.status(201).json({
            success: true,
            status: `VERIFIED`,
            message: `Password Confirm successfully: ${isMatch}`
        });

    } catch (error) {

        user.verifiedPassword = undefined;

        await user.save();

        console.log(`Error: ${error}`);
        next(error);
    }
};

module.exports.deleteAccountByUsername = async function (req, res, next) {
    try {
        if (req.user.username === req.params.username) {
            return next(new ErrorResponse(`Forbidden, Oh! No You are proposed to delete your own account with given username: [${req.params.username}]! `, 403));
        }

        await User.deleteOne({ username: req.params.username });
        await deleteProfileByUsername(req, res, next);

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
};

module.exports.changeEmail = async function (req, res, next) {
    const { altid } = req.user;
    const { email } = req.body;

    try {
        if (!email) {
            return next(new ErrorResponse(`Please provide a new email address to continue...`, 400));
        }

        if (req.user.email === email) {
            return next(new ErrorResponse(`You provided as a current email address!`, 403));
        }

        const user = await User.findOneAndUpdate({ altid }, { $set: { email: email } }, { new: true });

        user.verifiedEmail = undefined;
        await user.save();

        await res.status(201).json({
            success: true,
            status: `UPDATED`,
            message: `Email Changing Operation was successfull! Previous Email: ${req.user.email} `,
            data: { email: user.email },
        });

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
};

module.exports.findEmailByUsername = async function (req, res, next) {
    const { username } = req.body;
    try {
        if (!username) {
            return next(new ErrorResponse(`Please provide an username to continue...`, 400));
        } else {
            const user = await User.findOne({ username });

            if (!user) {
                return next(new ErrorResponse(`Username you provided not found! Make sure your username is correct!`, 404));
            } else {
                if (!user.verifiedEmail) {
                    return next(new ErrorResponse(`Your registered Email is not verified yet! Make sure proccess is completed in order to continue...`, 403));
                } else {
                    await res.status(200).json({
                        success: true,
                        status: `FOUNDED`,
                        message: `An Email found which referenced by Username: ${username}`,
                        data: { email: user.email },
                    });
                }
            }
        }

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
};

module.exports.changeUsername = async function (req, res, next) {
    const { altid } = req.user;
    const { username } = req.body;

    try {
        if (!username) {
            return next(new ErrorResponse(`Please Provide your target username in changes!`, 400));
        }

        if (req.user.username === username) {
            return next(new ErrorResponse(`Username are the same as the old one!`, 400));
        }

        const result1 = await User.findOneAndUpdate({ altid }, { $set: { username: username } }, { new: true });

        const result2 = await Profiles.findOneAndUpdate({ altid }, { $set: { username: username } }, { new: true });

        if (!result1) {
            return next(new ErrorResponse(`Error Username Existed!`, 400));
        }

        if (!result2) {
            return next(new ErrorResponse(`Error Username Existed!`, 400));
        }

        const result = `Match Username! [ ${result1.username} : ${result2.username} ]`;

        await res.status(201).json({
            success: true,
            status: `UPDATED`,
            message: `Update Operation successfully! Result: ${result}`,
            data: { username: username },
        });

    } catch (error) {
        console.log(`Error: ${error}`);
        next(error);
    }
};