const { Router } = require("express");
const TwoFARouter = Router();
const { corsWithOptions } = require("../middlewares/cors.js");
const PreferedTwoFA = require("../middlewares/preferedTwoFA.js");
const { protect } = require("../middlewares/auth.js");
const { 
        InitOnlyEmailConfirmation,
        InitpreferedTwoFAOption
    } = require("../middlewares/init.js");
const { 
        getTwoFA,
        putTwoFAOn,
        putTwoFAOff,
        postTwoFARegister, 
        postTwoFAVerify, 
        postTwoFAValidate, 
} = require("../controllers/TwoFA.js");

TwoFARouter
        .route("/")
        .options(corsWithOptions)
        .get(getTwoFA);

TwoFARouter
        .route("/on")
        .options(corsWithOptions)
        .put(
                protect, 
                InitOnlyEmailConfirmation, 
                putTwoFAOn
        );

TwoFARouter
        .route("/off")
        .options(corsWithOptions)
        .put(
                protect, 
                InitOnlyEmailConfirmation,
                InitpreferedTwoFAOption,
                putTwoFAOff
        );

TwoFARouter
        .route("/generate")
        .options(corsWithOptions)
        .post(
                protect, 
                InitOnlyEmailConfirmation,
                PreferedTwoFA, 
                postTwoFARegister
        );

TwoFARouter
        .route("/verify")
        .options(corsWithOptions)
        .post(
                protect,
                InitOnlyEmailConfirmation,
                PreferedTwoFA, 
                postTwoFAVerify
        );

TwoFARouter
        .route("/validate")
        .options(corsWithOptions)
        .post(
                protect, 
                InitOnlyEmailConfirmation,
                PreferedTwoFA, 
                postTwoFAValidate
        );

module.exports = TwoFARouter;